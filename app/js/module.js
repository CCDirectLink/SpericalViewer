/* global fs, path, unzip, $ */
'use strict';

function Module(initLang, langFile) {
	const MODULE_EXTENSION = '.ccsvm';
	// var baseDirectory;
	let instance = this;

	let callbacks = {
		scriptsLoaded: [],
		scriptLoaded: [],

		modulesLoaded: [],
		moduleLoaded: [],

		langInitDone: [],
		langChanged: [],
	};

	let langStore = {};
	let langList = [];

	this.sharedMemory = {};
	this.selectedLang = {
		langId: 'en',
		langIdSub: 'us',
	};

	// Constructor
	function initialize(initLang, langFile) {
		if (initLang && initLang.langId && initLang.langIdSub) {
			instance.selectedLang.langId = initLang.langId;
			instance.selectedLang.langIdSub = initLang.langIdSub;
		}

		$.getJSON(langFile)
			.done(function(json) {
				langStore = json;

				for (let id in langStore) {
					for (let subid in langStore[id]) {
						langStore[id][subid].content = {};
						langList.push({
							langName: langStore[id][subid].langName,

							langNameSub: langStore[id][subid].langNameSub,

							langId: id,
							langIdSub: subid,
						});
					}
				}

				for (let id in callbacks.langInitDone) {
					callbacks.langInitDone[id]();
				}
			})
			.fail(function() {
				console.error('langlist not loaded');
			});
	}

	this.on = function(type, cb) {
		if (type === 'scriptsLoaded') {
			callbacks.scriptsLoaded.push(cb);
		} else if (type === 'scriptLoaded') {
			callbacks.scriptLoaded.push(cb);
		} else if (type === 'modulesLoaded') {
			callbacks.modulesLoaded.push(cb);
		} else if (type === 'moduleLoaded') {
			callbacks.moduleLoaded.push(cb);
		} else if (type === 'langInitDone') {
			callbacks.langInitDone.push(cb);
		} else if (type === 'langChanged') {
			callbacks.langChanged.push(cb);
		}
	};

	this.trigger = function(type) {
		if (type === 'scriptsLoaded') {
			for (let id in callbacks.langInitDone) {
				callbacks.scriptsLoaded[id]();
			}
		} else if (type === 'scriptLoaded') {
			for (let id in callbacks.scriptLoaded) {
				callbacks.scriptLoaded[id]();
			}
		} else if (type === 'modulesLoaded') {
			for (let id in callbacks.modulesLoaded) {
				callbacks.modulesLoaded[id]();
			}
		} else if (type === 'moduleLoaded') {
			for (let id in callbacks.moduleLoaded) {
				callbacks.moduleLoaded[id]();
			}
		} else if (type === 'langInitDone') {
			for (let id in callbacks.langInitDone) {
				callbacks.langInitDone[id]();
			}
		} else if (type === 'langChanged') {
			for (let id in callbacks.langChanged) {
				callbacks.langChanged[id]();
			}
		}
	};

	this.getLangData = function() {
		const langData = langStore[instance.selectedLang.langId];

		if (!langData || !langData[instance.selectedLang.langIdSub]) {
			return {};
		}

		return langData[instance.selectedLang.langIdSub];
	};

	this.getLangList = function() {
		return langList;
	};

	this.setLang = function(langIdOrObject, langIdSub) {
		if (!langIdOrObject) {
			return;
		}

		if (
			langIdOrObject &&
			langIdSub &&
			typeof langIdOrObject === 'string' &&
			typeof langIdSub === 'string'
		) {
			instance.selectedLang.langId = langIdOrObject;
			instance.selectedLang.langIdSub = langIdSub;
		} else if (
			langIdOrObject &&
			langIdOrObject.langId &&
			langIdOrObject.langIdSub
		) {
			instance.selectedLang.langId = langIdOrObject.langId;
			instance.selectedLang.langIdSub = langIdOrObject.langIdSub;
		}

		let langData = langStore[instance.selectedLang.langId];

		for (let id in callbacks.langChanged) {
			callbacks.langChanged[id].apply(this, [
				...arguments, langData[instance.selectedLang.langIdSub],
			]);
		}
	};

	// Loads scripts. Takes an Array of scripts
	this.loadScripts = function(scripts, cb) {
		let cnt = scripts.length;
		let loaded = 0;
		for (let i in scripts) {
			this.loadScript(scripts[i], function() {
				loaded++;
				if (loaded >= cnt) {
					if (typeof cb === 'function') {
						cb.apply(this, arguments);
					} else {
						for (let id in callbacks.scriptsLoaded) {
							callbacks.scriptsLoaded[id].apply(this, arguments);
						}
					}
				}
			});
		}
	};

	// Loads a script
	this.loadScript = function(script, cb) {
		$.getScript(script).done(function() {
			if (typeof cb === 'function') {
				cb.apply(this, arguments);
			} else {
				for (let id in callbacks.scriptLoaded) {
					callbacks.scriptLoaded[id].apply(this, arguments);
				}
			}
		});
	};

	this.loadModules = function(modules, cb) {
		let cnt = modules.length;
		let loaded = 0;
		for (let i in modules) {
			this.loadModule(modules[i], function() {
				++loaded;
				if (loaded >= cnt) {
					if (typeof cb === 'function') {
						cb.apply(this, arguments);
					} else {
						for (let id in callbacks.modulesLoaded) {
							callbacks.modulesLoaded[id].apply(this, arguments);
						}
					}
				}
			});
		}
	};

	this.loadModule = function(file, cb) {
		if (_isZipped(file)) {
			_unzip(file);
			file = _removeExtension(file) + '/package.json';
		}

		_getData(file, function(data) {
			// has langfolder
			if (data.langfolder) {
				// loaded files
				let langLoadedCount = 0;

				// lang file list
				const langList = instance.findLangFiles(
					path.join(path.dirname(file), data.langfolder)
				);

				for (let i in langList) {
					$.getJSON(langList[i])
						.done(function(json) {
							if (
								langStore[json.langId] &&
								langStore[json.langId][json.langIdSub] &&
								langStore[json.langId][json.langIdSub].content
							) {
								langStore[json.langId][json.langIdSub]
									.content = Object.assign(
										langStore[json.langId][json.langIdSub]
											.content,
										json.content
									);
							}

							++langLoadedCount;
							if (langLoadedCount >= langList.length) {
								instance.loadScript(
									path.join(path.dirname(file), data.main),
									function() {
										if (typeof cb === 'function') {
											cb.apply(this, arguments);
										} else {
											for (let id in callbacks
												.moduleLoaded) {

												callbacks.moduleLoaded[id]
													.apply(this, arguments);
											}
										}
									}
								);
							}
						})
						.fail(function() {
							++langLoadedCount;
							if (langLoadedCount >= langList.length) {
								instance.loadScript(
									path.join(path.dirname(file), data.main),
									function() {
										if (typeof cb === 'function') {
											cb.apply(this, arguments);
										} else {
											for (let id in callbacks
												.moduleLoaded) {

												callbacks.moduleLoaded[id]
													.apply(this, arguments);
											}
										}
									}
								);
							}
						});
				}
			} else {
				instance.loadScript(
					path.join(path.dirname(file), data.main),
					function() {
						if (typeof cb === 'function') {
							cb.apply(this, arguments);
						} else {
							for (let id in callbacks.moduleLoaded) {
								callbacks.moduleLoaded[id]
									.apply(this, arguments);
							}
						}
					}
				);
			}
		});
	};

	function _findFiles(directories) {
		let files = [];

		if (typeof directories === 'string' || directories instanceof String) {
			directories = directories.replace(/^file:/, '');
			try {
				files = fs.readdirSync(directories);
				for (let i in files) {
					files[i] = directories + '/' + files[i];
				}
			} catch (err) {
				// no module folder - ignore files
			}
		} else {
			for (let i in directories) {
				directories[i] = directories[i].replace(/^file:/, '');
				try {
					let _tempFiles = fs.readdirSync(directories[i]);
					for (let j in _tempFiles) {
						_tempFiles[j] = directories[i] + '/' + _tempFiles[j];
					}
					files = files.concat(_tempFiles);
				} catch (err) {
					// no module folder - ignore files
				}
			}
		}

		return files;
	}

	this.findLangFiles = function(directories) {
		let result = [];
		let files = _findFiles(directories);

		for (let i in files) {
			let file = fs.realpathSync(files[i]);
			if (file.endsWith('.json')) {
				result.push(file);
			}
		}
		return result;
	};

	this.findModules = function(directories) {
		let result = [];
		let files = _findFiles(directories);

		for (let i in files) {
			let file = fs.realpathSync(files[i]);
			if (file.endsWith(MODULE_EXTENSION)) {
				result.push(file);
			} else if (
				fs.lstatSync(file).isDirectory() &&
				fs.existsSync(file + '/package.json')
			) {
				result.push(file + '/package.json');
			}
		}
		return result;
	};

	function _isZipped(path) {
		return path.endsWith(MODULE_EXTENSION);
	}

	function _unzip(path) {
		fs.createReadStream(path).pipe(
			unzip.Extract({
				path: _removeExtension(path),
			})
		);
	}

	function _removeExtension(path) {
		return path.substr(0, path.length - MODULE_EXTENSION.length);
	}

	function _getData(path, cb) {
		$.ajax({
			url: path,
			success: cb,
			dataType: 'json',
			context: this,
		});
	}

	initialize(initLang, langFile);
}

// Node Export
if (module) {
	module.exports = {
		Module: Module,
	};
}
