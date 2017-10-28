function Loader(){
	
	this.loadSaved = function(){
		var versions = globals.env.getSavedVersions();
		for(var version in versions){
			_findFile(versions[version], _extractData);
		}
	}
	
	this.load = function(file){
		if(!file)
			return;
		
		if(file.constructor === FileList){
			for(var i = 0; i < file.length; i++){
				this.load(file[i]);
			}
			return;
		}
		
		if(file.constructor !== File)
			return;
		
		_findFile(file.path, _extractData);
	}
	
	function _extractData(file, dropped, id){

		var folder = file;

		_extractChangelog(folder, dropped, id, function(data){
			
			if (data.containerId)
			{
				globals.env.saveVersionPath(data.containerId, folder);
			}
			
			globals.gameData.addData(data.shortId, "changelog", data.changelog);
			globals.gameData.addData(data.shortId, "containerId", data.containerId);
			globals.gameData.addData(data.shortId, "gameId", data.gameId);
			globals.gameData.addData(data.shortId, "shortId", data.shortId);
			globals.gameData.addData(data.shortId, "version", data.version);
			globals.gameData.addData(data.shortId, "path", data.path);
			
			$.getJSON(data.path.data + "database.json").done(function(json){
				globals.gameData.addData(data.shortId, "database", json);
			});
			$.getJSON(data.path.data + "global-settings.json").done(function(json){
				globals.gameData.addData(data.shortId, "globalSettings", json);
			});
			$.getJSON(data.path.data + "item-database.json").done(function(json){
				globals.gameData.addData(data.shortId, "items", json.items);
			}); // fail if old version
			
			//"/media/font/icons-items.png"
			var iconSpecify = ["undef", "item-helm", "item-sword", "item-belt", "item-shoe", "item-items", "item-key", "item-trade"];
			var iconSet = { dimension: {width: 14, height: 16, xpad: 1, ypad: 1}, column: 8, row: 5 };

			for (var rowIndex = 0; rowIndex < iconSet.row; rowIndex++) {
				for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++) {
					var startX = columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad);
					var startY = rowIndex * (iconSet.dimension.height + iconSet.dimension.ypad);

					globals.imageData.addImage(data.shortId, "items", iconSpecify[columnIndex] + rowIndex,
						data.path.media + "font" + path.sep + "icons-items.png", "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
				}
			}
			
			//"/media/gui/menu.png"
			var iconSpecify = ["hp", "attack", "defense", "focus", "elemHeat", "elemCold", "elemShock", "elemWave"];
			var iconSet = { dimension: {width: 11, height: 11, xpad: 1}, column: 8, xstart: 33, ystart: 280 };

			for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++) {
				var startX = (columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad)) + iconSet.xstart;
				var startY = iconSet.ystart;

				globals.imageData.addImage(data.shortId, "items", iconSpecify[columnIndex], 
					data.path.media + "gui" + path.sep + "menu.png", "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
			}
			
			globals.menu.updateAll();
		});
	}
	
	function _nwjsExec(folder, exec) {

		if (globals.env.os == "darwin")
		{
			// TODO
			// exec.vanilla.push({ path: folder, os: "raw", isExecutable: rawIsExec });
		}
		else if (globals.env.os == "win32")
		{
			// TODO
		}
		else if (globals.env.os == "linux")
		{
			// TODO
		}

	}

	function _searchExec(folder, exec) {

		if (_isApp(folder))
		{
			exec.vanilla.push({ path: folder, os: "darwin", isExecutable: (globals.env.os == "darwin") });
		} else if (_isExe(folder)) {
			exec.vanilla.push({ path: folder, os: "win32", isExecutable: (globals.env.os == "win32") });
		} else if (_isLinuxExec(folder)) {
			exec.vanilla.push({ path: folder, os: "linux", isExecutable: (globals.env.os == "linux") });
		} else if (_isCCMain(folder)) {
			folder = folder.slice(0, -16);
			_nwjsExec(folder, exec);
		} else if(_isDirectory(folder)) {

			var files = fs.readdirSync(folder);
			
			for(var i in files){
				var file = fs.realpathSync(folder + path.sep + files[i]);
				_searchExec(file, exec); // Recursive search
			}

		}

	}

	function _extractChangelog(folder, dropped, id, cb){

		var pathList = { main: folder,
			data: folder + "data" + path.sep,
			page: folder + "game" + path.sep + "page" + path.sep,
			gameHtml: folder + "node-webkit.html",
			gamePackage: folder + "package.json",
			media: folder + "media" + path.sep,
			compiledLogic: folder + "js" + path.sep + "game.compiled.js",
			impact: folder + "impact" + path.sep,
			exec: {
				vanilla: [], // { path: null, os: null, isExecutable: false }
				ccloader: [] // { path: null, os: null, isExecutable: false }
			}
		};

		_searchExec(dropped, pathList.exec);

		var gameId = crypto.createHash('sha256');
		gameId.update(pathList.main);

		var gameIdHex = gameId.digest('hex');
		var shortIdHex = gameIdHex.substr(0,8);

		$.getJSON(pathList.data + "changelog.json").done(function(data){

			var versionArray = data.changelog[0].version.split('.');
			var versionString = data.changelog[0].version;
			var hotfixNumber = 0;

			if (Array.isArray(data.changelog[0].fixes)) {
				var searchPattern = /HOTFIX\(([0-9]+)\)/i
				var patternResult = searchPattern.exec(data.changelog[0].fixes[data.changelog[0].fixes.length - 1]);

				if (patternResult && patternResult[1]) {
					hotfixNumber = Number(patternResult[1]);
					versionString += "-" + patternResult[1];
				}
			}
			
			var callbackData = {changelog: data.changelog,
					containerId: id,
					gameId: gameIdHex,
					shortId: shortIdHex,
					path: pathList,
					version: {
						major: Number(versionArray[0]),
						minor: Number(versionArray[1]),
						patch: Number(versionArray[2]),
						hotfix: hotfixNumber,
						string: versionString
					}};
					
			cb(callbackData);
		});
	}
	
	function _findFile(file, cb){
		if(_isDirectory(file) || _isApp(file)){
			return _searchDirectory(file, file, cb);
		}
		
		var start = _getZip(file);
		if(start < 0)
			return _searchDirectory(path.dirname(file), file, cb);
		
		_unZip(file, start, function(unzipPath, id){
			cb(unzipPath + path.sep + MAIN_PATH + path.sep, file, id);
		});
	}
	
	function _isApp(file){
		return ((file.endsWith(".app")) &&
			(fs.existsSync(file + path.sep + "Contents" + path.sep + "Info.plist")) &&
			(fs.existsSync(file + path.sep + "Contents" + path.sep + "MacOS" + path.sep + "nwjs")) &&
			(fs.existsSync(file + path.sep + "Contents" + path.sep + "Resources" + path.sep + "app.nw" + path.sep + "package.json"))
			);
	}

	function _isExe(file){
		return file.endsWith(".exe");
	}

	function _isLinuxExec(file){
		return false;
	}
	
	function _getId(file){
		var id = crypto.createHash('sha256');
		id.update(file);

		id = id.digest('hex');
		id = id.substr(0, 8);
		return id;
	}
	
	function _searchDirectory(folder, dropped, cb){
		var files = fs.readdirSync(folder);
		
		for(var i in files){
			var file = fs.realpathSync(folder + path.sep + files[i]);
			if(_isCCMain(file)){ // Check if data folder
				file = file.slice(0, -16);
				cb(file, dropped, null);
			} else if(_isDirectory(file)){
				_searchDirectory(file, dropped, cb); // Recursive search
			}
		}
	}

	function _isCCMain(files){
		return files.endsWith(path.sep + "node-webkit.html");
	}
	
	function _isDirectory(file){
		return fs.lstatSync(file).isDirectory();
	}
	
	function _getZip(file){
		if(file.toLowerCase().endsWith(".zip"))
			return 0;
		
		return _checkSignature(file);
	}
	
	function _checkSignature(file){
		var data = fs.readFileSync(file);
		for(var i = 0; i < data.length - 34; ++i) {
											// Signature
			if ((data[i] == 0x50) &&		// P
				(data[i + 1] == 0x4b) &&	// K
				(data[i + 2] == 0x03) &&	// 0x3
				(data[i + 3] == 0x04) &&	// 0x4

				(data[i + 30] == 0x64) &&	// d
				(data[i + 31] == 0x61) &&	// a
				(data[i + 32] == 0x74) &&	// t
				(data[i + 33] == 0x61) &&	// a
				(data[i + 34] == 0x2f)) {	// slash
			
				return i;
			}
		}
		
		return -1;
	}
	
	function _unZip(file, start, callback){
		var id = _getId(file);
		var unzipPath = globals.env.path.storage + path.sep + id + path.sep;
		fs.createReadStream(file, {start: start})
			.pipe(unzip.Extract({ path: unzipPath }))
			.on('close', function () {
				if(callback)
					callback(unzipPath, file, id);
			});
	}
}