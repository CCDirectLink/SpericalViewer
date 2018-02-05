function Environment(){
	const {app} = require('electron').remote; //remote access

	// globals
	const TOOLNAME = require('electron').remote.getGlobal('toolname');

	const CC_SAVE = require('electron').remote.getGlobal('ccSave');
	const CC_SAVE_BACKUP = require('electron').remote.getGlobal('ccSaveBackup');

	const CC_SAVE_FOLDER = require('electron').remote.getGlobal('saveFolder');


	const MAIN_DIR = require('electron').remote.getGlobal('mainDir');
	const STORAGE_DIR = require('electron').remote.getGlobal('storageDir');

	const CACHE_DIR = require('electron').remote.getGlobal('cacheDir');
	const MODULES_USER_DIR = require('electron').remote.getGlobal('modulesUserDir');
	const MODULES_APP_DIR = require('electron').remote.getGlobal('modulesAppDir');

	// check if dev
	this.isDevEnv = require('electron').remote.getGlobal('isDevEnv');
	
	var version = {
		major: 0, 
		minor: 0, 
		patch: 0,
		hotfix: 0,
		rev: 0, 
		string: "0.0.0", // or 0.0.0-0
		numeric: 0, // major [infinite digits] minor [4 digits] patch [4 digits] hotfix [2 digits]
					// unique (single) version number for fast and easy comparisons
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
	
	this.name = TOOLNAME;
	this.version = version;
	this.build = build;
	this.path = {
			save: {
				file: CC_SAVE,
				backupFile: CC_SAVE_BACKUP,
				folder: CC_SAVE_FOLDER
			},
			module: {
				user: MODULES_USER_DIR,
				app: MODULES_APP_DIR
			},
			cache: CACHE_DIR,
			storage: STORAGE_DIR
		};

	this.os = process.platform;
	
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
				version.patch = Number(versionArray[2].replace(/\D/g, '')); //Remove note
				version.hotfix = 0;

				version.numeric = (version.major * 10000000000) + (version.minor * 1000000) + (version.patch * 100) + version.hotfix;

				var noteData = /\D/g.exec(versionArray[2]); //Extract note

				if (noteData != null){
					version.note = noteData[1];
				}

			}

			version.rev = jsonData.rev;
			version.string = version.major + "." + version.minor + "." + version.patch + version.note;
			
			build.sorthash = jsonData.hash;
			build.longhash = jsonData.hashlong;
			build.date = jsonData.date;

			// remove electron access & module access
			delete app;
			delete require;

		}).fail(function(jqxhr, textStatus, error) {
			if (textStatus == "error") {
				alert("versions dependent file missing");
			}
			else {
				alert("error in versions.json: " + error);
			}

			process.exit(0);
		});
	}
	
	
	initialize(this);
}