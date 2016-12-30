// global sperical Object
var spo = Object();


// temp (removed) -----------
var _envTempVersionVal = {major: 0, minor: 2, bugfix: 0, build: 1, note: ""};
var _envTempVersion = Object();
var _envTemp = Object();


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

Object.defineProperty( _envTempVersion, "bugfix", {
  value: _envTempVersionVal.bugfix,
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

Object.defineProperty( _envTempVersion, "note", {
  value: _envTempVersionVal.note,
  writable: false,
  enumerable: true,
  configurable: true
});

Object.defineProperty( _envTempVersion, "string", {
  value: _envTempVersionVal.major + "." + _envTempVersionVal.minor + "." + _envTempVersionVal.bugfix + _envTempVersionVal.note,
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

delete _envTemp;
delete _envTempVersion;

// ----------------

console.log(spo);