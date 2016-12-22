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
			globalMenu.add("Status", null, "elements/status.html", true);

			// --
			globalMenu.add("Items", null, "elements/items.html", gameData.hasGame());
			globalMenu.add("Savegames", null, null, false);//gameData.hasGame());
			globalMenu.add("Botanic", null, null, false);//gameData.hasGame());
			globalMenu.add("Enemies", null, null, false);//gameData.hasGame());

			// --
			globalMenu.add("Raw data ...", rawDataCall, null, false);//gameData.hasGame());

			// --
			globalMenu.add("Settings", null, "elements/settings.html", true);
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