function Status(){
	var statusArray = [];
	
	function initialize(){
		globals.gameData.registerObserver(function(game, property, value) {
			if(value) {
				var sizeData = "0 kiB";
				statusArray.push({id: game.shortId, containerId: game.containerId, version: game.version.string, size: sizeData});
			}

			$("#loadedGame").html("<table>" + _getTable() + "</table>");
			$("#storedGame").html("<table>" + _getPathsTable() + "</table>");

			globals.menu.updateAll();

		}, "version");
	}
	
	this.display = function(){
		$("#license").html(globals.langData.getEntry("license"));
		$('#loadGame').html(globals.langData.getEntry("loadGame"));
		$("#loadedGameTitle").html(globals.langData.getEntry("loadedGames"));
		$("#storedGameTitle").html(globals.langData.getEntry("storedGameData"));

		// init programm data
		$("h1").html(globals.env.name);
		$("#version").html(globals.env.version.string);

		$("#rev").html(globals.env.version.rev);
		$("#year").html(globals.env.build.date.year);

		// init table
		$("#loadedGame").html("<table>" + _getTable() + "</table>");
		$("#storedGame").html("<table>" + _getPathsTable() + "</table>");
	}
	
	this.removeData = function(id){
		for (var i in statusArray) {
			if (statusArray[i].id == id) {
				statusArray.splice(i, 1);
			}
		}
		globals.gameData.removeData(id);
	}
	
	this.removeVersion = function(version){
		globals.env.removeVersionPath(version);
		$("#storedGame").html("<table>" + _getPathsTable() + "</table>");
	}
	
	this.onchange = function(){
		globals.loader.load($('#file')[0].files);
		$('#file')[0].value = "";
	}
	
	function _getTable() {
		var tableString = "<tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("containerId") + "</th><th>" + globals.langData.getEntry("version") + "</th><th>" + globals.langData.getEntry("cacheSize") + "</th><th></th></tr>";

		if (statusArray.length === 0)
			return globals.langData.getEntry("noGames");

		for (var i in statusArray) {

			tableString += "<tr><td>" + statusArray[i].id + "</td><td>";

			if (statusArray[i].containerId) {
				tableString += statusArray[i].containerId;
			}
			else
			{
				tableString += "(local)";
			}

			tableString += "</td><td>" + statusArray[i].version + "</td><td>" + statusArray[i].size + "</td><td><a class=\"close\" id=\"" + statusArray[i].id + "\" onclick=\"globals.status.removeData('" + statusArray[i].id + "');\">" + globals.langData.getEntry("close") + "</a></td></tr>";
		
		}

		return tableString;
	}
	
	function _getPathsTable(){
		var tableString = "<tr><th>" + globals.langData.getEntry("containerId") + "</th><th>" + globals.langData.getEntry("path") + "</th><th></th></tr>";

		var versions = globals.env.getSavedVersions();
		if (Object.keys(versions).length === 0)
			return globals.langData.getEntry("noGames");

		for (var version in versions) {
			tableString += "<tr><td>" + version + "</td><td>" + versions[version] + "</td><td><a class=\"close\" id=\"" + version + "\" onclick=\"globals.status.removeVersion('" + version + "');\">" + globals.langData.getEntry("clear") + "</a></td></tr>";
		}

		return tableString;
	}
	
	initialize();
}
globals.status = new Status();


globals.module.registerOnLoaded(function(){
	var id = globals.menu.add("Status", function(){}, "../modules/status/status.html", true, 0);
	globals.menu.updateAll();
	globals.menu.select(id);
});