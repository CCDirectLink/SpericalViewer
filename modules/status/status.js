function Status(){
	var statusArray = [];
	
	function initialize(){
		globals.gameData.registerObserver(function(game, property, value) {
			if (!value) {
				for (var i in statusArray) {
					if (statusArray[i].id == property) {
						statusArray.splice(i, 1);
					}
				}
			} else {
				var sizeData = "0 kiB";
				statusArray.push({id: game.shortId, containerId: game.containerId, version: game.version.string, size: sizeData});
			}

			$( "#loadedGame").html("<table>" + _getTable() + "</table>");

		}, "version");
	}
	
	this.display = function(){
		$("#license").html(globals.langData.getEntry("license"));
		$("#loadedGameTitle").html(globals.langData.getEntry("loadedGames"));
		$("#storedGameTitle").html(globals.langData.getEntry("storedGameData"));

		// init programm data
		$("h1").html(globals.env.name);
		$("#version").html(globals.env.version.string);

		$("#rev").html(globals.env.version.rev);
		$("#year").html(globals.env.build.date.year);

		// init table
		$("#loadedGame").html("<table>" + _getTable() + "</table>");
		$("#storedGame").html(globals.langData.getEntry("noGames"));
	}
	
	function _getTable() {
		var tableString = "<tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("containerId") + "</th><th>" + globals.langData.getEntry("version") + "</th><th>" + globals.langData.getEntry("cacheSize") + "</th><th></th></tr>";

		if (statusArray.length == 0)
			return globals.langData.getEntry("noGames");

		for (var i in statusArray) {
			tableString += "<tr><td>" + statusArray[i].id + "</td><td>" + statusArray[i].containerId + "</td><td>" + statusArray[i].version + "</td><td>" + statusArray[i].size + "</td><td><a class=\"close\" id=\"" + statusArray[i].id + "\" onclick=\"globals.gameData.removeData('" + statusArray[i].id + "');\">" + globals.langData.getEntry("close") + "</a></td></tr>";
		}

		return tableString;
	}
	
	initialize();
}
globals.status = new Status();


globals.module.registerOnLoaded(function(){
	globals.menu.add("Status", function(){}, "../modules/status/status.html", true);
	globals.menu.updateAll();
});