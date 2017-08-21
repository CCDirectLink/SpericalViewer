const macAppPath = "/Contents/Resources/app.nw/";
const dataPath = "data";
const mediaPath = "media";

function allowDrop(ev) {
	ev.preventDefault();
}

function drop(ev) {
	ev.preventDefault();

	// for all dropped files
	for (var fileIndex in ev.dataTransfer.files)
	{
		var fileEntry = ev.dataTransfer.files[fileIndex];
		if (typeof fileEntry['path'] == "undefined") continue;

		var fileExtension = String(fileEntry['name']).split('.');

		if (typeof fileExtension[1] != "undefined")
		{
			fileExtension = fileExtension[1];
		}
		else
		{
			fileExtension = "";
		}

		if ((fileEntry.type == "") && (fileExtension == "app"))
		{
			// app file (Mac OS)

			gameGrabber(fileEntry.path + macAppPath, null);
		}
		else if ((fileEntry.type == "application/x-msdownload") && (fileExtension == "exe"))
		{
			// exe file (Windows)

			var containerId = crypto.createHash('sha256');
			containerId.update(fileEntry.path);

			var containerIdHex = containerId.digest('hex');
			containerIdHex = containerIdHex.substr(0,8);
			var zipPath = fileEntry.path;
			var unzipPath = spo.env.path.storage + spo.env.path.seperator + containerIdHex + spo.env.path.seperator;

			fs.stat(unzipPath, function(err, stat) {

    			if(err == null)
    			{
        			// exist

					gameGrabber(unzipPath, containerIdHex);

    			}
    			else if(err.code == 'ENOENT')
    			{

        			// does not exist

        			containerBeginInExec(zipPath, 0, function(file, start) {

						fs.createReadStream(file, {start: start - 1}).pipe(unzip.Extract({ path: unzipPath })).on('close', function () {
							gameGrabber(unzipPath, containerIdHex);
						});

					});
        			
    			}
    			else
    			{
        			console.log('File error: ', err.code);
    			}

			});

		}
		else if ((fileEntry.type == "") && (fileExtension == ""))
		{
			// Linux

			var containerId = crypto.createHash('sha256');
			containerId.update(fileEntry.path);

			var containerIdHex = containerId.digest('hex');
			containerIdHex = containerIdHex.substr(0,8);
			var zipPath = fileEntry.path;
			var unzipPath = spo.env.path.storage + spo.env.path.seperator + containerIdHex + spo.env.path.seperator;

			fs.stat(unzipPath, function(err, stat) {

    			if(err == null)
    			{
        			// exist

					gameGrabber(unzipPath, containerIdHex);

    			}
    			else if(err.code == 'ENOENT')
    			{

        			// does not exist

        			containerBeginInExec(zipPath, 1, function(file, start) {

						fs.createReadStream(file, {start: start - 1}).pipe(unzip.Extract({ path: unzipPath })).on('close', function () {
							gameGrabber(unzipPath, containerIdHex);
						});

					});
        			
    			}
    			else
    			{
        			console.log('File error: ', err.code);
    			}

			});

		}
		else
		{
			alert("Invalid file");
		}
	}

}