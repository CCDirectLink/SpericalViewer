function ImageDatabase(){
	var imageDatabase = {};

	this.scale = 2;
	this.method = "nearest-neighbor";

	this.addImage = function(category, identifier, imageUrl, imageType, x, y, width, heigth) {
		var scaleValue = this.scale;
		var methodValue = this.method;

		lwip.open(imageUrl, imageType, function(err, image) {
			if(err)
				throw err;
			
			image.crop(
				x,
				y,
				x + width - 1,
				y + heigth - 1,
				function(err, cropedImage) {
					cropedImage.resize(
						width * scaleValue,
						heigth * scaleValue,
						methodValue,
						function(err, finishedImage) {
							finishedImage.toBuffer(imageType, {compression: "none", interlaced: false, transparency: true}, function(err, buffer) {
								if (!imageDatabase[category]) {
									imageDatabase[category] = {};
								}

								if (!imageDatabase[category][identifier]) {
									imageDatabase[category][identifier] = {};
								}

								imageDatabase[category][identifier] = "data:image/" + imageType + ";base64," + buffer.toString('base64');
							});
						}
					);
				}
			);
		});
	}

	this.removeImage = function(category, identifier){
		if (!imageDatabase[category] == "undefined" || !imageDatabase[category][identifier])
			return;

		delete imageDatabase[category][identifier];
	}

	this.getImage = function(category, identifier) {
		if (!imageDatabase[category] == "undefined" || !imageDatabase[category][identifier])
			return "";

		return imageDatabase[category][identifier];
	}
}