'use strict';

// const fs = require('fs');
const { exec } = require('child_process');

const genVersion = exec('node genVersion.js', {cwd: `${__dirname}`});

genVersion.stdout.on('data', (data) => {
	console.log(`${data}`);
});
