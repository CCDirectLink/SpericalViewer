'use strict';

let runInit = false;

process.argv.forEach((val, index) => {
	if (val === 'init') {
		runInit = true;
	}
});

process.argv = [];

// imports
const installHooks = require('./installHooks');

/** Execute postinstall
  */
exports.init = function() {
	installHooks.init();
};

if (runInit) {
	exports.init();
}
