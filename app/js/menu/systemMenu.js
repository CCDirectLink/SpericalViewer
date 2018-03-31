/* eslint-env node */
'use strict';

const { app, Menu } = require('electron');

function getTemplate() {
	let menuTemplate = [
		{
			label: 'Edit',
			submenu: [
				{
					role: 'undo',
				},
				{
					role: 'redo',
				},
				{
					type: 'separator',
				},
				{
					role: 'cut',
				},
				{
					role: 'copy',
				},
				{
					role: 'paste',
				},
				{
					role: 'pasteandmatchstyle',
				},
				{
					role: 'delete',
				},
				{
					role: 'selectall',
				},
			],
		},
		{
			label: 'View',
			submenu: [
				{
					role: 'reload',
				},
				{
					role: 'forcereload',
				},
				{
					role: 'toggledevtools',
				},
				{
					type: 'separator',
				},
				{
					role: 'resetzoom',
				},
				{
					role: 'zoomin',
				},
				{
					role: 'zoomout',
				},
				{
					type: 'separator',
				},
				{
					role: 'togglefullscreen',
				},
			],
		},
		{
			role: 'window',
			submenu: [
				{
					role: 'minimize',
				},
				{
					role: 'close',
				},
			],
		},
	];

	if (process.platform === 'darwin') {
		menuTemplate.unshift({
			label: app.getName(),
			submenu: [
				{
					role: 'about',
				},
				{
					type: 'separator',
				},
				{
					role: 'services',
					submenu: [],
				},
				{
					type: 'separator',
				},
				{
					role: 'hide',
				},
				{
					role: 'hideothers',
				},
				{
					role: 'unhide',
				},
				{
					type: 'separator',
				},
				{
					role: 'quit',
				},
			],
		});
	}

	return menuTemplate;
}

function menuSetup(menuTemplate = getTemplate()) {
	const menu = Menu.buildFromTemplate(menuTemplate);

	return () => {
		Menu.setApplicationMenu(menu);
	};
}

// Node Export
if (module) {
	module.exports = {
		menuSetup: menuSetup,
	};
}
