const fs = require('fs');
const { exec } = require('child_process');

var builderPath = "";

if (process.platform == "darwin") {
	console.log("Platform: darwin");
	builderPath = `${__dirname}/node_modules/.bin/electron-builder`;
}
else if (process.platform == "win32") {
	console.log("Platform: win");
	builderPath = `${__dirname}/node_modules/.bin/electron-builder.cmd`;
}
else if (process.platform == "linux") {
	console.log("Platform: linux");
	builderPath = `${__dirname}/node_modules/.bin/electron-builder`;
}
else {
	alert("Unknown System Environment\r\nPostinstall abort");
}

const builder = exec(builderPath + " install-app-deps", {"cwd": `${__dirname}`});

builder.stdout.on('data', (data) => {
  	console.log(`${data}`);
});

const genVersion = exec(`node genVersion.js`, {"cwd": `${__dirname}`});

genVersion.stdout.on('data', (data) => {
  	console.log(`${data}`);
});