function Settings(){
	var settings = {
			selectedLang: "en_us"
		};
	
	this.langTrigger = function() {
		settings.selectedLang = $( "#lang" )[0].options[$("#lang")[0].selectedIndex].value;
		var split = settings.selectedLang.split("_");
		globals.langData.setLang(split[0], split[1]);
		globals.menu.updateAll();
		this.display();
	}
	
	this.display = function(){
		// container dir
		
		$("#storageDirName").html(globals.langData.getEntry("storage"));
		$("#storageDir").html(globals.env.path.storage);
		
		$("#savegameDirName").html(globals.langData.getEntry("savegame"));
		$("#savegameDir").html(globals.env.path.save.folder + path.sep + globals.env.path.save.file);
		
		$("#cacheDirName").html(globals.langData.getEntry("cache"));
		$("#cacheDir").html(globals.env.path.cache);
		
		$("#moduleUserDirName").html("Module - User");
		$("#moduleUserDir").html(globals.env.path.module.user);
		
		$("#moduleAppDirName").html("Module - App");
		$("#moduleAppDir").html(globals.env.path.module.app);

		$("h1").html(globals.langData.getEntry("settings"));
		$("#themeTitle").html(globals.langData.getEntry("theme"));
		$("#langTitle").html(globals.langData.getEntry("lang"));

		$("#lang").html(_getTable(settings.selectedLang));
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
	globals.menu.add("Settings", function(){}, "../modules/settings/settings.html", true, -1);
	globals.menu.updateAll();
});