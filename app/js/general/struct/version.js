function versioner()
{

	this.getList = function(currentId)
	{

		var selectorString = "";

		for(var versionIndex in spo.gameData.idArray)
		{
			var gameId = spo.gameData.idArray[versionIndex];
			var entryName = gameId + " - " + spo.gameData.gameArray[gameId].version.string;
			var selected = "";
			if (currentId == gameId) selected = "selected";

			selectorString += "<option value=\"" + gameId + "\" " + selected + ">" + entryName + "</option>";

		}

		return selectorString;

	}

}