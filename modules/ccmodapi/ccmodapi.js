/* eslint-env browser */
/* global globals, https, fs, unzip, $ */

function CCModDB() {
	this.moddata = {};
	this.versiondata =  {
		selectedVersion : undefined,
		version : new Version()
	};
	var instance = this;

	var callbacks = {
		dataInit: [],
		dataUpdated: [],
	};

	var langEntries = globals.module.getLangData();

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
				var data = '';

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
		var installCode = function(aPath) {
			console.log('Installing...');
			var outputPath = _dirToExactPath(dirType || 'mod');
			console.debug('OutputPath:',outputPath);
			_install(aPath, outputPath, function() {
				console.log('Done!');
			});
		};
	_	_download(link, name + '.zip', installCode);
	};

	function _archiveToDirectLink(url) {
		var baseUrl = 'https://codeload.github.com/';
		var strippedUrl = url.replace('https://github.com/', '');

		baseUrl += strippedUrl.substring(0, strippedUrl.indexOf('/archive/') + 1);

		var fileName = strippedUrl.substring(
			strippedUrl.indexOf('/archive/') + '/archive/'.length
		);

		var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

		fileName = fileName.substring(0, fileName.lastIndexOf('.'));

		baseUrl += fileType + '/' + fileName;
		return baseUrl;
	}

	function _normalizePath(absPath) {
		if(!absPath)
			throw 'absolute path not specified';
		if(path.sep === '\\') {
			return absPath.replace(/[\\]/g, path.sep.repeat(2));
		}
		return absPath;
	}

	function _dirToExactPath(keyword, version, sep) {
		if(!sep) sep = path.sep;
		if(!version) version = instance.versiondata.selectedVersion || globals.gameData.getVersions()[0];
		if(!keyword) throw 'keyword not specified';
		var newPath;
		if(keyword === 'root') //we want the folder where nw.exe is located
			newPath = path.join(globals.gameData.versions[version].path.main,'..' + sep);
		else if(keyword === 'mod')
			newPath = path.join(globals.gameData.versions[version].path.main, "mods" + sep);
		return _normalizePath(newPath);
	}

	/*
     * NOTE: Needs DIRECT link
     */
	function _download(downloadLink, name, cb) {
		https.get(downloadLink, function(res) {
			var fileStream = fs.createWriteStream(name);
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
				if (
					!entry ||
          !entry.path ||
          entry.path.indexOf('/') === entry.path.lastIndexOf('/')
				) {
					console.debug('Skipping...', entry);
					return;
				}

				var name = entry.path;
				name = name.substr(name.indexOf('/') + 1);
				var type = entry.type;
				if (type === 'Directory') {
					try {
						fs.mkdirSync(outputPath + name);
					} catch (e) {
						console.log(
							'Error with ' + 'making directory ' + `"${name}" -> ${e}`
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
		var tableString =
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

		for (var i in instance.moddata.mods) {
			if (
				!instance.moddata.mods[i].name ||
        !instance.moddata.mods[i].archive_link ||
        !instance.moddata.mods[i].version
			) {
				continue;
			}
			var link = instance.moddata.mods[i].archive_link;
			var dir = instance.moddata.mods[i].dir || "";
			tableString +=
        '<tr><td>' + instance.moddata.mods[i].name + ' (' + i + ')</td>';
			tableString +=
        '<td>' + (instance.moddata.mods[i].description || '') + '</td>';
			tableString +=
        '<td>' + (instance.moddata.mods[i].license || '') + '</td>';
			tableString +=
        "<td><button onclick='installMod(" +
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

/* eslint-disable */
// ESLint: 1 Error
// TODO: installMod export

function installMod(link, name, dir) {
  globals.module.sharedMemory["ccmoddb"].controller.installMod(link, name);
}

globals.module.sharedMemory["ccmoddb"] = {
  controller: new CCModDB()
};

globals.module.on('modulesLoaded', function(){
	globals.menu.add('CCMods', function(){},
		'../modules/ccmodapi/ccmodapi.html',
		function(){
			return globals.gameData.containGames();
		}
	);
	globals.menu.updateAll();
});
