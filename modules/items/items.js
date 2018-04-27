/* global globals, $, Version */
'use strict';

function Items() {

	let itemData = {
		selectedVersion: globals.gameData.getVersions()[0],
		version: new Version(),
		observer: globals.imageData.registerObserver(
			function(name, tileName, image) {
				this.updateIcon(name, tileName, image);
			}.bind(this),
			'items'),
		versionChangeObserver: globals.gameData.registerObserver(function() {
			this.updateVersion();
		}.bind(this), 'version'),
	};

	let langEntries = globals.module.getLangData();

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.versionTrigger = function() {
		itemData.selectedVersion = $('#versionList')[0].options[
			$('#versionList')[0].selectedIndex
		].value;
		this.updateTable();
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
				{
					name: document.getElementById('searchValue').value,
					type: document.getElementById('typeFilter').value,
					rarity: document.getElementById('rarityFilter').value,
				}
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
		let imgs = document.getElementsByClassName(
			itemData.selectedVersion + ' ' + name + ' ' + tileName
		);
		for (let i = 0; i < imgs.length; ++i) {
			imgs[i].src = image;
		}
	};

	function _getTable(version, filter) {
		let tableString =
			'<tr><th>' +
			langEntries.content['items.id'] +
			'</th><th>' +
			langEntries.content['items.type'] +
			'</th><th>' +
			langEntries.content['items.item'] +
			'</th><th>' +
			langEntries.content['items.stats'] +
			'</th></tr>';

		if (!version) {
			version = globals.gameData.getVersions()[0];
		}

		if (!globals.gameData.hasGame(version)) return tableString;

		let items = globals.gameData.versions[version].items;

		for (let i in items) {
			let item = items[i];

			if ((item.name.en_US.toLowerCase()
				.indexOf(filter.name.toLowerCase()) !== -1) &&
			(item.icon.toLowerCase()
				.indexOf(filter.type.toLowerCase()) !== -1) &&
				((item.rarity === Number(filter.rarity) ||
					(filter.rarity === '')))
			) {


				tableString += '<tr><td>' + i + '</td><td colspan=\'2\'>';
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
					let first = true;
					let params = item.params;

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
