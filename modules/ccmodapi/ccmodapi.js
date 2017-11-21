function CCModDB(){

	this.moddata = {};

	var instance = this;

	var callbacks = {
		dataInit: [],
		dataUpdated: []
	};

	var langEntries = globals.module.getLangData();

	globals.module.on("langChanged", function(id, subId, data) {
		langEntries = data;
	});

	this.updateData = function(cb){
		const modReq = {
			hostname: 'raw.githubusercontent.com',
			port: 443,
			path: '/CCDirectLink/CCModDB/master/mods.json',
			method: 'GET',
			headers: {
				'User-Agent': 'SpericalViewer-modAPI'
			}
		};

		https.get(modReq, (res) => {
			var data = '';

			res.on('data', function(part){
				data += part;
			});

			res.on('end', function(){
				instance.moddata = JSON.parse(data);

				if (typeof cb === 'function') {
					cb.apply(this, arguments);
				}
				else {
					for (id in callbacks.dataUpdated) {
						callbacks.dataUpdated[id].apply(this, arguments);
					}
				}
			});
		}).on('error', (e) => {
			console.error(e);
		});

	}

	this.display = function(){
		$("h1").html(langEntries.content['ccmodapi.mods']);
		$("#provideinfo").html(langEntries.content['ccmodapi.provided']);

		this.updateTable();
	}

	this.updateTable = function(){
		$("#modData").html("<table>" + _getTable() + "</table>");
	}

	this.on = function(type, cb){
		if (type === "dataInit") {
			callbacks.dataInit.push(cb);
		}
		else if (type === "dataUpdated") {
			callbacks.dataUpdated.push(cb);
		}
	}

	function _getTable() {
		var tableString = "<tr><th>" + langEntries.content['ccmodapi.name'] + "</th><th>" + langEntries.content['ccmodapi.desc'] + "</th><th>" + langEntries.content['ccmodapi.license'] + "</th><th>" + langEntries.content['ccmodapi.download'] + "</th></tr>";

		if (!instance.moddata) {
			return langEntries.content['ccmodapi.connection'];
		}

		for (var i in instance.moddata.mods) {

			if ((!instance.moddata.mods[i].name) ||
				(!instance.moddata.mods[i].archive_link) ||
				(!instance.moddata.mods[i].version)) {
				continue;
			}

			tableString += "<tr><td>" + instance.moddata.mods[i].name + " (" + i + ")</td>";
			tableString += "<td>" + (instance.moddata.mods[i].description || "") + "</td>";
			tableString += "<td>" + (instance.moddata.mods[i].license || "") + "</td>";
			tableString += "<td><a href=\"" + instance.moddata.mods[i].archive_link + "\">" + langEntries.content['ccmodapi.version'] + " " + instance.moddata.mods[i].version + "</a></td></tr>";
		}

		return tableString;
	}

	instance.updateData(function(){
		for (id in callbacks.dataInit) {
			callbacks.dataInit[id].apply(this, arguments);
		}
	});

}

globals.ccmoddb = new CCModDB();

globals.module.on("modulesLoaded", function(){
	globals.menu.add("CCMods", function(){}, "../modules/ccmodapi/ccmodapi.html", true);
	globals.menu.updateAll();
});