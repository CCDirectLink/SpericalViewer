"use strict";

// dependency
const fs = require('fs');
const varTypes = require('./varTypes');
const logdata = require('./logs');

module.exports.load_environment = function load_environment(log, app)
{
  if (!varTypes.exist(log))
  {
    log = logdata.log_consoleWrapper;
  }

  log({data: "- init -", level: logdata.log_level.note});
  var data = fs.readFileSync(`${__dirname}/../../version/versions.json`);

  var versionData = JSON.parse(data);

  var _versionData_verArray = versionData.ver.split(".");
  var _verNoteRegex = /\D/g;

  var _resultVersion = Object();
  var _resultBuildDate = Object();
  var _resultBuild = Object();
  var _result = Object();

  varTypes.readOnlyProperty(_resultVersion, "major", Number(_versionData_verArray[0].replace('v', '')));
  varTypes.readOnlyProperty(_resultVersion, "minor", Number(_versionData_verArray[1]));
  varTypes.readOnlyProperty(_resultVersion, "build", Number(_versionData_verArray[2].replace(_verNoteRegex, '')));

  varTypes.readOnlyProperty(_resultVersion, "rev", versionData.rev);

  varTypes.readOnlyProperty(_resultVersion, "note", _verNoteRegex.exec(_versionData_verArray[2]));

  var _noteData = "";
  if (_resultVersion.note != null)
  {
    _noteData = _resultVersion.note;
  }

  varTypes.readOnlyProperty(_resultVersion, "string",
    _resultVersion.major + "." +
    _resultVersion.minor + "." +
    _resultVersion.build + _noteData);

  varTypes.readOnlyProperty(_resultBuildDate, "day", versionData.date.day);
  varTypes.readOnlyProperty(_resultBuildDate, "month", versionData.date.month);
  varTypes.readOnlyProperty(_resultBuildDate, "year", versionData.date.year);

  varTypes.readOnlyProperty(_resultBuild, "sorthash", versionData.hash);
  varTypes.readOnlyProperty(_resultBuild, "longhash", versionData.hashlong);
  varTypes.readOnlyProperty(_resultBuild, "date", _resultBuildDate);

  varTypes.readOnlyProperty(_result, "name", "SpericalViewer");
  varTypes.readOnlyProperty(_result, "version", _resultVersion);
  varTypes.readOnlyProperty(_result, "build", _resultBuild);

  _result.path = Object();
  _result.path.save = Object();

  _result.path.save.file = "cc.save";
  _result.path.save.backupFile = "cc.save.backup";

  _result.path.cache = app.getPath('userData');

  if (process.platform == "darwin")
  {
    _result.path.storage = process.env.HOME + "/Library/Application Support/" + _result.name + "/GameStorage";
    _result.path.save.folder = process.env.HOME + "/Library/Application Support/CrossCode/" + "Default";
    _result.path.seperator = "/";
  }
  else if (process.platform == "win32")
  {
    _result.path.storage = process.env.LOCALAPPDATA + "\\" + _result.name + "\\GameStorage";
    _result.path.save.folder = process.env.LOCALAPPDATA + "\\CrossCode";
    _result.path.seperator = "\\";
  }
  else if (process.platform == "linux")
  {
    _result.path.storage = process.env.HOME + "/.config/" + _result.name + "/GameStorage";
    _result.path.save.folder = process.env.HOME + "/.config/CrossCode/" + "Default";
    _result.path.seperator = "/";
  }

  return _result;
}