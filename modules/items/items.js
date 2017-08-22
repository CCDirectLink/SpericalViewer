function Items(){
	var itemData = {
				selectedVersion: globals.gameData.getVersions()[0],
				version: new Version(),
				versionTrigger: function() {
					var version = $("#versionList")[0].options[$("#versionList")[0].selectedIndex].value;
					itemData.selectedVersion = version;
					$("#itemData").html("<table>" + _getTable(version) + "</table>");
				}
			};
	
	this.display = function(){
		$("h1").html(globals.langData.getEntry("items"));
		$("#versionSelect").html(globals.langData.getEntry("version"));

		if (!globals.gameData.hasGame(itemData.selectedVersion)) {
			itemData.selectedVersion = globals.gameData.getVersions()[0];
		}
		
		// init versions
		$("#versionList").html(itemData.version.getList(itemData.selectedVersion));

		// init table
		$("#itemData").html("<table>" + _getTable(itemData.selectedVersion) + "</table>");
	}
	
	function _getTable(version) {
		debugger;
		
		var version = globals.gameData.getVersions()[0];
		if(!version)
			return;
		
		globals.imageData.registerObserver("items", ["hp", "attack", "defense", "focus"], function(){
			globals.items.display();
		});
		
		var tableString = "<tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("item") + "</th><th>" + globals.langData.getEntry("stats") + "</th></tr>";

		if (!globals.gameData.hasGame(version)) 
			return tableString;

		var items = globals.gameData.versions[version].items;
		for (var i in items) {
			var item = items[i];
			tableString += "<tr><td>" + i + "</td><td>";
			tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage(version, "items", item.icon + item.rarity) + "'/> ";
			tableString += "<span class='item-entry-text'>" + item.name.en_US + "</td><td>";
			
			globals.imageData.registerObserver("items", item.icon + item.rarity, function(){
				globals.items.display();
			});
			
			if (item.params !== undefined) {
				var first = true;
				var params = item.params;

				if (params.hp !== undefined) {
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage(version, "items", "hp") + "'/> <span class='item-entry-text'>" +params.hp + "</span>";
					first = false;
				}
				if (params.attack !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage(version, "items", "attack") + "'/> <span class='item-entry-text'>" + params.attack + "</span>";
				}
				if (params.defense !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage(version, "items", "defense") + "'/> <span class='item-entry-text'>" + params.defense + "</span>";
				}
				if (params.focus !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage(version, "items", "focus") + "'/> <span class='item-entry-text'>" + params.focus + "</span>";
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}
globals.items = new Items();


globals.module.registerOnLoaded(function(){
	globals.menu.add("Items", function(){}, "../modules/items/items.html", true);
	globals.menu.updateAll();
});