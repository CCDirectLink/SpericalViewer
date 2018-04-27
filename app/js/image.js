/* global globals, fs */
'use strict';

function ImageDatabase() {
	let imageDatabase = {};
	let observers = [];

	this.scale = 2;
	this.method = 'nearest-neighbor';

	function readFile(url) {
		return new Promise(function(resolve, reject) {
			fs.readFile(url, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}

	this.addImage =
		function(version, name, tileName, url, x, y, width, heigth) {

			const scaleValue = this.scale;
			// const methodValue = this.method;
			// const type = path.extname(url).substring(1);

			let canvas = document.createElement('canvas');
			canvas.width = width * scaleValue;
			canvas.height = heigth * scaleValue;

			readFile(url).then(file => {
				if (!imageDatabase[version]) {
					imageDatabase[version] = {};
				}

				let image = document.createElement('img');
				image.src = 'data:image/png;base64,' + file.toString('base64');
				let ctx = canvas.getContext('2d');
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(image, x, y,
					(canvas.width / scaleValue),
					(canvas.height / scaleValue),
					0, 0,
					canvas.width,
					canvas.height);
				globals.imageData.saveImage(
					version,
					name,
					tileName,
					ctx.canvas.toDataURL()
				);
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
		for (let i in observers) {
			const observer = observers[i];
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
