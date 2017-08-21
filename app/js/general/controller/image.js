function imageController()
{
	var imageDatabase = Object();

	this.scale = 2;
	this.methode = "nearest-neighbor";

	this.addImage = function(category, identifier, imageData, imageType, x, y, width, heigth)
	{

		var scaleValue = this.scale;
		var methodeValue = this.methode;

		lwip.open(imageData, imageType, function(err, image) {

			image.crop(
				x,
				y,
				x + width - 1,
				y + heigth - 1,
				function(err, cropedImage) {

					cropedImage.resize(
						width * scaleValue,
						heigth * scaleValue,
						methodeValue,
						function(err, finishedImage) {

							finishedImage.toBuffer(imageType, {compression: "none", interlaced: false, transparency: true}, function(err, buffer) {

								if ((typeof imageDatabase[category] == "undefined") || (imageDatabase[category] == null))
								{
									imageDatabase[category] = Object();
								}

								if ((typeof imageDatabase[category][identifier] == "undefined") || (imageDatabase[category][identifier] == null))
								{
									imageDatabase[category][identifier] = Object();
								}

								imageDatabase[category][identifier] = "data:image/" + imageType + ";base64," + buffer.toString('base64');

							});

						}
					);

				}
			);

		});

	}

	this.removeImage = function(category, identifier)
	{
		if ((typeof imageDatabase[category] == "undefined") || (imageDatabase[category] == null)) return;
		if ((typeof imageDatabase[category][identifier] == "undefined") || (imageDatabase[category][identifier] == null)) return;

		delete imageDatabase[category][identifier];
	}

	this.getImage = function(category, identifier)
	{
		if ((typeof imageDatabase[category] == "undefined") || (imageDatabase[category] == null)) return "";
		if ((typeof imageDatabase[category][identifier] == "undefined") || (imageDatabase[category][identifier] == null)) return "";

		return imageDatabase[category][identifier];
	}
}