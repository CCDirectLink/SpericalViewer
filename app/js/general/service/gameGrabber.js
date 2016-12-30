function gameGrabber(entryPath, containerId)
{
	fs.readdir(entryPath, (function(){

		return function (err, files) {

			if (typeof files == 'undefined') return;

			fs.readFile(entryPath + dataPath + spo.env.path.seperator + "changelog.json", function (err, data) {
				if (typeof data == 'undefined') return;
					var changelogJson = JSON.parse(data);
					var gameId = crypto.createHash('sha256');
					gameId.update(data);

					var gameIdHex = gameId.digest('hex');
					var shortIdHex = gameIdHex.substr(0,8);

					// already added
					if (spo.gameData.hasGame(shortIdHex))
					{
						alert("already added");
						return;
					}

					spo.gameData.addData(shortIdHex, "changelog", changelogJson.changelog);
					spo.gameData.addData(shortIdHex, "containerId", containerId);
					spo.gameData.addData(shortIdHex, "gameId", gameIdHex);
					spo.gameData.addData(shortIdHex, "shortId", shortIdHex);

					var versionArray = changelogJson.changelog[0].version.split('.');
					var versionString = changelogJson.changelog[0].version;
					var hotfixNumber = 0;

					if ((typeof changelogJson.changelog[0].fixes != "undefined") && (Array.isArray(changelogJson.changelog[0].fixes)))
					{
						var searchPattern = /HOTFIX\(([0-9]+)\)/i
						var patternResult = searchPattern.exec(changelogJson.changelog[0].fixes[changelogJson.changelog[0].fixes.length - 1]);
		
						if ((patternResult != null) && (typeof patternResult[1] != "undefined"))
						{
							hotfixNumber = Number(patternResult[1]);
							versionString += "-" + patternResult[1];
						}
					}

					spo.gameData.addData(shortIdHex, "version", {major: Number(versionArray[0]), minor: Number(versionArray[1]), patch: Number(versionArray[2]), hotfix: hotfixNumber, string: versionString});

					// data

					fs.readFile(entryPath + dataPath + spo.env.path.seperator + "database.json", function (err, data) {
						if (typeof data == 'undefined') return;
							var databaseJson = JSON.parse(data);
							spo.gameData.addData(shortIdHex, "database", databaseJson);
					})

					fs.readFile(entryPath + dataPath + spo.env.path.seperator + "global-settings.json", function (err, data) {
						if (typeof data == 'undefined') return;
							var globalSettingsJson = JSON.parse(data);
							spo.gameData.addData(shortIdHex, "globalSettings", globalSettingsJson);
					})

					fs.readFile(entryPath + dataPath + spo.env.path.seperator + "item-database.json", function (err, data) {
						if (typeof data == 'undefined') return;
							var itemsJson = JSON.parse(data);
							spo.gameData.addData(shortIdHex, "items", itemsJson.items);
					})

					// media

					fs.readFile(entryPath + mediaPath + spo.env.path.seperator + "font" + spo.env.path.seperator + "icons-items.png", function (err, data) {
						if (typeof data == 'undefined') return;

						var iconSpecify = ["undef", "item-helm", "item-sword", "item-belt", "item-shoe", "item-items", "item-key", "item-trade"]
						var iconSet = { dimension: {width: 14, height: 16, xpad: 1, ypad: 1}, column: 8, row: 5 };

						for (var rowIndex = 0; rowIndex < iconSet.row; rowIndex++)
						{
							for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++)
							{
								var startX = columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad);
								var startY = rowIndex * (iconSet.dimension.height + iconSet.dimension.ypad);

								spo.imageData.addImage("items", iconSpecify[columnIndex] + rowIndex, data, "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
							}
						}

					})

					fs.readFile(entryPath + mediaPath + spo.env.path.seperator + "gui" + spo.env.path.seperator + "menu.png", function (err, data) {
						if (typeof data == 'undefined') return;

						var iconSpecify = ["hp", "attack", "defense", "focus", "elemHeat", "elemCold", "elemShock", "elemWave"]
						var iconSet = { dimension: {width: 11, height: 11, xpad: 1}, column: 8, xstart: 33, ystart: 280 };

						for (var columnIndex = 0; columnIndex < iconSet.column; columnIndex++)
						{
							var startX = (columnIndex * (iconSet.dimension.width + iconSet.dimension.xpad)) + iconSet.xstart;
							var startY = iconSet.ystart;

							spo.imageData.addImage("items", iconSpecify[columnIndex], data, "png", startX, startY, iconSet.dimension.width, iconSet.dimension.height);
						}

					})

					updateMenu();

			})

		}

	})());
}