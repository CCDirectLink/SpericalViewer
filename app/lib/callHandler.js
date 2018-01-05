"use strict";

function CallbackEntry(cb) {
	var fkt = cb;

	this.call = function(...arg) {
		fkt(...arg);
	}
}

function HandlerId(id) {
	this.id = id;
}

function HandlerIdList() {
	var instance = this;
	this.list = [];

	this.add = function(id) {
		if (id.constructor === HandlerId) {
			instance.list.push(id);
		}
		else if (typeof id === 'integer') {
			instance.list.push(new HandlerId(id));
		}
		else if (typeof id === 'object') {
			for (entry in id) {
				if (typeof id[entry] === 'integer') {
					instance.list.push(new HandlerId(id[entry]));
				}
			}
		}
	}

	this.clear = function() {
		instance.list = [];
	}
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
		for (id in list) {
			list[id].call(...arg);
		}
	}

	this.add = function(cb) {
		var index = 0;
		if (typeof cb == "function") {
			index = getIndexAndIncrese();
			list[index] = new CallbackEntry(cb);
			++_length;
			return new HandlerId(index);
		}
		else if (cb.constructor === CallbackEntry) {
			index = getIndexAndIncrese();
			list[index] = cb;
			++_length;
			return new HandlerId(index);
		}
		else if (Array.isArray(cb)) {
			var result = new HandlerIdList();
			for (id in cb) {
				result.list[id] = new HandlerId(instance.add(cb[id]));
			}
			return result;
		}
		else {
			throw "type invalid";
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

	this.clear = function() {
		list = [];
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
				if ((typeof typeList[type] === "string") &&
					(typeof callbacks[key] !== "undefined")) {
					var key = typeList[type]];

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

	this.remove = function()

	this.call = function(typeList, ...arg) {

		if (typeof typeList === "string") {
			callbacks[typeList].call(...arg);
		}
		else if (typeof typeList === "object") {
			for (type in typeList) {
				var key = "";
				if (typeof typeList[type] === "string") {
					key = typeList[type]];
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
	CallbackHandler: CallbackHandler
}