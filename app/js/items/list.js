function itemViewer()
{
	this.getTable = function(entry)
	{
		var tableString = "<tr><th>" + spo.langData.getEntry("id") + "</th><th>" + spo.langData.getEntry("item") + "</th><th>" + spo.langData.getEntry("stats") + "</th></tr>";

		if ((typeof spo.gameData.gameArray[entry] == "undefined") || (spo.gameData.gameArray[entry] == null) || (typeof spo.gameData.gameArray[entry].items == "undefined") || (spo.gameData.gameArray[entry].items == null)) return tableString;

		for (var itemIndex in spo.gameData.gameArray[entry].items)
		{
			tableString += "<tr><td>" + itemIndex + "</td><td>";
			tableString += "<img class='item-entry-icon' src='" + spo.imageData.getImage("items", spo.gameData.gameArray[entry].items[itemIndex].icon + spo.gameData.gameArray[entry].items[itemIndex].rarity) + "'/> ";
			tableString += "<span class='item-entry-text'>" + spo.gameData.gameArray[entry].items[itemIndex].name.en_US + "</td><td>";
			if (typeof spo.gameData.gameArray[entry].items[itemIndex].params != "undefined")
			{

				var first = true;

				if (typeof spo.gameData.gameArray[entry].items[itemIndex].params.hp != "undefined")
				{
					tableString += "<img class='item-entry-icon' src='" + spo.imageData.getImage("items", "hp") + "'/> <span class='item-entry-text'>" + spo.gameData.gameArray[entry].items[itemIndex].params.hp + "</span>";
					first = false;
				}
				if (typeof spo.gameData.gameArray[entry].items[itemIndex].params.attack != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + spo.imageData.getImage("items", "attack") + "'/> <span class='item-entry-text'>" + spo.gameData.gameArray[entry].items[itemIndex].params.attack + "</span>";
				}
				if (typeof spo.gameData.gameArray[entry].items[itemIndex].params.defense != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + spo.imageData.getImage("items", "defense") + "'/> <span class='item-entry-text'>" + spo.gameData.gameArray[entry].items[itemIndex].params.defense + "</span>";
				}
				if (typeof spo.gameData.gameArray[entry].items[itemIndex].params.focus != "undefined")
				{
					if (!first) tableString += "<br />";
					first = false;
					tableString += "<img class='item-entry-icon' src='" + spo.imageData.getImage("items", "focus") + "'/> <span class='item-entry-text'>" + spo.gameData.gameArray[entry].items[itemIndex].params.focus + "</span>";
				}
			}
			tableString += "</td></tr>";
		}

		return tableString;
	}
}
