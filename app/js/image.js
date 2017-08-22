function ImageDatabase(){
	var imageDatabase = {};
	var observers = [];

	this.scale = 2;
	this.method = "nearest-neighbor";

	this.addImage = function(containerId, name, tileName, url, type, x, y, width, heigth) {
		var scaleValue = this.scale;
		var methodValue = this.method;

		lwip.open(url, type, function(err, image) {
			if(err)
				throw err;
			
			if(!imageDatabase[containerId])
				imageDatabase[containerId] = {};
			
			if(x == undefined){
				if(width){
					image.resize(
						width * scaleValue,
						heigth * scaleValue,
						methodValue,
						function(err, finishedImage) {
							finishedImage.toBuffer(type, {compression: "none", interlaced: false, transparency: true}, function(err, buffer) {
								globals.imageData.saveImage(containerId, name, tileName, "data:image/" + type + ";base64," + buffer.toString('base64'));
							});
						}
					);
				} else {
					image.resize(
						image.width() * scaleValue,
						image.heigth() * scaleValue,
						methodValue,
						function(err, finishedImage) {
							finishedImage.toBuffer(type, {compression: "none", interlaced: false, transparency: true}, function(err, buffer) {
								globals.imageData.saveImage(containerId, name, tileName, "data:image/" + type + ";base64," + buffer.toString('base64'));
							});
						}
					);
				}
			} else {
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
								finishedImage.toBuffer(type, {compression: "none", interlaced: false, transparency: true}, function(err, buffer) {
									globals.imageData.saveImage(containerId, name, tileName, "data:image/" + type + ";base64," + buffer.toString('base64'));
								});
							}
						);
					}
				);
			}
		});
	}
	
	this.saveImage = function(containerId, name, tileName, image){
		if(!tileName){
			imageDatabase[containerId][name] = image; //No tiles
		} else {
			if(!imageDatabase[containerId][name])
				imageDatabase[containerId][name] = {};
			
			imageDatabase[containerId][name][tileName] = image; //With tiles
		}
	}

	this.removeImage = function(containerId, name, tileName){
		if (!imageDatabase[containerId] || !imageDatabase[containerId][name])
			return;
		
		if(!tileName)
			delete imageDatabase[containerId][name];
		else
			delete imageDatabase[containerId][name][tileName];
		
		_callObservers(name, tileName);
	}

	this.getImage = function(containerId, name, tileName) {
		if (!imageDatabase[containerId] || !imageDatabase[containerId][name])
			return "";

		if(!tileName)
			return imageDatabase[containerId][name];
		else
			return imageDatabase[containerId][name][tileName];
	}
	
	this.registerObserver = function(cb, name, tileName){
		observers.push({name: name, tileName:tileName, cb: cb});
	}
	
	function _callObservers(name, tileName, image){
		for(var i in observers){
			var observer = observers[i];
			if(!observer.name){
				observer.cb(name, tileName, image);
			}
			
			if(observer.name !== name)
				continue;
			
			if(!observer.tileName || observer.tileName === tileName || 
				(Array.isArray(observer.tileName) && observer.tileName.indexOf(tileName) >= 0)){
				observer.cb(name, tileName, image);
			}
		}
	}
}