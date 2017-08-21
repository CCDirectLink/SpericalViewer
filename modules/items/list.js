function ItemViewer() {
	this.getTable = function(entry) {
		var tableString = "<tr><th>" + globals.langData.getEntry("id") + "</th><th>" + globals.langData.getEntry("item") + "</th><th>" + globals.langData.getEntry("stats") + "</th></tr>";

		if ((globals.gameData.gameArray[entry] == undefined) || (globals.gameData.gameArray[entry].items == undefined)) 
			return tableString;

		for (var itemIndex in globals.gameData.gameArray[entry].items) {
			tableString += "<tr><td>" + itemIndex + "</td><td>";
			tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage("items", globals.gameData.gameArray[entry].items[itemIndex].icon + globals.gameData.gameArray[entry].items[itemIndex].rarity) + "'/> ";
			tableString += "<span class='item-entry-text'>" + globals.gameData.gameArray[entry].items[itemIndex].name.en_US + "</td><td>";
			if (globals.gameData.gameArray[entry].items[itemIndex].params !== undefined) {
				var first = true;

				if (globals.gameData.gameArray[entry].items[itemIndex].params.hp !== undefined) {
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage("items", "hp") + "'/> <span class='item-entry-text'>" + globals.gameData.gameArray[entry].items[itemIndex].params.hp + "</span>";
					first = false;
				}
				if (globals.gameData.gameArray[entry].items[itemIndex].params.attack !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage("items", "attack") + "'/> <span class='item-entry-text'>" + globals.gameData.gameArray[entry].items[itemIndex].params.attack + "</span>";
				}
				if (globals.gameData.gameArray[entry].items[itemIndex].params.defense !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage("items", "defense") + "'/> <span class='item-entry-text'>" + globals.gameData.gameArray[entry].items[itemIndex].params.defense + "</span>";
				}
				if (globals.gameData.gameArray[entry].items[itemIndex].params.focus !== undefined) {
					if (!first) 
						tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + globals.imageData.getImage("items", "focus") + "'/> <span class='item-entry-text'>" + globals.gameData.gameArray[entry].items[itemIndex].params.focus + "</span>";
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}
