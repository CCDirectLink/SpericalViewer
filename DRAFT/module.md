# Module Structure #

There is no required structure besides a `info.json` in the main "directory".

Modules can be delivered as zip container with the extension `.ccsvm`

# info.json #

```json
{
	"module": "testmodule",
	"id": "testauthor.testmodule",
	"version": "0.0.5.0",
	"desc":
	{
		"en_US": "en desc",
		"de_DE": "de"
	},
	"lang": ["en_US"],
	"main": "data/main.js",
	"require": {
		"version": "1.0.0.0",
		"module": {
			"reqmodauthor1.mod1": "0.0.2.0",
			"reqmodauthor2.mod2": "*"
		}
	},
	"recommend": {
		"version": "1.1.0.0",
		"module": {
			"reqmodauthor1.mod1": "0.0.3.x",
			"reqmodauthor2.mod2": "^0.5.0.0"
		}
	},
	"author": [
		{
			"name": "user1",
			"work": "base code",
			"image": "data/author.png",
			"link": "https://example.org/",
			"note": "authorNote (optional)"
		},
		{
			"name": "user2"
		}
	],
	"auth": {}
}
```
