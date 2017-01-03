const dirdata = require('./js/general/controller/dirdata.js');

function gameStorageController(callback)
{

	this.cacheData = Object();
	this.finCallback = Array();

	var cacheData = this.cacheData;
	var finSize = {val: 1};
	var finArray = this.finCallback;

	if ((typeof callback != "undefined") && (callback != null))
	{
		this.finCallback.push(callback);
	}

	this.readData = function() {

		// load storage data ------
		fs.readdir(spo.env.path.storage, function(err, list) {

			finSize.val = 0;

			for (var index in list)
			{
				if (list[index] != ".DS_Store")
				{
					finSize.val += 1;
				}
			}

			for (var index in list)
			{

				if (list[index] != ".DS_Store")
				{

					dirdata.stats(spo.env.path.storage + spo.env.path.seperator + list[index], {containerId: list[index], finArray: finArray, finSize: finSize}, function(err, statResult){

						if ((typeof cacheData[statResult.extern.containerId] == 'undefined') ||
							(cacheData[statResult.extern.containerId]  == null))
						{
							cacheData[statResult.extern.containerId] = Object();
						}

						gameInfo(statResult.dir + spo.env.path.seperator + dataPath, statResult.extern.containerId, function(err, data){

							cacheData[data.containerId] = {size: data.extern.size,
								path: data.extern.path,
								id: data.containerId,
								gameId: data.gameId,
								shortId: data.shortId,
								version: data.version};

								data.extern.finSize.val--;
								if (data.extern.finSize.val == 0)
								{
									for (var index in data.extern.finArray)
									{
										data.extern.finArray[index](cacheData[data.containerId]);
									}
								}

						}, {gamecheck: false, through: {size: statResult.size, path: statResult.dir, finArray: statResult.extern.finArray, finSize: statResult.extern.finSize}});

					});
				}
			}

		});
		// ------------------------

	}

	this.fin = function(callback) {
		this.finCallback.push(callback);
	}

	this.finTrigger = function() {
		finSize.val = 1;
		this.readData();
	}

	this.getTable = function() {
		var tableString = "<tr><th>" + spo.langData.getEntry("id") + "</th><th>" + spo.langData.getEntry("containerId") + "</th><th>" + spo.langData.getEntry("version") + "</th><th>" + spo.langData.getEntry("cacheSize") + "</th><th></th></tr>";

		if (this.cacheData.length == 0) return spo.langData.getEntry("noGames");

		for (var gameIndex in this.cacheData)
		{	// spo.gameData.removeData('" + this.cacheData[gameIndex].id + "');
			tableString += "<tr><td>" + this.cacheData[gameIndex].shortId + "</td><td>" + this.cacheData[gameIndex].id + "</td><td>" + this.cacheData[gameIndex].version.string + "</td><td>" + this.cacheData[gameIndex].size + "</td><td><a class=\"close\" id=\"" + this.cacheData[gameIndex].id + "\" onclick=\"\">" + spo.langData.getEntry("clear") + "</a></td></tr>";
		}

		return tableString;
	}

}