/**
 * Game data storage
 */
function GameData() {

	/**
 	 * Version storage
 	 * DO NOT USE .length (undefined) USE size() INSTEAD
 	 */
	this.versions = {};

	var length = 0;
	var observers = [];

	/**
 	 * GameData length
 	 * @returns {number} Length
 	 */
	this.size = function(){
		return length;
	}

	/**
 	 * GameData contains games
 	 * @returns {Boolean} true if GameData contains games
 	 */
	this.containGames = function() {
		return (length > 0);
	}

	/**
 	 * GameData contains specific game version
 	 * @param {string} version Version hash
 	 * @returns {Boolean} True if specific version is in GameData
 	 */
	this.hasGame = function(version) {
		if (length === 0)
			return false;

		if (!version)
			return false;

		if (!this.versions[version])
			return false;
		return true;
	};

	/**
 	 * GameData version list
 	 * @returns {array} Version list
 	 */
	this.getVersions = function(){
		return Object.keys(this.versions);
	}

	/**
 	 * Register observer
 	 * @param {function(game, property, value)} callback Function callback
 	 */
	this.registerObserver = function(callback, property) {
		observers.push({call: callback, property: property});
	}

	/**
 	 * Add data entry
 	 * @param {string} version Version hash
 	 * @param {string} property Game Property
 	 * @param value Game data to add
 	 * @returns {Boolean} True if added
 	 */
	this.addData = function(version, property, value) {
		if (!version || !property)
			return false;

		if (!this.versions[version]) {
			length += 1;
			this.versions[version] = {};
		}

		var game = this.versions[version];
		game[property] = value;

		_callObservers(game, property, value);
		return true;
	}

	/**
 	 * Add data entry
 	 * @param {string} version Version hash
 	 * @param {string} property Game Property (false for deleting the complete version)
 	 * @returns {Boolean} True if deleted
 	 */
	this.removeData = function(version, property) {
		if (!version)
			return false;

		if (!property) {
			length -= 1;
			delete this.versions[version];
		} else {
			delete this.versions[version][property];
			if (Object.keys(versions[version]).length == 0) {
				length -= 1;
				delete this.versions[version];
			}
		}

		_callObservers(this.versions[version], property, null);
		return true;
  };

	/**
 	 * Get a property
 	 * @param {string} version Version hash
 	 * @param {string} property Game Property
 	 * @returns Property value
 	 */
	this.getData = function(version, property) {
		return this.versions[version][property];
	};

	/**
 	 * Start the game
 	 * @param {string} version Version hash
 	 */
	this.start = function(version){

		exec('"'+ globals.gameData.versions[version].path.main + '../crosscode-beta.exe"'); //TODO: Make platform-independant
	};

	/**
 	 * Observers call
 	 * @param {Object} game Game entry
 	 * @param {string} property Changed property (false / null if complete game entry changed)
 	 * @param value New Value (false / null if deleted)
 	 */
	function _callObservers(game, property, value){
		for (var observer in observers) {
			var filter = observers[observer].property;
			if(!filter || !property || filter === property)
				observers[observer].call(game, property, value);

			if(filter.constructor === Array){
				for(var i in filter){
					if(filter[i] === property){
						observers[observer].call(game, property, value);
						break;
					}
				}
			}
		}
	}
}
