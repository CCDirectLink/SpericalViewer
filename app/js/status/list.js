function statusList()
{
	this.statusArray = Array();

	this.getTable = function() {
		var tableString = "<tr><th>" + langData.getEntry("id") + "</th><th>" + langData.getEntry("version") + "</th><th>" + langData.getEntry("cacheSize") + "</th><th></th></tr>";

		if (this.statusArray.length == 0) return langData.getEntry("noGames");

		for (var gameIndex in this.statusArray)
		{
			tableString += "<tr><td>" + this.statusArray[gameIndex].id + "</td><td>" + this.statusArray[gameIndex].version + "</td><td>" + this.statusArray[gameIndex].size + "</td><td><a class=\"close\" id=\"" + this.statusArray[gameIndex].id + "\" onclick=\"gameData.removeData('" + this.statusArray[gameIndex].id + "');\">" + langData.getEntry("close") + "</a></td></tr>";
		}

		return tableString;
	}

}