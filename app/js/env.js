/**
 * Global environment data
 * @type {Object}
 */
const globalData = (() => {

	// require
	const {app, getGlobal} = require('electron').remote; //remote access
	const fs = require('fs');

	// remove electron access & module access
	if (typeof require !== 'undefined') {
		delete require;
	}

	var versionData = null;
	var buildData = {};

	try {
		// syncron data call
		const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'version', 'versions.json')));
		
		versionData = new VersionType(jsonData.ver);
		buildData.rev = jsonData.rev;
		buildData.sorthash = jsonData.hash;
		buildData.longhash = jsonData.hashlong;
		buildData.date = jsonData.date;
	}
	catch (err) {
		alert(err);
		process.exit(0);
	}

	return {
		name: getGlobal('toolname'),
		path: {
			save: {
				file: getGlobal('ccSave'),
				backupFile: getGlobal('ccSaveBackup'),
				folder: getGlobal('saveFolder')
			},
			module: {
				user: getGlobal('modulesUserDir'),
				app: getGlobal('modulesAppDir')
			},
			cache: getGlobal('cacheDir'),
			storage: getGlobal('storageDir'),
			main: getGlobal('mainDir')
		},
		isDevEnv: getGlobal('isDevEnv'),
		version: versionData,
		build: buildData,
		os: process.platform,
		versionList: JSON.parse(localStorage.getItem("versionList")) || {}
	};
})();

/**
 * Environment Container
 */
class Environment {

	/**
	 * Environment constructor
	 */
	constructor() {
		this.name = globalData.name;
		this.version = globalData.version;
		this.build = globalData.build;
		this.isDevEnv = globalData.isDevEnv;
		this.path = globalData.path;
		this.os = globalData.os;
		this.versionList = globalData.versionList;
	}

	saveVersionPath(id, path) {
		this.versionList[id] = path;
		// update versionList
		localStorage.setItem("versionList", JSON.stringify(versionList));
	}
	
	removeVersionPath(id) {
		delete this.versionList[id];
		// update versionList
		localStorage.setItem("versionList", JSON.stringify(versionList));
	}

}