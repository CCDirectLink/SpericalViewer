function languageController()
{
	this.languageDirectory = "lang";
	this.selectedLang = Object();
	this.defaultLang = {id: "en", sub: "us"};
	this.extern = false;

	var langStore = Object();

	this.loadAll = function(callback)
	{
		var langData = {store: langStore, dir: this.languageDirectory, selected: this.selectedLang, extern: this.extern};
		var callbackNum = 0;
		const callbackMax = 2;

		if (this.extern)
		{
			// list all files -> loop -> add (todo)
		}
		else
		{
			this.loadLang("en", "us", function(){
				callbackNum++;
				if (callbackNum >= callbackMax) callback(null, null, true);
			});
			this.loadLang("de", "de", function(){
				callbackNum++;
				if (callbackNum >= callbackMax) callback(null, null, true);
			});
		}
	}

	this.loadLang = function(langId, langIdSub, callback)
	{

		var langData = {store: langStore, dir: this.languageDirectory, selected: this.selectedLang, extern: this.extern};

		if (this.extern)
		{

			fs.readFile(langData.dir + spo.env.path.seperator + langId + "_" + langIdSub + ".json", function (err, data) {

				if (typeof data == 'undefined') return;
				var langJson = JSON.parse(data);

				if (typeof langJson['langId'] == "undefined") return null;
				if (data['langId'] != langId) return null;

				if (typeof data['langIdSub'] == "undefined") return null;
				if (data['langIdSub'] != langIdSub) return null;

				if (typeof langData.store[langId] != "undefined")
				{
					delete langData.store[langId];
				}

				langData.store[langId] = Object();
				langData.store[langId][langIdSub] = langJson;

				callback(langId, langIdSub, true);

			});

		}
		else
		{

			console.log("load lang: " + langData.dir + spo.env.path.seperator + langId + "_" + langIdSub + ".json");

			$.getJSON(langData.dir + spo.env.path.seperator + langId + "_" + langIdSub + ".json", function( data ) {

				if (typeof data['langId'] == "undefined") return null;
				if (data['langId'] != langId) return null;

				if (typeof data['langIdSub'] == "undefined") return null;
				if (data['langIdSub'] != langIdSub) return null;

				if (typeof langData.store[langId] != "undefined")
				{
					delete langData.store[langId];
				}

				langData.store[langId] = Object();
				langData.store[langId][langIdSub] = data;

				callback(langId, langIdSub, true);

			}).fail(function() {

				callback(langId, langIdSub, false);

			});

		}

	}

	this.setLang = function(langId, langIdSub)
	{
		if (typeof langStore[langId] == "undefined") return false;
		if (typeof langStore[langId][langIdSub] == "undefined") return false;
		this.selectedLang = {id: langId, sub: langIdSub};
		return true;
	}

	this.getEntry = function(entryId)
	{
		if ((typeof langStore[this.selectedLang['id']] == "undefined") ||
			(typeof langStore[this.selectedLang['id']][this.selectedLang['sub']] == "undefined"))
		{
			this.selectedLang = {id: null, sub: null};
			return this.getDefaultEntry(entryId);
		}
		if (typeof langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'] == "undefined") return this.getDefaultEntry(entryId);
		if (typeof langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'][entryId] == "undefined") return this.getDefaultEntry(entryId);
		return langStore[this.selectedLang['id']][this.selectedLang['sub']]['content'][entryId];
	}

	this.getList = function()
	{
		var langArray = Array();

		for(var langId in langStore)
		{
			for(var langIdSub in langStore[langId])
			{
				langArray.push({langId: langStore[langId][langIdSub].langId,
					langIdSub: langStore[langId][langIdSub].langIdSub,
					langName: langStore[langId][langIdSub].langName,
					langNameSub: langStore[langId][langIdSub].langNameSub})
			}
		}

		return langArray;
	}

	this.getDefaultEntry = function(entryId)
	{
		if ((typeof langStore[this.defaultLang['id']] == "undefined") ||
			(typeof langStore[this.defaultLang['id']][this.selectedLang['sub']] == "undefined"))
		{
			return null;
		}
		if (typeof langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'] == "undefined") return null;
		if (typeof langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'][entryId] == "undefined") return null;
		return langStore[this.defaultLang['id']][this.defaultLang['sub']]['content'][entryId];
	}
}