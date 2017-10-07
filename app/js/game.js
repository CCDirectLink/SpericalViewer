function GameData() {
	this.versions = {};

	var length = 0;
	var observers = [];

	this.size = function(){
		return length;
	}

	this.containGames = function() {
		return (length > 0);
	}

	this.hasGame = function(version) {
		if (length == 0) 
			return false;

		if (!version)
			return false;

		if (!this.versions[version])
			return false;
		return true;
	}
	
	this.getVersions = function(){
		return Object.keys(this.versions);
	}

	this.registerObserver = function(callback, property) {
		observers.push({call: callback, property: property});
	}

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
    }
	
	this.getData = function(version, property) {
		return this.versions[version][property];
	}
	
	this.start = function(version){
		exec(globals.gameData.versions[version].path.main + "../crosscode-beta.exe"); //TODO: Make platform-independant
	}
	
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