function Loader(){
	const MAC_APP_PATH = "/Contents/Resources/app.nw";
	const MAIN_PATH = "node-webkit.html";
	
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
	
	function _extractData(file, id){

		var folder = "";

		// id is null if there is no container to create
		// -> Use the game folder directly
		// -> path.dirname dosn't work with MAC_APP_PATH
		// (Replace it with /Contents/Resources/)
		if (id === null) {
			folder = file + path.sep;
		} else {
			folder = path.dirname(file) + path.sep;
		}

		_extractChangelog(folder, id, function(data){
			globals.env.saveVersionPath(data.containerId, folder);
			
			globals.gameData.addData(data.shortId, "changelog", data.changelog);
			globals.gameData.addData(data.shortId, "containerId", data.containerId);
			globals.gameData.addData(data.shortId, "gameId", data.gameId);
			globals.gameData.addData(data.shortId, "shortId", data.shortId);
			globals.gameData.addData(data.shortId, "version", data.version);
			globals.gameData.addData(data.shortId, "path", data.path);
			
			
			$.getJSON(data.path.main + data.path.list[0] + "database.json").done(function(json){
				globals.gameData.addData(data.shortId, "database", json);
			});
			$.getJSON(data.path.main + data.path.list[0] + "global-settings.json").done(function(json){
				globals.gameData.addData(data.shortId, "globalSettings", json);
			});
			$.getJSON(data.path.main + data.path.list[0] + "item-database.json").done(function(json){
				globals.gameData.addData(data.shortId, "items", json.items);
			});
			
			//"/media/font/icons-items.png"
			var iconSpecify = ["undef", "item-helm", "item-sword", "item-belt", "item-shoe", "item-items", "item-key", "item-trade"];
			var iconSet = { dimension: {width: 14, height: 16, xpad: 1, ypad: 1}, column: 8, row: 5 };

			for (var rowIndex = 0; rowIndex < iconSet.row; rowIndex++) {
				for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++) {
					var startX = columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad);
					var startY = rowIndex * (iconSet.dimension.height + iconSet.dimension.ypad);

					globals.imageData.addImage(data.shortId, "items", iconSpecify[columnIndex] + rowIndex,
						data.path.main + data.path.list[2] + "font" + path.sep + "icons-items.png", "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
				}
			}
			
			//"/media/gui/menu.png"
			var iconSpecify = ["hp", "attack", "defense", "focus", "elemHeat", "elemCold", "elemShock", "elemWave"];
			var iconSet = { dimension: {width: 11, height: 11, xpad: 1}, column: 8, xstart: 33, ystart: 280 };

			for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++) {
				var startX = (columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad)) + iconSet.xstart;
				var startY = iconSet.ystart;

				globals.imageData.addImage(data.shortId, "items", iconSpecify[columnIndex], 
					data.path.main + data.path.list[2] + "gui" + path.sep + "menu.png", "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
			}
			
			globals.menu.updateAll();
		});
	}
	
	function _extractChangelog(folder, id, cb){

		var folderList = [ "data" + path.sep,
						   "game" + path.sep,
						   "media" + path.sep,
						   "js" + path.sep,
						   "impact" + path.sep ];

		var gameId = crypto.createHash('sha256');
		gameId.update(folder);

		var gameIdHex = gameId.digest('hex');
		var shortIdHex = gameIdHex.substr(0,8);

		$.get(folder + folderList[0] + "changelog.json").done(function(raw){

			var data = JSON.parse(raw);
			
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
					path: {main: folder, list: folderList},
					version: {major: Number(versionArray[0]), minor: Number(versionArray[1]), patch: Number(versionArray[2]), hotfix: hotfixNumber, string: versionString}};
					
			cb(callbackData);
		});
	}
	
	function _findFile(file, cb){
		// Mac apps are folders
		// Check always first
		if(_isApp(file)){
			return cb(file + MAC_APP_PATH, null);
		}

		if(_isDirectory(file)){
			return _searchDirectory(file, cb);
		}
		
		var start = _getZip(file);
		if(start < 0)
			return _searchDirectory(path.dirname(file), cb);
		
		_unZip(file, start, function(unzipPath, id){
			cb(unzipPath + path.sep + MAIN_PATH, id);
		});
	}
	
	function _isApp(file){
		return file.endsWith(".app");
	}
	
	function _getId(file){
		var id = crypto.createHash('sha256');
		id.update(file);

		id = id.digest('hex');
		id = id.substr(0, 8);
		return id;
	}
	
	function _searchDirectory(folder, cb){
		var files = fs.readdirSync(folder);
		
		for(var i in files){
			var file = fs.realpathSync(folder + path.sep + files[i]);
			if(file.endsWith(path.sep + MAIN_PATH)) //Is 'folder' /assets ?
				cb(file, _getId(file));
			else if(_isDirectory(file)){
				var subFiles = fs.readdirSync(file); //Check subfolder
				for(var j in subFiles){
					var subFile = fs.realpathSync(file + path.sep + subFiles[j]);
					if(subFile.endsWith(path.sep + MAIN_PATH)){ //Is 'folder/subFile' /assets ?
						cb(subFile, _getId(subFile));
						break;
					}
				}
			}
		}
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
		for(var i = 0; i < data.length - 34; i++) {
											// Signature
			if ((data[i] == 0x50) &&		// P
				(data[i + 1] == 0x4b) &&	// K
				(data[i + 2] == 0x03) &&   // 0x3
				(data[i + 3] == 0x04) &&	// 0x4

				(data[i + 30] == 0x64) &&	// d
				(data[i + 31] == 0x61) && 	// a
				(data[i + 32] == 0x74) && 	// t
				(data[i + 33] == 0x61) && 	// a
				(data[i + 34] == 0x2f)) { 	// slash
			
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
				if(cb)
					cb(unzipPath, id);
			});
	}
}