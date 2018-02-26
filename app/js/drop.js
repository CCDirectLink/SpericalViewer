/* global globals  */
'use strict';

function allowDrop(ev) {
	ev.preventDefault();
}

function drop(ev) {
	ev.preventDefault();

	globals.loader.load(ev.dataTransfer.files);
}

// Node Export
if (module) {
	module.exports = {
		allowDrop: allowDrop,
		drop: drop,
	};
}
