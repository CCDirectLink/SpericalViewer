
spo.globalMenu = new menuController();
spo.gameData = new gameDataController();
spo.moduleMemory = new memoryController();
spo.imageData = new imageController();
spo.langData = new languageController();

spo.langData.loadAll(function(){
	spo.langData.setLang("en", "us");
});

$(function(){

  console.log("basic logic - " + spo.env.version.string);

  spo.globalMenu.menuElement = $( "#menulist" )[0];
  spo.globalMenu.entryElement = $( ".entrycontainer" )[0];

});