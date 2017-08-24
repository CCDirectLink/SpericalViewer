function Environment(){
	const {app} = require('electron').remote; //remote access
	
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
			cache: app.getPath('userData'),
			storage: null,
			seperator: path.sep
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

			if (process.platform == "darwin") {
				env.path.storage = process.env.HOME + "/Library/Application Support/" + env.name + "/GameStorage";
				env.path.save.folder = process.env.HOME + "/Library/Application Support/CrossCode/" + "Default";
			}
			else if (process.platform == "win32") {
				env.path.storage = process.env.LOCALAPPDATA + "\\" + env.name + "\\GameStorage";
				env.path.save.folder = process.env.LOCALAPPDATA + "\\CrossCode";
			}
			else if (process.platform == "linux") {
				env.path.storage = process.env.HOME + "/.config/" + env.name + "/GameStorage";
				env.path.save.folder = process.env.HOME + "/.config/CrossCode/" + "Default";
			}
			else {
				alert("Unknown System Environment\r\nUsing linux defaults");
				env.path.storage = process.env.HOME + "/.config/" + env.name + "/GameStorage";
				env.path.save.folder = process.env.HOME + "/.config/CrossCode/" + "Default";
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