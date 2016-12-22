function versioner()
{

	this.getList = function(currentId)
	{

		var selectorString = "";

		for(var versionIndex in gameData.idArray)
		{
			var gameId = gameData.idArray[versionIndex];
			var entryName = gameId + " - " + gameData.gameArray[gameId].version.string;
			var selected = "";
			if (currentId == gameId) selected = "selected";

			selectorString += "<option value=\"" + gameId + "\" " + selected + ">" + entryName + "</option>";

		}

		return selectorString;

	}

}