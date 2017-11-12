"use strict";

const path = require('path');
const crypto = require('crypto');
const fs = require("fs");
const stream = require('stream');
const util = require('util');
const unzip = require('unzip2');
const lwip = require('@mcph/lwip');
const isDevEnv = require('electron-is-dev');

// setup userData
function _checkAbsolute (path) {

  return (
    ((process.platform == "win32") &&
    ((path.substr(1, 2) === ":/") || (path.substr(1, 2) === ":\\") ||
      (path.substr(0, 1) === "%") || (path.substr(0, 1) === "\\") || (path.substr(0, 1) === "/"))
    ) || (((process.platform == "darwin") || (process.platform == "linux")) &&
    ((path.substr(0, 1) === "/") || (path.substr(0, 1) === "\\") || (path.substr(0, 1) === "~"))));

}

function _setSettingsDir (entry, local, defaultPath) {

  try {
    var jsonData = JSON.parse(fs.readFileSync(path.join(local, 'settings.json')));
  } catch (err) {
    return defaultPath;
  }

  if ((jsonData[process.platform]) &&
      (jsonData[process.platform][entry]) &&
      (typeof jsonData[process.platform][entry] === "string")) {

    if (_checkAbsolute(jsonData[process.platform][entry])) {
      return jsonData[process.platform][entry];
    }
    else {
      return path.join(local, jsonData[process.platform][entry]);
    }

  }
  else {
    return defaultPath;
  }

}

// globals - pre set
global.toolname = "SpericalViewer";

global.ccSave = "cc.save";
global.ccSaveBackup = "cc.save.backup";

function userPreSetup () {

  const STORAGE_FOLDER = "SpericalStorage";
  const DATA_FOLDER = "SpericalData";

  const CACHE_FOLDER = "cache";
  const MODULES_FOLDER = "modules";

  if (isDevEnv) {
    global.appDir = fs.realpathSync(path.join(__dirname, ".."));
  }
  else
  {
    global.appDir = fs.realpathSync(__dirname);
  }

  if ((global.appDir.length > 32) &&
      (global.appDir.substr(global.appDir.length - 32, global.appDir.length) == (path.join(".app", "Contents", "Resources", "app.asar"))))
  {
    global.appDir = global.appDir.substr(0, global.appDir.length - 32);
    global.appDir = global.appDir.substr(0, global.appDir.lastIndexOf(path.sep));
  }

  if (process.platform == "win32") {
    global.mainDir = global.appDir;

    global.storageDir = _setSettingsDir("userStorage", global.mainDir, path.join(global.mainDir, STORAGE_FOLDER));
    global.dataDir = _setSettingsDir("userData", global.mainDir, path.join(global.mainDir, DATA_FOLDER));

    global.cacheDir = _setSettingsDir("cache", global.dataDir, path.join(global.dataDir, CACHE_FOLDER));
    global.modulesUserDir = _setSettingsDir("modules", global.dataDir, path.join(global.dataDir, MODULES_FOLDER));

    global.saveFolder = path.join(process.env.LOCALAPPDATA, "CrossCode");
  }
  else if (process.platform == "darwin") {
    global.mainDir = path.join(process.env.HOME, "Library", "Application Support", global.toolname);

    global.storageDir = _setSettingsDir("userStorage", global.mainDir, path.join(global.mainDir, STORAGE_FOLDER));
    global.dataDir = _setSettingsDir("userData", global.mainDir, path.join(global.mainDir, DATA_FOLDER));

    global.cacheDir = _setSettingsDir("cache", global.dataDir, path.join(global.dataDir, CACHE_FOLDER));
    global.modulesUserDir = _setSettingsDir("modules", global.dataDir, path.join(global.dataDir, MODULES_FOLDER));

    global.saveFolder = path.join(process.env.HOME, "Library", "Application Support", "CrossCode", "Default");
  }
  else if (process.platform == "linux") {
    global.mainDir = path.join(process.env.HOME, ".config", global.toolname);

    global.storageDir = _setSettingsDir("userStorage", global.mainDir, path.join(global.mainDir, STORAGE_FOLDER));
    global.dataDir = _setSettingsDir("userData", global.mainDir, path.join(global.mainDir, DATA_FOLDER));

    global.cacheDir = _setSettingsDir("cache", global.dataDir, path.join(global.dataDir, CACHE_FOLDER));
    global.modulesUserDir = _setSettingsDir("modules", global.dataDir, path.join(global.dataDir, MODULES_FOLDER));

    global.saveFolder = path.join(process.env.HOME, ".config", "CrossCode", "Default");
  }
  else {
    alert("Unsupported System Environment");
    return;
  }

  global.modulesAppDir = path.join(global.appDir, MODULES_FOLDER);

}

userPreSetup();

let win;

const {app, BrowserWindow} = require('electron');
app.setPath('userData', global.cacheDir);

// path ---
console.log("appDir: " + global.appDir);
console.log("mainDir: " + global.mainDir);

console.log("storageDir: " + global.storageDir);
console.log("cacheDir: " + global.cacheDir);

console.log("modulesAppDir: " + global.modulesAppDir);
console.log("modulesUserDir: " + global.modulesUserDir);

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
