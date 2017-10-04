"use strict";

const {app, BrowserWindow} = require('electron');

const crypto = require('crypto');
const fs = require("fs");
const stream = require('stream');
const util = require('util');
const unzip = require('unzip2');
const lwip = require('@mcph/lwip');
const isDevEnv = require('electron-is-dev');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
	icon: __dirname + '/assets/ccdirectlink.png'
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools (if not packed).
  if (isDevEnv) {
    win.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})
