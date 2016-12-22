function filePoint(file, mode, callback)
{

	var byteCount = 0;
	var done = false;

	switch (mode)
	{
		default:
			var testStartStream = fs.createReadStream(file);

			// find start
			testStartStream.on('data', function(chunk) {

				if (done) return;
				for(var i = 0; i < chunk.length; ++i)
				{
					if (done) return;
					byteCount++;
													// Signature
					if ((chunk[i] == 0x50) &&		// P
						(chunk[i + 1] == 0x4b) &&	// K
						(chunk[i + 2] == 0x03) &&   // 0x3
						(chunk[i + 3] == 0x04) &&	// 0x4

						(chunk[i + 30] == 0x64) &&	// d
						(chunk[i + 31] == 0x61) && 	// a
						(chunk[i + 32] == 0x74) && 	// t
						(chunk[i + 33] == 0x61) && 	// a
						(chunk[i + 34] == 0x2f)) 	// slash
					{
						// startpoint found
						testStartStream.close();
						done = true;
						callback(file, byteCount);
					}
				}

			});

			testStartStream.on('end', function() {
				alert("invalid file: " + file + "<br />No package entry.");
			});

	}

}