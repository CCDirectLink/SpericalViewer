function CCLoader(){
	const DOWNLOAD_LINK = "https://codeload.github.com/CCDirectLink/CCLoader/zip/master";
	var location = {};
	
	this.initialize = function(){
		globals.gameData.registerObserver(function(){
			globals.ccloader.display();
		}, "path");
	}
	
	this.display = function(){
		if(globals.gameData.getVersions().length === 0){
			$("h2").html(globals.langData.getEntry("noGames"));
			return;
		}
		
		$("#ccloaderData").html(_getTable());
	}
	
	this.install = function(id){
		$('#install' + id).html("");
		$('h2').html(globals.langData.getEntry("downloading"));
		
		var filename = "ccloader.zip" //Might have to be changed to be platform-independant
		var file = fs.createWriteStream(filename); 
		var request = https.get(DOWNLOAD_LINK, function(response) {
			response.on('end', function(data){
				file.close();
				$('h2').html(globals.langData.getEntry("installing"));
				_extract(filename, globals.gameData.versions[id].path.main + "..", function(){
					$('h2').html("");
					globals.ccloader.display();
				});
			});
			response.on('data', function(data){
				file.write(data, function(err){
					if(err)
						throw err;
				});
			});
		});
	}
	
	this.start = function(id){
		exec(globals.gameData.versions[id].path.main + "../crosscode-beta.exe"); //TODO: Make platform-independant
	}
	
	function _extract(file, unzipPath, cb){
		fs.createReadStream(file)
			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				if(entry.type === "Directory"){
					try{
						fs.mkdirSync(unzipPath + entry.path.substr(15));
					} catch(e) {}
					entry.autodrain();
				} else if(entry.type === "File") {
					entry.pipe(fs.createWriteStream(unzipPath + entry.path.substr(15)));
				} else {
					entry.autodrain();
				}
			})
			.on('close', function () {
				if(cb)
					cb(unzipPath);
			});
	}
	function _getTable(){
		var tableString = "<table><tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("version") + "</th><th>" + globals.langData.getEntry("installed") + "</th><th>" + globals.langData.getEntry("start") + "</th></tr>";
		
		for(var id in globals.gameData.versions){
			var game = globals.gameData.versions[id];
			tableString += "<tr><td>" + id + "</td><td>" + game.version.string + "</td><td id=\"install" + id + "\">";
			
			if(_isInstalled(game)){
				tableString += globals.langData.getEntry("installed");
			}else{
				tableString += "<button onclick=\"globals.ccloader.install('" + id + "')\">" + globals.langData.getEntry("install") + "</button>";
			}
			
			tableString += "</td><td><button onclick=\"globals.ccloader.start('" + id + "')\">" + globals.langData.getEntry("start") + "</button></td></tr>";
		}
		
		tableString += "</table>";
		
		return tableString;
	}
	function _isInstalled(game){
		return fs.existsSync(game.path.main + "../ccloader/");
	}
	
	this.initialize();
}
globals.ccloader = new CCLoader();

globals.module.registerOnLoaded(function(){
	globals.menu.add("CCLoader", function(){}, "../modules/ccloader/ccloader.html", true);
	globals.menu.updateAll();
});