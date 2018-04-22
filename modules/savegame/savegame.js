/* global globals, $ */
'use strict';

function Savegame() {
	const savesArray = [];

	let langEntries = globals.module.getLangData();

	function initialize() {
		globals.gameData.registerObserver(function(game, property, value) {
			if (value) {
				_lookForSave(game.shortId);
			}
		}.bind(this), 'version');
	}

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.display = function() {
		$('#foundSaves').html(langEntries.content['savegame.foundSaves']);

		$('h1').html(langEntries.content['savegame.savegames']);

		// init table
		$('#foundSavesContainer').html('<table>' + _getTable() + '</table>');
	};

	function _lookForSave(version) {
		let file = path.join(globalData.versionList[version], '..', 'cc.save');
		if(fs.existsSync(file)) {
			fs.readFile(file, 'utf8', function(err, data) {
				if(err)
					throw err;
					
				savesArray[version] = JSON.parse(data);
				globals.module.sharedMemory['savegame'].controller.display();
			});
		}
	}

	function _getTable(){
		let tableString = '<tr><th>' +
			langEntries.content['savegame.savegame'] +
			'</th><th></th></tr>';

		if (savesArray.length === 0) {
			return langEntries.content['status.noGames'];
		}

		for (let i in savesArray) {
			tableString += '<tr><td>' + savesArray[i].version + '</td><td><!-- Display edit button here --></td></tr>';
		}

		return tableString;
	}


	initialize();
}

globals.module.sharedMemory['savegame'] = {
	controller: new Savegame(),
};

globals.module.on('modulesLoaded', function() {
	let id = globals.menu.add(
		'Savegame',
		function() {},
		'../modules/savegame/savegame.html',
		true,
		0
	);
	globals.menu.updateAll();
	globals.menu.select(id);
});
