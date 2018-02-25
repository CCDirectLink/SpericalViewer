'use strict';

/* eslint-env node */
/* global globals, $ */

function Savegame(){
	// var statusArray = [];

	var langEntries = globals.module.getLangData();

	function initialize(){
		globals.gameData.registerObserver(
			function(game, property, value) {
			},
			'version'
		);
	}

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.display = function(){
		$('#foundSaves').html(
			langEntries.content['savegame.foundSaves']
		);

		$('h1').html(
			langEntries.content['savegame.savegames']
		);

		// init table
		$('#foundSavesContainer').html('<table>' + '' + '</table>');
	};

	initialize();
}

globals.module.sharedMemory['savegame'] = {
	controller: new Savegame(),
};

globals.module.on('modulesLoaded', function(){
	var id = globals.menu.add(
		'Savegame',
		function(){},
		'../modules/savegame/savegame.html',
		true, 0
	);
	globals.menu.updateAll();
	globals.menu.select(id);
});
