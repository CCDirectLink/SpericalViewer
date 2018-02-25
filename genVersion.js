/* eslint-env node */

const https = require('https');
const fs = require('fs');

var branch;

try {
	branch = fs
		.readFileSync('./.git/HEAD', 'UTF-8')
		.substr(16)
		.replace('\r', '')
		.replace('\n', '');
} catch (e) {
	console.warn('Not a git repo! Assuming default branch');
	branch = '';
}

// { name: 'v0.3.0',
// commit: {
// sha: '3c839d40a6b0268ff41e26682d078ef70e76b8af' } }
var tag;

// 2011-04-14T16:00:49Z
var commit;

var commitHash = 0;
var commitCount = 0;

getTag();
getCommit();

function onFinish() {
	if (tag !== undefined && commitCount > 0) {
		saveVersion();
	}
}

function saveVersion() {
	var dir = 'app/version/';
	var file = 'versions.json';

	var version = {
		rev: commitCount,
		date: {
			day: commit.getUTCDay(),
			month: commit.getUTCMonth(),
			year: commit.getUTCFullYear(),
		},
		hash: commitHash.substr(0, 8),
		hashlong: commitHash,
		ver: tag.name,
	};

	console.log(version);

	try {
		if (!fs.statSync(dir).isDirectory()) {
			fs.mkdirSync(dir);
		}
	} catch (e) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(dir + file, JSON.stringify(version));
}

function getTag() {
	const optionsTags = {
		hostname: 'api.github.com',
		port: 443,
		path: '/repos/CCDirectLink/SpericalViewer/tags',
		method: 'GET',
		headers: {
			'User-Agent': 'SpericalViewer-genVersion',
		},
	};

	https
		.get(optionsTags, res => {
			var data = '';

			res.on('data', function(part) {
				data += part;
			});

			res.on('end', function() {
				tag = JSON.parse(data)[0];
				onFinish();
			});
		})
		.on('error', e => {
			console.error(e);
		});
}

function getCommit(page) {
	page = page || 1;

	var optionsCommits = {
		hostname: 'api.github.com',
		port: 443,
		path:
      '/repos/CCDirectLink/SpericalViewer/commits?sha=' +
      branch +
      '&page=' +
      page,
		method: 'GET',
		headers: {
			'User-Agent': 'SpericalViewer-genVersion',
		},
	};

	https
		.get(optionsCommits, res => {
			var data = '';

			res.on('data', function(part) {
				data += part;
			});

			res.on('end', function() {
				var json = JSON.parse(data);

				if (json.length === 0) {
					onFinish();
				} else {
					commitCount += json.length;
					if (!commit) {
						commit = new Date(json[0].commit.committer.date);
						commitHash = json[0].sha;
					}

					getCommit(page + 1);
				}
			});
		})
		.on('error', e => {
			console.error(e);
		});
}
