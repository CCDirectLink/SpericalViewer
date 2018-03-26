/* global globals, $, Version */
'use strict';

function Items() {
	var instance = this;

	var itemData = {
		selectedVersion: globals.gameData.getVersions()[0],
		version: new Version(),
		observer: globals.imageData.registerObserver(
			function(name, tileName, image) {
				instance.updateIcon(name, tileName, image);
			},
			'items'),
		versionChangeObserver: globals.gameData.registerObserver(function() {
			instance.updateVersion();
		}, 'version'),
	};

	var langEntries = globals.module.getLangData();

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.versionTrigger = function() {
		itemData.selectedVersion = $('#versionList')[0].options[
			$('#versionList')[0].selectedIndex
		].value;
		instance.updateTable();
	};

	this.display = function() {
		$('h1').html(langEntries.content['items.items']);

		$('#versionSelect').html(langEntries.content['status.version']);

		$('#searchLabel').html(langEntries.content['items.search']);

		if (!globals.gameData.hasGame(itemData.selectedVersion)) {
			itemData.selectedVersion = globals.gameData.getVersions()[0];
		}

		this.updateTable();
		this.updateVersion();
	};

	this.updateTable = function() {
		// init table
		$('#itemData').html(
			'<table>' +
			_getTable(
				itemData.selectedVersion,
				document.getElementById('searchValue').value
			) +
			'</table>'
		);
	};

	this.updateVersion = function() {
		if (!globals.gameData.hasGame(itemData.selectedVersion)) {
			itemData.selectedVersion = globals.gameData.getVersions()[0];
		}
		// init versions
		$('#versionList').html(
			itemData.version.getList(itemData.selectedVersion)
		);
	};

	this.updateIcon = function(name, tileName, image) {
		var imgs = document.getElementsByClassName(
			itemData.selectedVersion + ' ' + name + ' ' + tileName
		);
		for (var i = 0; i < imgs.length; ++i) {
			imgs[i].src = image;
		}
	};

	function _getTable(version, filter) {
		var tableString =
			'<tr><th>' +
			langEntries.content['items.id'] +
			'</th><th>' +
			langEntries.content['items.item'] +
			'</th><th>' +
			langEntries.content['items.stats'] +
			'</th></tr>';

		if (!version) {
			version = globals.gameData.getVersions()[0];
		}

		if (!globals.gameData.hasGame(version)) return tableString;

		var items = globals.gameData.versions[version].items;

		for (var i in items) {
			var item = items[i];

			if (item.name.en_US.toLowerCase()
				.indexOf(filter.toLowerCase()) !== -1) {

				tableString += '<tr><td>' + i + '</td><td>';
				tableString += "<img class='item-entry-icon " +
				(version + ' items ' + item.icon + item.rarity) +
				"' src='" +
				globals.imageData.getImage(
					version,
					'items',
					item.icon + item.rarity
				) + "'/> ";

				tableString +=
					'<span class=' + '"item-entry-text">' +
					item.name.en_US + '</td><td>';

				if (item.params !== undefined) {
					var first = true;
					var params = item.params;

					if (params.hp !== undefined) {
						tableString += '<img class="' +
							'item-entry-icon ' +
							(version + ' items hp') +
							'" src="' +
							globals.imageData.getImage(version, 'items', 'hp') +
							'"/> <span class=' +
							'"item-entry-text">' +
							params.hp + '</span>';
						first = false;
					}
					if (params.attack !== undefined) {
						if (!first) tableString += '<br />';
						first = false;
						tableString += '<img class=' +
							"'item-entry-icon " +
							(version + ' items attack') +
							"' src='" +
							globals.imageData.getImage(
								version, 'items', 'attack'
							) + "'/> <span class=" +
							"'item-entry-text'>" + params.attack +
							'</span>';
					}
					if (params.defense !== undefined) {
						if (!first) tableString += '<br />';
						first = false;
						tableString += '<img class=' +
							"'item-entry-icon " +
							(version + ' items defense') +
							"' src='" + globals.imageData.getImage(
							version, 'items', 'defense'
						) + "'/> <span class=" +
							"'item-entry-text'>" + params.defense +
							'</span>';
					}
					if (params.focus !== undefined) {
						if (!first) tableString += '<br />';
						first = false;
						tableString += '<img class=' +
							"'item-entry-icon " +
							(version + ' items focus') +
							"' src='" + globals.imageData.getImage(
							version, 'items', 'focus'
						) + "'/> <span class=" +
							"'item-entry-text'>" +
							params.focus +
							'</span>';
					}
				}
				tableString += '</td></tr>';
			}
		}

		return tableString;
	}
}

globals.module.sharedMemory['items'] = {
	controller: new Items(),
};

globals.module.on('modulesLoaded', function() {
	globals.menu.add(
		'Items',
		function() {},
		'../modules/items/items.html',
		function() {
			return globals.gameData.containGames();
		}
	);
	globals.menu.updateAll();
});
