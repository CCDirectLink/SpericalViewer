/* eslint-env node */
/* global globals  */
'use strict';

function allowDrop(ev) {
	ev.preventDefault();
}

function drop(ev) {
	ev.preventDefault();

	globals.loader.load(ev.dataTransfer.files);
}
