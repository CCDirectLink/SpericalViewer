"use strict";

const {app, BrowserWindow} = require('electron');

// dependency
const crypto = require('crypto');
const fs = require("fs");
const stream = require('stream');
const util = require('util');
const unzip = require('unzip2');
const lwip = require('lwip');

// custom dependency
const varTypes = require('./js/logic/varTypes');

var sv = Object();

// window
let win;

// SpericalViewer module init
function createEnv () {
  
  sv.window = Object();

  sv.env = require('./js/logic/environment').load_environment(null, app);
  sv.settings = require('./js/logic/settings').load_settings(null, app);
  sv.module = require('./js/logic/module').load_module(null, app);

  sv.window.bg = '#3d4447';

  return;
  
};

createEnv();

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: sv.window.bg,
    titleBarStyle: 'hidden'
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  win.openDevTools();

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

module.exports = 
{
  crypto: crypto,
  fs: fs,
  stream: stream,
  util: util,
  unzip: unzip,
  lwip: lwip,
  varTypes: varTypes,
  sv: sv
}