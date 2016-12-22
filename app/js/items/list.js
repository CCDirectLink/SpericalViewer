function itemViewer()
{
	this.getTable = function(entry)
	{
		var tableString = "<tr><th>Id</th><th>Item</th><th>Stats</th></tr>";

		if ((typeof gameData.gameArray[entry] == "undefined") || (gameData.gameArray[entry] == null) || (typeof gameData.gameArray[entry].items == "undefined") || (gameData.gameArray[entry].items == null)) return tableString;

		for (var itemIndex in gameData.gameArray[entry].items)
		{
			tableString += "<tr><td>" + itemIndex + "</td><td>";
			tableString += "<img src='" + imageData.getImage("items", gameData.gameArray[entry].items[itemIndex].icon + gameData.gameArray[entry].items[itemIndex].rarity) + "'/> ";
			tableString += gameData.gameArray[entry].items[itemIndex].name.en_US + "</td><td>";
			if (typeof gameData.gameArray[entry].items[itemIndex].params != "undefined")
			{

				var first = true;

				if (typeof gameData.gameArray[entry].items[itemIndex].params.hp != "undefined")
				{
					tableString += "<img src='" + imageData.getImage("items", "hp") + "'/> " + gameData.gameArray[entry].items[itemIndex].params.hp;
					first = false;
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.attack != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img src='" + imageData.getImage("items", "attack") + "'/> " + gameData.gameArray[entry].items[itemIndex].params.attack;
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.defense != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img src='" + imageData.getImage("items", "defense") + "'/> " + gameData.gameArray[entry].items[itemIndex].params.defense;
				}
				if (typeof gameData.gameArray[entry].items[itemIndex].params.focus != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img src='" + imageData.getImage("items", "focus") + "'/> " + gameData.gameArray[entry].items[itemIndex].params.focus;
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}