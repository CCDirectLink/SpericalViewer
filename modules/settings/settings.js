/* eslint-env node */
/* global globals, path, $ */

function Settings() {
	var settings = {
		selectedLang: 'en_us',
	};

	var langEntries = globals.module.getLangData();

	this.langTrigger = function() {
		settings.selectedLang = $('#lang')[0].options[
			$('#lang')[0].selectedIndex
		].value;

		var split = settings.selectedLang.split('_');
		globals.module.setLang(split[0], split[1]);
		langEntries = globals.module.getLangData();
		globals.menu.updateAll();
		this.display();
	};

	this.display = function() {
		// container dir

		$('#storageDirName').html(langEntries.content['settings.storage']);

		$('#storageDir').html(globals.env.path.storage);

		$('#savegameDirName').html(langEntries.content['settings.savegame']);

		$('#savegameDir').html(
			globals.env.path.save.folder + path.sep + globals.env.path.save.file
		);

		$('#cacheDirName').html(langEntries.content['settings.cache']);

		$('#cacheDir').html(globals.env.path.cache);

		$('#moduleUserDirName').html('Module - User');
		$('#moduleUserDir').html(globals.env.path.module.user);

		$('#moduleAppDirName').html('Module - App');
		$('#moduleAppDir').html(globals.env.path.module.app);

		$('h1').html(langEntries.content['settings.settings']);
		$('#themeTitle').html(langEntries.content['settings.theme']);
		$('#langTitle').html(langEntries.content['settings.lang']);

		$('#lang').html(_getTable(settings.selectedLang));
	};

	function _getTable(currentId) {
		var langString = '';
		var langArray = globals.module.getLangList();

		for (var i in langArray) {
			var langValue = langArray[i].langId + '_' + langArray[i].langIdSub;

			var langName = langArray[i].langName;

			if (langArray[i].langNameSub != null) {
				langName += ' (' + langArray[i].langNameSub + ')';
			}

			var selected = '';
			if (currentId === langValue) selected = 'selected';

			langString +=
        '<option value="' +
        langValue +
        '" ' +
        selected +
        '>' +
        langName +
        '</option>';
		}

		return langString;
	}
}

globals.module.sharedMemory['settings'] = {
	controller: new Settings(),
};

globals.module.on('modulesLoaded', function() {
	globals.menu.add(
		'Settings',
		function() {},
		'../modules/settings/settings.html',
		true,
		-1
	);
	globals.menu.updateAll();
});
