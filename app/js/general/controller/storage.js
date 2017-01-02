const dirdata = require('./js/general/controller/dirdata.js');

function gameStorageController()
{

	this.cacheData = Object();

	var cacheData = this.cacheData;

	// load storage data ------
	fs.readdir(spo.env.path.storage, function(err, list) {

		for (var index in list)
		{
			if (list[index] != ".DS_Store")
			{
				dirdata.stats(spo.env.path.storage + spo.env.path.seperator + list[index], function(err, statResult){
					if ((typeof cacheData[list[index]] == 'undefined') || (cacheData[list[index]]  == null))
					{
						cacheData[list[index]] = Object();
					}
					cacheData[list[index]] = {size: statResult.size};
				});
			}
		}

	});
	// ------------------------

}