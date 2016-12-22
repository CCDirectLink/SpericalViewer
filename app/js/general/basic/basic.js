
var globalMenu = new menuController();
var gameData = new gameDataController();
var moduleMemory = new memoryController();
var imageData = new imageController();
var langData = new languageController();

langData.loadAll(function(){
	langData.setLang("en", "us");
});

$(function(){

  console.log("basic logic - " + envVersion);

  globalMenu.menuElement = $( "#menulist" )[0];
  globalMenu.entryElement = $( ".entrycontainer" )[0];

});