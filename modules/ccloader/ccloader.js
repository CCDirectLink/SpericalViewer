function CCLoader(){
	const DOWNLOAD_LINK = "https://github.com/CCDirectLink/CCLoader/archive/master.zip";
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
	
	function _getTable(){
		var tableString = "<table><tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("version") + "</th><th>" + globals.langData.getEntry("installed") + "</th></tr>";
		
		for(var id in globals.gameData.versions){
			var game = globals.gameData.versions[id];
			tableString += "<tr><td>" + id + "</td><td>" + game.version.string + "</td><td>";
			
			if(_isInstalled(game)){
				tableString += globals.langData.getEntry("installed");
			}else{
				tableString += "</tr><tr>install"
			}
			
			tableString += "</td></tr>";
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