function Settings(){
	var settings = {
			selectedLang: "en_us"
		};
	
	this.langTrigger = function() {
		settings.selectedLang = $( "#langList" )[0].options[$("#langList")[0].selectedIndex].value;
		var split = settings.selectedLang.split("_");
		globals.langData.setLang(split[0], split[1]);
		globals.menu.updateAll();
		this.display();
	}
	
	this.display = function(){
		// container dir
		$("#storageDir").html(globals.langData.getEntry("storage") + ": " + globals.env.path.storage);
		$("#savegameDir").html(globals.langData.getEntry("savegame") + ": " + globals.env.path.save.folder + globals.env.path.seperator + globals.env.path.save.file);
		$("#cacheDir").html(globals.langData.getEntry("cache") + ": " + globals.env.path.cache);

		$("h1").html(globals.langData.getEntry("settings"));
		$(".themeTitle").html(globals.langData.getEntry("theme"));
		$(".langTitle").html(globals.langData.getEntry("lang"));

		$("#langList").html(_getTable(settings.selectedLang));
	}
	
	function _getTable(currentId) {
		var langString = "";
		var langArray = globals.langData.getList();

		for(var i in langArray) {
			var langValue = langArray[i].langId + "_" + langArray[i].langIdSub;
			var langName = langArray[i].langName;
			if (langArray[i].langNameSub != null) {
				langName += " (" + langArray[i].langNameSub + ")";
			}
			var selected = "";
			if (currentId == langValue) selected = "selected";

			langString += "<option value=\"" + langValue + "\" " + selected + ">" + langName + "</option>";

		}

		return langString;
	}
}
globals.settings = new Settings();


globals.module.registerOnLoaded(function(){
	globals.menu.add("Settings", function(){}, "../modules/settings/settings.html", true);
	globals.menu.updateAll();
});