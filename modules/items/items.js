function Items(){
	var itemData = {
				selectedVersion: globals.gameData.getVersions()[0],
				version: new Version(),
				versionTrigger: function() {
					itemData.selectedVersion = $("#versionList")[0].options[$("#versionList")[0].selectedIndex].value;
					globals.items.updateTable();
				},
				observer: globals.imageData.registerObserver(function(name, tileName, image){
					globals.items.updateIcon(name, tileName, image);
				}, "items"),
				versionChangeObserver: globals.gameData.registerObserver(function(){
					globals.items.updateVersion();
				}, "version")
			};

	var langEntries = globals.module.getLangData();

	globals.module.on("langChanged", function(id, subId, data) {
		langEntries = data;
	});
	
	this.display = function(){
		$("h1").html(langEntries.content['items.items']);
		$("#versionSelect").html(langEntries.content['status.version']);

		if (!globals.gameData.hasGame(itemData.selectedVersion)) {
			itemData.selectedVersion = globals.gameData.getVersions()[0];
		}
		
		
		this.updateTable();
		this.updateVersion();
	}
	
	this.updateTable = function(){
		// init table
		$("#itemData").html("<table>" + _getTable(itemData.selectedVersion) + "</table>");
	}
	
	this.updateVersion = function(){
		if (!globals.gameData.hasGame(itemData.selectedVersion)) {
			itemData.selectedVersion = globals.gameData.getVersions()[0];
		}
		// init versions
		$("#versionList").html(itemData.version.getList(itemData.selectedVersion));
	}
	
	this.updateIcon = function(name, tileName, image){
		var imgs = document.getElementsByClassName(itemData.selectedVersion + ' ' + name + ' ' + tileName);
		for(var i in imgs){
			imgs[i].src = image;
		}
	}
	
	function _getTable(version) {
		var version = globals.gameData.getVersions()[0];
		var tableString = "<tr><th>" + langEntries.content['items.id'] + "</th><th>" + langEntries.content['items.item'] + "</th><th>" + langEntries.content['items.stats'] + "</th></tr>";

		if (!globals.gameData.hasGame(version)) 
			return tableString;

		var items = globals.gameData.versions[version].items;
		for (var i in items) {
			var item = items[i];
			tableString += "<tr><td>" + i + "</td><td>";
			tableString += "<img class='item-entry-icon " + (version + " items " + item.icon + item.rarity) + "' src='" + globals.imageData.getImage(version, "items", item.icon + item.rarity) + "'/> ";
			tableString += "<span class='item-entry-text'>" + item.name.en_US + "</td><td>";
			
			if (item.params !== undefined) {
				var first = true;
				var params = item.params;

				if (params.hp !== undefined) {
					tableString += "<img class='item-entry-icon " + (version + " items hp") + "' src='" + globals.imageData.getImage(version, "items", "hp") + "'/> <span class='item-entry-text'>" +params.hp + "</span>";
					first = false;
				}
				if (params.attack !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon " + (version + " items attack") + "' src='" + globals.imageData.getImage(version, "items", "attack") + "'/> <span class='item-entry-text'>" + params.attack + "</span>";
				}
				if (params.defense !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon " + (version + " items defense") + "' src='" + globals.imageData.getImage(version, "items", "defense") + "'/> <span class='item-entry-text'>" + params.defense + "</span>";
				}
				if (params.focus !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon " + (version + " items focus") + "' src='" + globals.imageData.getImage(version, "items", "focus") + "'/> <span class='item-entry-text'>" + params.focus + "</span>";
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}
globals.items = new Items();

globals.module.on("modulesLoaded", function(){
	globals.menu.add("Items", function(){}, "../modules/items/items.html", function(){
			return globals.gameData.containGames();
		});
	globals.menu.updateAll();
});