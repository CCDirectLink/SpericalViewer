/* eslint-env browser */
/* global globals, https, fs, unzip, $ */
'use strict';

function CCLoader() {
	const DOWNLOAD_LINK =
    'https://codeload.github.com' + '/CCDirectLink/CCLoader/zip/master';

	// var location = {};

	var langEntries = globals.module.getLangData();

	this.initialize = function() {
		globals.gameData.registerObserver(function() {
			globals.module
				.sharedMemory['ccloader']['controller']
				.display();
		}, 'path');
	};

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.display = function() {
		if (globals.gameData.getVersions().length === 0) {
			$('h2').html(langEntries.content['status.noGames']);
			return;
		}

		$('#ccloaderData').html(_getTable());
	};

	this.install = function(id) {
		$('#install' + id).html('');
		$('h2').html(langEntries.content['ccloader.downloading']);

		// Might have to be changed to be platform-independant
		var filename = 'ccloader.zip';
		var file = fs.createWriteStream(filename);
		file.on('error', err => {
			throw err;
		});
		https.get(DOWNLOAD_LINK, function(response) {
			response.on('end', function(data) {
				file.on('finish', () => {
					$('h2').html(langEntries.content['ccloader.installing']);
					_extract(
						filename,
						globals.gameData.versions[id].path.main + '..',
						function() {
							$('h2').html('');
							globals.module
								.sharedMemory['cc' + 'loader']['controller']
								.display();
						}
					);
				});
				file.end();
			});
			response.on('data', function(data) {
				file.write(data, function(err) {
					if (err) {
						throw err;
					}
				});
			});
			response.on('error', function(err) {
				throw err;
			});
		});
	};

	this.start = function(id) {
		globals.gameData.start(id);
	};

	function _extract(file, unzipPath, cb) {
		fs
			.createReadStream(file)
			.pipe(unzip.Parse())
			.on('entry', function(entry) {
				if (entry.type === 'Directory') {
					try {
						fs.mkdirSync(unzipPath + entry.path.substr(15));
					} catch (e) {}
					entry.autodrain();
				} else if (entry.type === 'File') {
					entry.pipe(
						fs.createWriteStream(unzipPath + entry.path.substr(15))
					);
				} else {
					entry.autodrain();
				}
			})
			.on('close', function() {
				if (cb) {
					cb(unzipPath);
				}
			});
	}

	function _getTable() {
		var tableString =
			'<table><tr><th>' +
			langEntries.content['ccloader.id'] +
			'</th><th>' +
			langEntries.content['ccloader.version'] +
			'</th><th>' +
			langEntries.content['ccloader.installed'] +
			'</th><th>' +
			langEntries.content['ccloader.start'] +
			'</th></tr>';

		for (var id in globals.gameData.versions) {
			var game = globals.gameData.versions[id];
			tableString +=
				'<tr><td>' + id +
				'</td><td>' + game.version.string +
				'</td><td id="install' + id +
				'">';

			if (_isInstalled(game)) {
				tableString += langEntries.content['ccloader.installed'];
			} else {
				tableString +=
					'<button onclick=' +
					"\"globals.module.sharedMemory['ccloader']" +
					"['controller'].install('" + id +
					"')\">" + langEntries.content['ccloader.install'] +
					'</button>';
			}

			tableString +=
				'</td><td><button onclick=' +
				"\"globals.module.sharedMemory['ccloader']" +
				"['controller'].start('" +
				id +
				"')\">" +
				langEntries.content['ccloader.start'] +
				'</button></td></tr>';
		}

		tableString += '</table>';

		return tableString;
	}

	function _isInstalled(game) {
		return fs.existsSync(game.path.main + '../ccloader/');
	}

	this.initialize();
}

globals.module.sharedMemory['ccloader'] = {
	controller: new CCLoader(),
};

globals.module.on('modulesLoaded', function() {
	globals.menu.add(
		'CCLoader',
		function() {},
		'../modules/ccloader/ccloader.html',
		function() {
			return globals.gameData.containGames();
		}
	);
	globals.menu.updateAll();
});
