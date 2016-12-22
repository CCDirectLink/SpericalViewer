var currentMenuMode = -1;

$(function(){

	currentMenuMode = 0;
	menuMode(0);
	globalMenu.select(0);

});

function updateMenu()
{
	var curentEntry = globalMenu.getSelect();
	menuMode(currentMenuMode);
	globalMenu.select(curentEntry);
}

function menuMode(mode)
{

	globalMenu.clear();

	switch (mode)
	{
		case 0:

			// --
			globalMenu.add(langData.getEntry("status"), null, "elements/status.html", true);

			// --
			globalMenu.add(langData.getEntry("items"), null, "elements/items.html", gameData.hasGame());
			globalMenu.add(langData.getEntry("savegames"), null, null, false);//gameData.hasGame());
			globalMenu.add(langData.getEntry("botanic"), null, null, false);//gameData.hasGame());
			globalMenu.add(langData.getEntry("enemies"), null, null, false);//gameData.hasGame());

			// --
			globalMenu.add(langData.getEntry("rawData") + " ...", rawDataCall, null, false);//gameData.hasGame());

			// --
			globalMenu.add(langData.getEntry("settings"), null, "elements/settings.html", true);
			break;

		case 1:

			// --
			globalMenu.add("..", rawDataBackCall, null, true);

			// --
			globalMenu.add("test", null, "elements/test.html", true);
			break;
	}

	globalMenu.updateAll();

}

function rawDataCall(id)
{
	currentMenuMode = 1;
	menuMode(1);
}

function rawDataBackCall(id)
{
	currentMenuMode = 0;
	menuMode(0);
}


$(function(){
	gameData.registerCallback(function(data, entry, identifier, controller){
		if ((data == null) && (!controller.hasGame()))
		{
			updateMenu();
		}
	}, null);
})