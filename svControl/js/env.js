const envName = "SpericalViewer";
const envVersion = "0.2.0";
const envBuild = 1;

if (process.platform == "darwin")
{
	var envStorageMain = process.env.HOME + "/Library";
	var envSeperator = "/";
}
else if (process.platform == "win32")
{
	var envStorageMain = process.env.APPDATA;
	var envSeperator = "\\";
}
else
{
	var envStorageMain = process.env.HOME;
	var envSeperator = "/";
}

const envPath = {
	seperator: envSeperator,
	storage: envStorageMain + envSeperator + envName
};