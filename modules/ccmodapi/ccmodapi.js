/* global globals, https, fs, unzip, path, $, Version, process */
/* exported installMod */
'use strict';

function CCModDB() {
	this.moddata = {};
	this.versiondata = {
		selectedVersion: undefined,
		version: new Version(),
	};
	let instance = this;

	let callbacks = {
		dataInit: [],
		dataUpdated: [],
	};

	let langEntries = globals.module.getLangData();

	globals.module.on('langChanged', function(id, subId, data) {
		langEntries = data;
	});

	this.updateData = function(cb){
		const modReq = {
			hostname: 'raw.githubusercontent.com',
			port: 443,
			path: '/CCDirectLink/CCModDB/master/mods.json',
			method: 'GET',
			headers: {
				'User-Agent': 'SpericalViewer-modAPI',
			},
		};

		https
			.get(modReq, res => {
				let data = '';

				res.on('data', function(part) {
					data += part;
				});

				res.on('end', function() {
					instance.moddata = JSON.parse(data);
					if (typeof cb === 'function') {
						cb.apply(this, arguments);
					} else {
						for (let id in callbacks.dataUpdated) {
							callbacks.dataUpdated[id].apply(this, arguments);
						}
					}
				});
			})
			.on('error', e => {
				console.error(e);
			});
	};

	this.display = function() {
		$('h1').html(langEntries.content['ccmodapi.mods']);

		$('#provideinfo').html(langEntries.content['ccmodapi.provided']);

		$('#versionList').html(
			this.versiondata.version.getList()
		);
		this.updateTable();
	};

	this.updateTable = function() {
		$('#modData').html('<table>' + _getTable() + '</table>');
	};

	this.updateVersion = function(newVersion) {
		this.versiondata.selectedVersion = newVersion.value;
	};

	this.on = function(type, cb) {
		if (type === 'dataInit') {
			callbacks.dataInit.push(cb);
		} else if (type === 'dataUpdated') {
			callbacks.dataUpdated.push(cb);
		}
	};
	this.installMod = function(link, name, dirType) {
		console.debug('Link', link);
		console.debug('Filename', name);
		console.debug('Version hash', instance.versiondata.selectedVersion);
		link = _archiveToDirectLink(link);
		console.debug('Reconstructed link', link);
		// will pick the first version I see

		console.log('Downloading...');
		console.debug('Dir', dirType);
		let installCode = function(aPath) {
			console.log('Installing...');
			let outputPath = _dirToExactPath(dirType || 'mod');
			console.debug('OutputPath:', outputPath);
			_install(aPath, outputPath, function() {
				console.log('Done!');
			});
		};
		_download(link, name + '.zip', installCode);
	};

	function _archiveToDirectLink(url) {
		let baseUrl = 'https://codeload.github.com/';
		let strippedUrl = url.replace('https://github.com/', '');

		baseUrl += strippedUrl.substring(
			0,
			strippedUrl.indexOf('/archive/') + 1
		);

		let fileName = strippedUrl.substring(
			strippedUrl.indexOf('/archive/') + '/archive/'.length
		);

		let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

		fileName = fileName.substring(0, fileName.lastIndexOf('.'));

		baseUrl += fileType + '/' + fileName;
		return baseUrl;
	}

	function _normalizePath(absPath) {
		if (!absPath)
			throw new Error('absolute path not specified');
		if (path.sep === '\\') {
			return absPath.replace(/[\\]/g, path.sep.repeat(2));
		}
		return absPath;
	}

	function _dirToExactPath(keyword, version, sep) {
		if (!sep) sep = path.sep;
		if (!version) version = instance.versiondata.selectedVersion ||
			globals.gameData.getVersions()[0];
		if (!keyword) throw new Error('keyword not specified');
		let newPath;
		if (keyword === 'root') // we want the folder where nw.exe is located
			newPath = path.join(
				globals.gameData.versions[version].path.main,
				'..' + sep
			);
		else if (keyword === 'mod')
			newPath = path.join(
				globals.gameData.versions[version].path.main,
				'mods' + sep
			);
		return _normalizePath(newPath);
	}

	/*
     * NOTE: Needs DIRECT link
     */
	function _download(downloadLink, name, cb) {
		https.get(downloadLink, function(res) {
			let fileStream = fs.createWriteStream(name);
			res.on('data', function(nextBlob) {
				fileStream.write(nextBlob);
			});
			res.on('end', function() {
				fileStream.end();
				cb(name);
			});
			res.on('error', function(err) {
				console.log('Error');
				fileStream.end();
				cb && cb(null, err);
			});
		});
	}

	function _install(filePath, outputPath, cb) {
		// possibly an install path included?
		// This does not support mods like Rich Presence
		fs
			.createReadStream(filePath)
			.pipe(unzip.Parse())
			.on('entry', function(entry) {
				if (!entry || !entry.path ||
					entry.path.indexOf('/') === entry.path.lastIndexOf('/')
				) {
					console.debug('Skipping...', entry);
					return;
				}

				let name = entry.path;
				name = name.substr(name.indexOf('/') + 1);
				let type = entry.type;
				if (type === 'Directory') {
					try {
						fs.mkdirSync(outputPath + name);
					} catch (e) {
						console.log(
							'Error with ' +
							'making directory ' + `"${name}" -> ${e}`
						);
					}
					entry.autodrain();
				} else if (type === 'File') {
					entry.pipe(fs.createWriteStream(outputPath + name));
				} else {
					entry.autodrain();
				}
			})
			.on('close', function() {
				cb && cb();
			});
	}

	function _getTable() {
		let tableString =
			'<tr><th>' +
			langEntries.content['ccmodapi.name'] +
			'</th><th>' +
			langEntries.content['ccmodapi.desc'] +
			'</th><th>' +
			langEntries.content['ccmodapi.license'] +
			'</th><th>' +
			langEntries.content['ccmodapi.install'] +
			'</th></tr>';

		if (!instance.moddata) {
			return langEntries.content['ccmodapi.connection'];
		}

		for (let i in instance.moddata.mods) {
			if (
				!instance.moddata.mods[i].name ||
				!instance.moddata.mods[i].archive_link ||
				!instance.moddata.mods[i].version
			) {
				continue;
			}
			let link = instance.moddata.mods[i].archive_link;
			let dir = instance.moddata.mods[i].dir || {};
			if (dir[process.platform]) {
				dir = dir[process.platform];
			} else if (dir['any']) {
				dir = dir['any'];
			} else {
				dir = '';
			}
			tableString += '<tr><td>' +
				instance.moddata.mods[i].name + ' (' + i + ')</td>';
			tableString += '<td>' +
				(instance.moddata.mods[i].description || '') + '</td>';
			tableString += '<td>' +
				(instance.moddata.mods[i].license || '') + '</td>';
			tableString += "<td><button onclick='installMod(" +
				`"${link.trim()}","${i.trim()}", "${dir.trim()}")'>` +
				'Install</button></td></tr>';
		}

		return tableString;
	}

	instance.updateData(function() {
		for (let id in callbacks.dataInit) {
			callbacks.dataInit[id].apply(this, arguments);
		}
	});
}

function installMod(link, name, dir) {
	globals.module.sharedMemory['ccmoddb']
		.controller.installMod(link, name);
}

globals.module.sharedMemory['ccmoddb'] = {
	controller: new CCModDB(),
};

globals.gameData.registerObserver(function() {
	this.versiondata.selectedVersion = globals
		.gameData.getVersions()[0];
}.bind(globals.module.sharedMemory
	.ccmoddb.controller), 'version');

globals.module.on('modulesLoaded', function(){
	globals.menu.add('CCMods', function(){},
		'../modules/ccmodapi/ccmodapi.html',
		function(){
			return globals.gameData.containGames();
		}
	);
	globals.menu.updateAll();
});
