
var globalMenu = new menuController();
var gameData = new gameDataController();
var moduleMemory = new memoryController();
var imageData = new imageController();

$(function(){

  console.log("basic logic - " + envVersion);

  globalMenu.menuElement = $( "#menulist" )[0];
  globalMenu.entryElement = $( ".entrycontainer" )[0];

});