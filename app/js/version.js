/* global globals */
'use strict';

function Version() {
	this.getList = function(currentVersion) {
		let option = '';

		for (let version in globals.gameData.versions) {
			let full =
				version + ' - ' +
				globals.gameData.versions[version].version.string;

			let selected = '';

			if (currentVersion === full) selected = 'selected';

			option +=
				'<option value="' +
				version + '" ' +
				selected + '>' +
				full + '</option>';
		}

		return option;
	};
}

// Node Export
if (module) {
	module.exports = {
		Version: Version,
	};
}
