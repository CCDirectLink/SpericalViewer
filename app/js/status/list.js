function statusList()
{
	this.statusArray = Array();

	this.getTable = function() {
		var tableString = "<tr><th>" + spo.langData.getEntry("id") + "</th><th>" + spo.langData.getEntry("containerId") + "</th><th>" + spo.langData.getEntry("version") + "</th><th>" + spo.langData.getEntry("cacheSize") + "</th><th></th></tr>";

		if (this.statusArray.length == 0) return spo.langData.getEntry("noGames");

		for (var gameIndex in this.statusArray)
		{
			tableString += "<tr><td>" + this.statusArray[gameIndex].id + "</td><td>" + this.statusArray[gameIndex].containerId + "</td><td>" + this.statusArray[gameIndex].version + "</td><td>" + this.statusArray[gameIndex].size + "</td><td><a class=\"close\" id=\"" + this.statusArray[gameIndex].id + "\" onclick=\"spo.gameData.removeData('" + this.statusArray[gameIndex].id + "');\">" + spo.langData.getEntry("close") + "</a></td></tr>";
		}

		return tableString;
	}

}