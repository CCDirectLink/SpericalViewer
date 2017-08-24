function GameData() {
	this.versions = {};
	var observers = [];

	this.hasGame = function(version) {
		if (this.versions.length == 0) 
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
			return null;

		if (!this.versions[version]) {
			this.versions[version] = {};
		}

		var game = this.versions[version];
		game[property] = value;

		_callObservers(game, property, value);
	}

	this.removeData = function(version, property) {
		if (!version) 
			return false;
		
		if (!property) {
			delete this.versions[version];
		} else {
			delete this.versions[version][property];
			if (Object.keys(versions[version]).length == 0) {
				delete this.versions[version];
			}
		}

		_callObservers(this.versions[version], property, null);
		return true;
    }
	
	this.getData = function(version, property) {
		return this.versions[version][property];
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