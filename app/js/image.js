/* global path, globals, lwip */
'use strict';

function ImageDatabase() {
	var imageDatabase = {};
	var observers = [];

	this.scale = 2;
	this.method = 'nearest-neighbor';

	this.addImage =
		function(version, name, tileName, url, x, y, width, heigth) {

			var scaleValue = this.scale;
			var methodValue = this.method;

			const type = path.extname(url).substring(1);

			lwip.open(url, type, function(err, image) {
				if (err) {
					throw err;
				}

				if (!imageDatabase[version]) {
					imageDatabase[version] = {};
				}

				if (x === undefined) {
					if (width) {
						image.resize(
							width * scaleValue,
							heigth * scaleValue,
							methodValue,
							function(err, finishedImage) {
								if (err) {
									throw err;
								}

								finishedImage.toBuffer(
									type,
									{
										compression: 'none',
										interlaced: false,
										transparency: true,
									},
									function(err, buffer) {
										if (err) {
											throw err;
										}

										globals.imageData.saveImage(
											version,
											name,
											tileName,
											'data:image/' +
										type +
										';base64,' +
										buffer.toString('base64')
										);
									}
								);
							}
						);
					} else {
						image.resize(
							image.width() * scaleValue,
							image.heigth() * scaleValue,
							methodValue,
							function(err, finishedImage) {
								if (err) {
									throw err;
								}

								finishedImage.toBuffer(
									type,
									{
										compression: 'none',
										interlaced: false,
										transparency: true,
									},
									function(err, buffer) {
										if (err) {
											throw err;
										}

										globals.imageData.saveImage(
											version,
											name,
											tileName,
											'data:image/' +
										type +
										';base64,' +
										buffer.toString('base64')
										);
									}
								);
							}
						);
					}
				} else {
					image.crop(x, y, x + width - 1, y + heigth - 1, function(
						err,
						cropedImage
					) {
						if (err) {
							throw err;
						}

						cropedImage.resize(
							width * scaleValue,
							heigth * scaleValue,
							methodValue,
							function(err, finishedImage) {
								if (err) {
									throw err;
								}

								finishedImage.toBuffer(
									type,
									{
										compression: 'none',
										interlaced: false,
										transparency: true,
									},
									function(err, buffer) {
										if (err) {
											throw err;
										}

										globals.imageData.saveImage(
											version,
											name,
											tileName,
											'data:image/' +
										type +
										';base64,' +
										buffer.toString('base64')
										);
									}
								);
							}
						);
					});
				}
			});
		};

	this.saveImage = function(version, name, tileName, image) {
		if (!tileName) {
			imageDatabase[version][name] = image; // No tiles
		} else {
			if (!imageDatabase[version][name]) {
				imageDatabase[version][name] = {};
			}

			imageDatabase[version][name][tileName] = image; // With tiles
		}

		_callObservers(name, tileName, image);
	};

	this.removeImage = function(version, name, tileName) {
		if (!imageDatabase[version] || !imageDatabase[version][name]) {
			return;
		}

		if (!tileName) {
			imageDatabase[version][name] = undefined;
		} else {
			imageDatabase[version][name][tileName] = undefined;
		}

		_callObservers(name, tileName);
	};

	this.getImage = function(version, name, tileName) {
		if (!imageDatabase[version] || !imageDatabase[version][name]) {
			return '';
		}

		if (!tileName) {
			return imageDatabase[version][name] || '';
		} else {
			return imageDatabase[version][name][tileName] || '';
		}
	};

	this.registerObserver = function(cb, name, tileName) {
		return observers.push({
			name: name,
			tileName: tileName,
			cb: cb,
		});
	};

	function _callObservers(name, tileName, image) {
		for (var i in observers) {
			var observer = observers[i];
			if (!observer.name) {
				observer.cb(name, tileName, image);
			}

			if (observer.name !== name) {
				continue;
			}

			if (
				!observer.tileName ||
				observer.tileName === tileName ||
				(Array.isArray(observer.tileName) &&
				observer.tileName.indexOf(tileName) >= 0)
			) {
				observer.cb(name, tileName, image);
			}
		}
	}
}

// Node Export
if (module) {
	module.exports = {
		ImageDatabase: ImageDatabase,
	};
}
