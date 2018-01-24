"use strict";

function CallbackEntry(cb) {
	var fkt = function() {};

	this.call = function(...arg) {
		return fkt(...arg);
	}

	this.update = function(cb) {
		if (typeof cb !== 'function') {
			throw new TypeError('Param cb not a function');
		}

		fkt = cb;
	}

	this.clone = function() {
		return new CallbackEntry(fkt);
	}

	this.toString = function() {
		return "{}";
	}

	this.update(cb);
}

function CallbackList() {

	var instance = this;
	var list = {};

	var _length = 0;

	var lastIndex = 0;
	var missingIndex = [];

	function getIndexAndIncrese() {
		if (missingIndex.length > 0) {
			return missingIndex.shift();
		}
		const index = lastIndex;
		++lastIndex;
		return index;
	}

	this.length = function() {
		return _length;
	}

	this.last = function() {
		return lastIndex;
	}

	this.call = function(...arg) {
		var result = [];
		for (id in list) {
			result[id] = list[id].call(...arg);
		}
		return result;
	}

	this.add = function(cb) {
		var index = 0;
		if (cb.constructor === CallbackEntry) {
			index = getIndexAndIncrese();
			list[index] = cb;
			++_length;
			return index;
		}
		else if (Array.isArray(cb)) {
			var result = [];
			for (id in cb) {
				try {
					result[id] = new instance.add(cb[id]);
				}
				catch (err) {
					// ignore
				}
			}
			return result;
		}
		else {
			// can throw
			var cbEntry = new CallbackEntry(cb);

			index = getIndexAndIncrese();
			list[index] = cbEntry;
			++_length;
			return new index;
		}
	}

	this.remove = function(id) {
		if (typeof list[id] == "undefined") {
			return;
		}

		if ((id - 1) == lastIndex) {
			delete list[id];
			--lastIndex;
			--_length;
		}
		else {
			delete list[id];
			missingIndex.push(id);
			--_length;
		}
	}

	this.clone = function() {
	}

	this.clear = function() {
		list = [];
	}

	this.toString = function() {
		return "{\"length\":" + _length + ",\"last\":" + lastIndex + "}";
	}

}

function CallbackHandler() {

	var callbacks = {};

	this.defineTypes = function(typeList) {

		if (typeof typeList === "string")
		{
			callbacks[typeList] = new CallbackList();
		}
		else if (typeof typeList === "object")
		{
			for (type in typeList) {
				if (typeof typeList[type] === "string") {
					callbacks[list[type]] = new CallbackList();
				}
			}
		}
	}

	this.addCall = function(typeList, cb) {

		if (typeof typeList === "string") {
			if (typeof callbacks[typeList] === "undefined") {
				throw "type invalid";
			}
			return {typeList: callbacks[typeList].add(cb)};
		}
		else if (typeof typeList === "object") {
			var callIds = {};
			for (type in typeList) {
				if ((typeof type[typeList] === "string") &&
					(typeof callbacks[key] !== "undefined")) {
					var key = type[typeList];

					if (typeof callIds[key] === "undefined") {
						callIds[key] = [];
					}
					callIds[key].push(callbacks[key].add(cb));
				}
			}
			return callIds;
		}

	}

	this.add = function(cbObject) {
		//for (callback in callArray) {
		//	Object.assign(callbacks, cbObject);
		//}
	}

	this.remove = function() {
		
	}

	this.call = function(typeList, ...arg) {

		if (typeof typeList === "string") {
			callbacks[typeList].call(...arg);
		}
		else if (typeof typeList === "object") {
			for (type in typeList) {
				var key = "";
				if (typeof type[typeList] === "string") {
					key = type[typeList];
				}
				else {
					key = type;
				}
				if (typeof callbacks[key] !== "undefined") {
					callbacks[key].call(...arg);
				}
			}
		}

	}

}

module.exports = {
	CallbackEntry: CallbackEntry,
	CallbackList: CallbackList,
	CallbackHandler: CallbackHandler
}