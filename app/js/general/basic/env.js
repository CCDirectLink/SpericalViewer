// global sperical Object
if ((typeof spo == "undefined") || (spo == null))
{
  alert("spo object missing");
}

// temp (removed) -----------
// read version data
var _envTempVersionJson = $.getJSON('version/versions.json').done(function() {

  var _envTempVersionVal = Object();
  var _envTempVersion = Object();

  var _envBuildDate = Object();
  var _envTempBuild = Object();

  var _envTemp = Object();
  var _envJsonData = _envTempVersionJson.responseJSON;

  var _verArray = _envJsonData.ver.split(".");
  var _verNoteRegex = /\D/g;

  if (typeof _verArray[0] != "undefined")
  {

    _envTempVersionVal.major = Number(_verArray[0].replace('v', ''));
    _envTempVersionVal.minor = Number(_verArray[1]);
    _envTempVersionVal.build = Number(_verArray[2].replace(_verNoteRegex, ''));

    var noteData = _verNoteRegex.exec(_verArray[2]);

    if (noteData != null)
    {
      _envTempVersionVal.note = noteData[1];
    }
    else
    {
      _envTempVersionVal.note = "";
    }

  }

  _envTempVersionVal.rev = _envJsonData.rev;

  // version --------
  Object.defineProperty( _envTempVersion, "major", {
    value: _envTempVersionVal.major,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempVersion, "minor", {
    value: _envTempVersionVal.minor,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempVersion, "build", {
    value: _envTempVersionVal.build,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempVersion, "rev", {
    value: _envTempVersionVal.rev,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempVersion, "note", {
    value: _envTempVersionVal.note,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempVersion, "string", {
    value: _envTempVersionVal.major + "." + _envTempVersionVal.minor + "." + _envTempVersionVal.build + _envTempVersionVal.note,
    writable: false,
    enumerable: true,
    configurable: true
  });

  // build date --------
  Object.defineProperty( _envBuildDate, "day", {
    value: _envJsonData.date.day,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envBuildDate, "month", {
    value: _envJsonData.date.month,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envBuildDate, "year", {
    value: _envJsonData.date.year,
    writable: false,
    enumerable: true,
    configurable: true
  });

  // build --------
  Object.defineProperty( _envTempBuild, "sorthash", {
    value: _envJsonData.hash,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempBuild, "longhash", {
    value: _envJsonData.hashlong,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTempBuild, "date", {
    value: _envBuildDate,
    writable: false,
    enumerable: true,
    configurable: true
  });

  // ----------------

  Object.defineProperty( _envTemp, "name", {
    value: "SpericalViewer",
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTemp, "version", {
    value: _envTempVersion,
    writable: false,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty( _envTemp, "build", {
    value: _envTempBuild,
    writable: false,
    enumerable: true,
    configurable: true
  });

  // ----------------

  _envTemp.path = Object();
  _envTemp.path.save = Object();

  _envTemp.path.save.file = "cc.save";
  _envTemp.path.save.backupFile = "cc.save.backup";

  if (process.platform == "darwin")
  {
  	_envTemp.path.storage = process.env.HOME + "/Library/" + _envTemp.name;
  	_envTemp.path.save.folder = process.env.HOME + "/Library/Application Support/CrossCode/" + "Default";
  	_envTemp.path.seperator = "/";
  }
  else if (process.platform == "win32")
  {
  	_envTemp.path.storage = process.env.APPDATA + "\\" + _envTemp.name;
  	_envTemp.path.save.folder = process.env.APPDATA + "\\CrossCode\\" + "Default";
  	_envTemp.path.seperator = "\\";
  }
  else if (process.platform == "linux")
  {
  	_envTemp.path.storage = process.env.HOME + "/" + _envTemp.name;
  	_envTemp.path.save.folder = process.env.HOME + "/CrossCode/" + "Default";
  	_envTemp.path.seperator = "/";
  }
  else
  {
  	alert("Unknown System Environment");
  	process.exit(0);
  }

  // ----------------

  spo.env = _envTemp;

  if (spo.initCallback == null)
  {
    alert("spo init callback missing");
    process.exit(0);
  }
  else
  {
    spo.initCallback(spo);
  }

  // ----------------

}).fail(function() {
  alert("versions dependent file missing");
  process.exit(0);
});

console.log(spo);