function Language() {
	this.languageDirectory = "lang";
	this.selectedLang = Object();
	this.defaultLang = {id: "en", sub: "us"};
	this.extern = false;

	var langStore = Object();

	this.loadAll = function(callback) {
		//var langData = {store: langStore, dir: this.languageDirectory, selected: this.selectedLang, extern: this.extern};
		var callbackNum = 0;
		const callbackMax = 2;

		if (this.extern) {
			//TODO: list all files -> loop -> add
		}
		else {
			this.loadLang("en", "us", function(){
				callbackNum++;
				if (callbackNum >= callbackMax) 
					callback(null, null, true);
			});
			this.loadLang("de", "de", function(){
				callbackNum++;
				if (callbackNum >= callbackMax) 
					callback(null, null, true);
			});
		}
	}

	this.loadLang = function(langId, langIdSub, callback) {
		var langData = {store: langStore, dir: this.languageDirectory, selected: this.selectedLang, extern: this.extern};

		if (this.extern) {
			fs.readFile(langData.dir + globals.env.path.seperator + langId + "_" + langIdSub + ".json", function (err, data) {
				if (typeof data == 'undefined') 
					return;
				
				var langJson = JSON.parse(data);

				if (langJson['langId'] === undefined || langJson['langId'] != langId)
					return null;
				if (langJson['langIdSub'] === undefined || langJson['langIdSub'] != langIdSub) 
					return null;

				if (langData.store[langId] !== undefined)
					delete langData.store[langId];

				langData.store[langId] = Object();
				langData.store[langId][langIdSub] = langJson;

				callback(langId, langIdSub, true);
			});
		}
		else {
			$.getJSON(langData.dir + globals.env.path.seperator + langId + "_" + langIdSub + ".json", function(data) {

				if (data['langId'] === undefined || data['langId'] != langId)
					return null;
				if (data['langIdSub'] === undefined || data['langIdSub'] != langIdSub) 
					return null;

				if (langData.store[langId] !== undefined)
					delete langData.store[langId];

				langData.store[langId] = Object();
				langData.store[langId][langIdSub] = data;

				callback(langId, langIdSub, true);
			}).fail(function() {
				callback(langId, langIdSub, false);
			});
		}
	}

	this.setLang = function(langId, langIdSub) {
		if (langStore[langId] === undefined) 
			return false;
		if (langStore[langId][langIdSub] === undefined) 
			return false;
		
		this.selectedLang = {id: langId, sub: langIdSub};
		return true;
	}

	this.getEntry = function(entryId) {
		if ((langStore[this.selectedLang['id']] == undefined) ||
			(langStore[this.selectedLang['id']][this.selectedLang['sub']] == undefined)) {
			this.selectedLang = {id: null, sub: null};
			return this.getDefaultEntry(entryId);
		}
		if ((langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'] == undefined)) 	
			return this.getDefaultEntry(entryId);
		

		if ((langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'][entryId] == undefined))
			return this.getDefaultEntry(entryId);

		return langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'][entryId];
	}

	this.getList = function() {
		var langArray = [];

		for(var langId in langStore) {
			for(var langIdSub in langStore[langId]) {
				langArray.push({
					langId: langStore[langId][langIdSub].langId,
					langIdSub: langStore[langId][langIdSub].langIdSub,
					langName: langStore[langId][langIdSub].langName,
					langNameSub: langStore[langId][langIdSub].langNameSub});
			}
		}

		return langArray;
	}

	this.getDefaultEntry = function(entryId) {
		if ((langStore[this.defaultLang['id']] === undefined) ||
			(langStore[this.defaultLang['id']][this.defaultLang['sub']] === undefined)) {
			return null;
		}
		if (langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'] === undefined) 
			return null;
		if (langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'][entryId] === undefined) 
			return null;

		return langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'][entryId];
	}
}