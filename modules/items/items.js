function Items(){
	function initialize(){
		
	}
	
	initialize.call(this);
}
globals.items = new Items();


globals.module.registerOnLoaded(function(){
	globals.menu.add("Items", function(){}, "../modules/items/items.html", true);
	globals.menu.updateAll();
});