const fs = require("fs");

var seperator;

if (process.platform == "darwin")
{
	seperator = "/";
}
else if (process.platform == "win32")
{
	seperator = "\\";
}
else if (process.platform == "linux")
{
	seperator = "/";
}
else
{
	seperator = "/";
}


exports.stats = function(directory, callback, options)
{
	
	var totalSize = 0;
	var fileNumber = 0;
	var folderNumber = 0;
	var error = null;

	if (!fs.statSync(directory).isDirectory())
	{
		console.warn(directory + " is no directory");
	}

	// read content
	fs.readdir(directory, function(err, list) {

		for (var index in list)
		{
			var elemStats = fs.statSync(directory + seperator + list[index]);

			if (elemStats.isFile())
			{
				// file
				// size in Byte
				//console.log("file (" + directory + seperator + list[index] + "): " + elemStats.size);
				totalSize += elemStats.size;
				fileNumber++;
			}
			else if (elemStats.isDirectory())
			{
				// directory
				//console.log("dir (" + directory + seperator + list[index] + ")");
				var dirResults = exports.statsSync(directory + seperator + list[index]);
				totalSize += dirResults.size;
				folderNumber += dirResults.folder;
				fileNumber += dirResults.files;
				folderNumber++;
			}
			else if (elemStats.isBlockDevice())
			{
				// block device
				// (ignored)
			}
			else if (elemStats.isCharacterDevice())
			{
				// character device
				// (ignored)
			}
			else if (elemStats.isSymbolicLink())
			{
				// symlink
				// (ignored)
			}
			else if (elemStats.isFIFO())
			{
				// FIFO
				// (ignored)
			}
			else if (elemStats.isSocket())
			{
				// Socket
				// (ignored)
			}
			else
			{
				// Unknown
				// (ignored)
			}

		}

		callback(error, {size: totalSize, files: fileNumber, folder: folderNumber});

	});

}

exports.statsSync = function(directory, options)
{

	var totalSize = 0;
	var fileNumber = 0;
	var folderNumber = 0;
	var error = null;

	if (!fs.statSync(directory).isDirectory())
	{
		console.warn(directory + " is no directory");
	}

	// read content
	var list = fs.readdirSync(directory);

	for (var index in list)
	{
		var elemStats = fs.statSync(directory + seperator + list[index]);

		if (elemStats.isFile())
		{
			// file
			// size in Byte
			//console.log("file (" + directory + seperator + list[index] + "): " + elemStats.size);
			totalSize += elemStats.size;
			fileNumber++;
		}
		else if (elemStats.isDirectory())
		{
			// directory
			//console.log("dir (" + directory + seperator + list[index] + ")");
			var dirResults = exports.statsSync(directory + seperator + list[index]);
			totalSize += dirResults.size;
			folderNumber += dirResults.folder;
			fileNumber += dirResults.files;
			folderNumber++;
		}
		else if (elemStats.isBlockDevice())
		{
			// block device
			// (ignored)
		}
		else if (elemStats.isCharacterDevice())
		{
			// character device
			// (ignored)
		}
		else if (elemStats.isSymbolicLink())
		{
			// symlink
			// (ignored)
		}
		else if (elemStats.isFIFO())
		{
			// FIFO
			// (ignored)
		}
		else if (elemStats.isSocket())
		{
			// Socket
			// (ignored)
		}
		else
		{
			// Unknown
			// (ignored)
		}

	}

	return {size: totalSize, files: fileNumber, folder: folderNumber, error: error};

}