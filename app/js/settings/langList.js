function langList()
{
	this.getTable = function(currentId) {

		var langString = "";
		var langArray = langData.getList();

		for(var langId in langArray)
		{
			var langValue = langArray[langId].langId + "_" + langArray[langId].langIdSub;
			var langName = langArray[langId].langName;
			if (langArray[langId].langNameSub != null)
			{
				langName += " (" + langArray[langId].langNameSub + ")";
			}
			var selected = "";
			if (currentId == langValue) selected = "selected";

			langString += "<option value=\"" + langValue + "\" " + selected + ">" + langName + "</option>";

		}

		return langString;

	}
}