function itemViewer()
{
	this.getTable = function(entry)
	{
		var tableString = "<tr><th>Id</th><th>Item</th><th>Stats</th></tr>";

		if ((typeof gameData.gameArray[entry] == "undefined") || (gameData.gameArray[entry] == null) || (typeof gameData.gameArray[entry].items == "undefined") || (gameData.gameArray[entry].items == null)) return tableString;

		for (var itemIndex in gameData.gameArray[entry].items)
		{
			tableString += "<tr><td>" + itemIndex + "</td><td>";
			tableString += "<img class='item-entry-icon' src='" + imageData.getImage("items", gameData.gameArray[entry].items[itemIndex].icon + gameData.gameArray[entry].items[itemIndex].rarity) + "'/> ";
			tableString += "<span class='item-entry-text'>" + gameData.gameArray[entry].items[itemIndex].name.en_US + "</td><td>";
			if (typeof gameData.gameArray[entry].items[itemIndex].params != "undefined")
			{

				var first = true;

				if (typeof gameData.gameArray[entry].items[itemIndex].params.hp != "undefined")
				{
					tableString += "<img class='item-entry-icon' src='" + imageData.getImage("items", "hp") + "'/> <span class='item-entry-text'>" + gameData.gameArray[entry].items[itemIndex].params.hp + "</span>";
					first = false;
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.attack != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + imageData.getImage("items", "attack") + "'/> <span class='item-entry-text'>" + gameData.gameArray[entry].items[itemIndex].params.attack + "</span>";
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.defense != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + imageData.getImage("items", "defense") + "'/> <span class='item-entry-text'>" + gameData.gameArray[entry].items[itemIndex].params.defense + "</span>";
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.focus != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + imageData.getImage("items", "focus") + "'/> <span class='item-entry-text'>" + gameData.gameArray[entry].items[itemIndex].params.focus + "</span>";
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}
