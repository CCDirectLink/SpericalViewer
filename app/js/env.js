function Environment(){
	const {app} = require('electron').remote; //remote access

	const STORAGE_FOLDER = "GameStorage";
	const MODULES_FOLDER = "modules";

	// check if dev
	this.isDevEnv = require('electron').remote.require('electron-is-dev');
	
	var version = {
		major: 0, 
		minor: 0, 
		build: 0, 
		rev: 0, 
		string: "0.0.0", 
		note: ""
	};
	
	var build = {
		sorthash: null, 
		longhash: null, 
		date: {
			day: 0, 
			month: 0, 
			year:0
		}
	};
	
	var versionList = {};
	
	this.name = "SpericalViewer";
	this.version = version;
	this.build = build;
	this.path = {
			save: {
				file: "cc.save",
				backupFile: "cc.save.backup",
				folder: null
			},
			module: {
				user: null,
				app: null
			},
			cache: app.getPath('userData'),
			storage: null
		};
	
	this.saveVersionPath = function(id, path){
		versionList[id] = path;
		localStorage.setItem("versionList", JSON.stringify(versionList));
	}
	
	this.removeVersionPath = function(id){
		delete versionList[id];
		localStorage.setItem("versionList", JSON.stringify(versionList));
	}
	
	this.getSavedVersions = function(){
		return versionList;
	}
	
	function initialize(env){
		versionList = JSON.parse(localStorage.getItem("versionList")) || {};
		
		var tmp = $.getJSON('version/versions.json').done(function(){
			var jsonData = tmp.responseJSON;
			var versionArray = jsonData.ver.split(".");
			if (typeof versionArray[0] != "undefined"){
				version.major = Number(versionArray[0].replace('v', ''));
				version.minor = Number(versionArray[1]);
				version.build = Number(versionArray[2].replace(/\D/g, '')); //Remove note

				var noteData = /\D/g.exec(versionArray[2]); //Extract note

				if (noteData != null){
					version.note = noteData[1];
				}

			}

			version.rev = jsonData.rev;
			version.string = version.major + "." + version.minor + "." + version.build + version.note;
			
			build.sorthash = jsonData.hash;
			build.longhash = jsonData.hashlong;
			build.date = jsonData.date;

			env.os = process.platform;

			if (process.platform == "darwin") {
				env.path.module.user = process.env.HOME + path.sep + "Library" + path.sep + "Application Support" + path.sep + env.name + path.sep + MODULES_FOLDER;
				var _appFolderPath = app.getAppPath();

				if ((_appFolderPath.length > 32) &&
					(_appFolderPath.substr(_appFolderPath.length - 32, _appFolderPath.length) == (".app" + path.sep + "Contents" + path.sep + "Resources" + path.sep + "app.asar")))
				{
					_appFolderPath = _appFolderPath.substr(0, _appFolderPath.length - 32);
					_appFolderPath = _appFolderPath.substr(0, _appFolderPath.lastIndexOf(path.sep));
				}
	
				env.path.module.app = _appFolderPath + path.sep + MODULES_FOLDER;
				env.path.storage = process.env.HOME + path.sep + "Library" + path.sep + "Application Support" + path.sep + env.name + path.sep + STORAGE_FOLDER;
				env.path.save.folder = process.env.HOME + path.sep + "Library" + path.sep + "Application Support" + path.sep + "CrossCode" + path.sep + "Default";
			}
			else if (process.platform == "win32") {
				env.path.module.user = process.env.LOCALAPPDATA + path.sep + env.name + path.sep + MODULES_FOLDER;
				env.path.module.app = app.getAppPath() + path.sep + MODULES_FOLDER;
				env.path.storage = process.env.LOCALAPPDATA + path.sep + env.name + path.sep + STORAGE_FOLDER;
				env.path.save.folder = process.env.LOCALAPPDATA + path.sep + "CrossCode";
			}
			else if (process.platform == "linux") {
				env.path.module.user = process.env.HOME + path.sep + ".config" + path.sep + env.name + path.sep + MODULES_FOLDER;
				env.path.module.app = app.getAppPath() + path.sep + MODULES_FOLDER;
				env.path.storage = process.env.HOME + path.sep + ".config" + path.sep + env.name + path.sep + STORAGE_FOLDER;
				env.path.save.folder = process.env.HOME + path.sep + ".config" + path.sep + "CrossCode" + path.sep + "Default";
			}
			else {
				alert("Unknown System Environment\r\nUsing linux defaults");
				env.path.module.user = process.env.HOME + path.sep + ".config" + path.sep + env.name + path.sep + MODULES_FOLDER;
				env.path.module.app = app.getAppPath() + path.sep + MODULES_FOLDER;
				env.path.storage = process.env.HOME + path.sep + ".config" + path.sep + env.name + path.sep + STORAGE_FOLDER;
				env.path.save.folder = process.env.HOME + path.sep + ".config" + path.sep + "CrossCode" + path.sep + "Default";
			}

			delete app;
		}).fail(function(jqxhr, textStatus, error) {
			if (textStatus == "error") {
				alert("versions dependent file missing; run genVersion first");
			}
			else {
				alert("error in versions.json: " + error);
			}

			process.exit(0);
		});
	}
	
	
	initialize(this);
}