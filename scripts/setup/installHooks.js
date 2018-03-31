'use strict';

let runInit = false;

process.argv.forEach((val, index) => {
	if (val === 'init') {
		runInit = true;
	}
});

process.argv = [];

// imports
// const fs = require('fs');

/** Execute postinstall
  */
exports.init = function() {
};

// function gitInstalled() {
//
// }

// function gitFlowInstalled() {
//
// }

if (runInit) {
	exports.init();
}
