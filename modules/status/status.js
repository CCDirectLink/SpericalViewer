/* eslint-env node */
/* global globals, $ */

function Status() {
	var statusArray = [];

	var langEntries = globals.module.getLangData();

	function initialize() {
		globals.gameData.registerObserver(function(game, property, value) {
			if (value) {
				var sizeData = '0 kiB';
				statusArray.push({
					id: game.shortId,
					containerId: game.containerId,
					version: game.version.string,
					size: sizeData,
				});
			}

			$('#loadedGame').html('<table>' + _getTable() + '</table>');

			$('#storedGame').html('<table>' + _getPathsTable() + '</table>');

			globals.menu.updateAll();
		}, 'version');
	}

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.display = function() {
		$('#license').html(langEntries.content['status.license']);

		$('#loadGame').html(langEntries.content['status.loadGame']);

		$('#loadedGameTitle').html(langEntries.content['status.loadedGames']);

		$('#storedGameTitle').html(langEntries.content['status.storedGameData']);

		// init programm data
		$('h1').html(globals.env.name);
		$('#version').html(globals.env.version.string);

		$('#rev').html(globals.env.build.rev);
		$('#year').html(globals.env.build.date.year);

		// init table
		$('#loadedGame').html('<table>' + _getTable() + '</table>');

		$('#storedGame').html('<table>' + _getPathsTable() + '</table>');
	};

	this.removeData = function(id) {
		for (var i in statusArray) {
			if (statusArray[i].id === id) {
				statusArray.splice(i, 1);
			}
		}
		globals.gameData.removeData(id);
	};

	this.removeVersion = function(version) {
		globals.env.removeVersionPath(version);
		$('#storedGame').html('<table>' + _getPathsTable() + '</table>');
	};

	this.onchange = function() {
		globals.loader.load($('#file')[0].files);
		$('#file')[0].value = '';
	};

	function _getTable() {
		var tableString =
      '<tr><th>' +
      langEntries.content['status.id'] +
      '</th><th>' +
      langEntries.content['status.containerId'] +
      '</th><th>' +
      langEntries.content['status.version'] +
      '</th><th>' +
      langEntries.content['status.cacheSize'] +
      '</th><th></th></tr>';

		if (statusArray.length === 0) {
			return langEntries.content['status.noGames'];
		}

		for (var i in statusArray) {
			tableString += '<tr><td>' + statusArray[i].id + '</td><td>';

			if (statusArray[i].containerId) {
				tableString += statusArray[i].containerId;
			} else {
				tableString += '(local)';
			}

			tableString +=
        '</td><td>' +
        statusArray[i].version +
        '</td><td>' +
        statusArray[i].size +
        '</td><td><a class="close" id="' +
        statusArray[i].id +
        "\" onclick='globals.module." +
        'sharedMemory["status"].' +
        'controller.removeData("' +
        statusArray[i].id +
        "\");'>" +
        langEntries.content['status.close'] +
        '</a></td></tr>';
		}

		return tableString;
	}

	function _getPathsTable() {
		var tableString =
      '<tr><th>' +
      langEntries.content['status.containerId'] +
      '</th><th>' +
      langEntries.content['status.path'] +
      '</th><th></th></tr>';

		var versions = globals.env.versionList;
		if (Object.keys(versions).length === 0) {
			return langEntries.content['status.noGames'];
		}

		for (var version in versions) {
			tableString +=
        '<tr><td>' +
        version +
        '</td><td>' +
        versions[version] +
        '</td><td><a class="close" id="' +
        version +
        "\" onclick='globals.module." +
        'sharedMemory["status"].' +
        'controller.removeVersion("' +
        version +
        "\");'>" +
        langEntries.content['status.clear'] +
        '</a></td></tr>';
		}

		return tableString;
	}

	initialize();
}

globals.module.sharedMemory['status'] = {
	controller: new Status(),
};

globals.module.on('modulesLoaded', function() {
	var id = globals.menu.add(
		'Status',
		function() {},
		'../modules/status/status.html',
		true,
		0
	);
	globals.menu.updateAll();
	globals.menu.select(id);
});
