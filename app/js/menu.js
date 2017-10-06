function Menu(element, entryContainer, callback) {
	var currentId = -1;
	var entrys = [];
	var position = [];
  
	function initialize(){
		if(!element){
			element = null;
		}
		
		if(!entryContainer){
			entryContainer = null;
		}
		
		this.menuElement = element;
		this.entryElement = entryContainer;
	}
	
	// pos: <0 or >length = last
	this.add = function(name, func, siteUrl, enableState, pos = null) {
		var id = entrys.length;
		entrys.push({function: func, name: name, site: siteUrl, enabled: enableState, id: id});
		if ((pos === null) || (typeof(pos) !== "number")){
			position.push(entrys[id]);
			entrys[id]["pos"] = id;
		} else {
			if ((pos >= entrys.length) ||
				(pos < 0)) {
				pos = entrys.length - 1;
			}
			position.splice(pos, 0, entrys[id]);
			entrys[id]["pos"] = pos;
		}
		return id;
	}
	
	this.edit = function (id, name, func, siteUrl, enableState) {
		if (typeof(id) === "number") {
			entrys[id] = {function: func, name: name, site: siteUrl, enabled: enableState, pos: entrys[id]["pos"], id: id};
			return true;
		} else {
			this.update(id);
			return false;
		}
	}

	// pos: <0 or >length = last
	this.moveTo = function (id, pos) {
		if ((typeof(id) === "number") &&
			(typeof(pos) === "number")) {
			if ((pos >= entrys.length) ||
				(pos < 0)) {
				pos = entrys.length - 1;
			}
			position.splice(pos, 0, position.splice(entrys[id].pos, 1)[0]);
			this.updateAll();
			return true;
		} else {
			return false;
		}
	}
	
	this.remove = function(id) {
		if (typeof(id) === "number") {
			position.splice(entrys[id].pos, 1);
			entrys.splice(id, 1);
			this.updateAll();
			return true;
		} else {
			return false;
		}
	}
	
	this.clear = function() {
		currentId = -1;
		entrys = [];
	}
	
	this.getSelect = function() {
		return currentId;
	}
	
	this.select = function(id) {
		if ((currentId != id) && (typeof(id) === "number") && (typeof(entrys[id]) === "object")) {
			if (!isEnabled(entrys[id])) {
				return false;
			}

			if (entrys[id].site != null) {
				$(this.entryElement).attr('id', entrys[id].name);
				$(this.entryElement).empty();
				$(this.entryElement).load(entrys[id].site);
			}

			currentId = id;

			if ($(".menuentrySelected").length) {
				$(".menuentrySelected")[0].className = "menuentry";
			}

			if ($(".menuentry a#" + currentId).length) {
				$(".menuentry a#" + currentId)[0].parentNode.className = "menuentrySelected";
			}

			if (entrys[id].function != null) {
				return entrys[id].function(id);
			} else {
				return true;
			}
		}
		return false;
	}
	
	this.updateAll = function() {
		$(this.menuElement).empty();
		for (var entry in position) {
			var className = "menuentry";
			if (position[entry].id == currentId) {
				className = "menuentrySelected";
			}
			if (!isEnabled(position[entry])) {
				className = "menuentryDisabled";
			}
			$(this.menuElement).append("<li class=\"" + className + "\"><a class=\"menuelement\" id=\"" + position[entry].id + "\" onclick=\"globals.menu.select(" + position[entry].id + ")\">" + position[entry].name + "</a></li>")
		}
	}
	
	this.update = function(id) {
		if ((typeof(id) == "number") && ($( ".menuentry a#" + currentId ).length) && (entrys.length > id)) {
			var entryName = entrys[id].name;
			if (entrys[id].name == null) {
				entryName = "Entry(" + id + ")";
			}
			if (!isEnabled(entrys[entry])) {
				$(".menuentry a#" + currentId)[0].parentNode.className = "menuentryDisabled";
			}
			else {
				$(".menuentry a#" + currentId)[0].parentNode.className = "menuentry";
			}
			$(".menuentry a#" + currentId)[0].text = entryName;
			return true;
		}
		return false;
	}
	
	function isEnabled(entry){
		if(entry.enabled.constructor === Boolean){
			return entry;
		}
		
		entry.enabled();
	}
	
	initialize.call(this);
} 