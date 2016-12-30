var currentMenuMode = -1;

$(function(){

	currentMenuMode = 0;
	menuMode(0);
	spo.globalMenu.select(0);

});

function updateMenu()
{
	var curentEntry = spo.globalMenu.getSelect();
	menuMode(currentMenuMode);
	spo.globalMenu.select(curentEntry);
}

function menuMode(mode)
{

	spo.globalMenu.clear();

	switch (mode)
	{
		case 0:

			// --
			spo.globalMenu.add(spo.langData.getEntry("status"), null, "elements/status.html", true);

			// --
			spo.globalMenu.add(spo.langData.getEntry("items"), null, "elements/items.html", spo.gameData.hasGame());
			spo.globalMenu.add(spo.langData.getEntry("savegames"), null, null, false);//spo.gameData.hasGame());
			spo.globalMenu.add(spo.langData.getEntry("botanic"), null, null, false);//spo.gameData.hasGame());
			spo.globalMenu.add(spo.langData.getEntry("enemies"), null, null, false);//spo.gameData.hasGame());

			// --
			spo.globalMenu.add(spo.langData.getEntry("rawData") + " ...", rawDataCall, null, false);//spo.gameData.hasGame());

			// --
			spo.globalMenu.add(spo.langData.getEntry("settings"), null, "elements/settings.html", true);
			break;

		case 1:

			// --
			spo.globalMenu.add("..", rawDataBackCall, null, true);

			// --
			spo.globalMenu.add("test", null, "elements/test.html", true);
			break;
	}

	spo.globalMenu.updateAll();

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
	spo.gameData.registerCallback(function(data, entry, identifier, controller){
		if ((data == null) && (!controller.hasGame()))
		{
			updateMenu();
		}
	}, null);
})