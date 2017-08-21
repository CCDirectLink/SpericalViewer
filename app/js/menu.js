function Menu(element, entryContainer, callback) {
	var currentId = -1;
	var entrys = [];
  
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
	
	this.add = function(name, func, siteUrl, enableState) {
		entrys[entrys.length] = {function: func, name: name, site: siteUrl, enabled: enableState};
	}
	
	this.edit = function (id, name, func, siteUrl, enableState) {
		if (typeof(id) === "number") {
			entrys[id] = {function: func, name: name, site: siteUrl, enabled: enableState};
			return true;
		} else {
			this.update(id);
			return false;
		}
	}
	
	this.remove = function(id) {
		if (typeof(id) === "number") {
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
			if (!entrys[id].enabled) {
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
		for (var entry in entrys) {
			var className = "menuentry";
			if (entry == currentId) {
				className = "menuentrySelected";
			}
			if (!entrys[entry].enabled) {
				className = "menuentryDisabled";
			}
			$(this.menuElement).append("<li class=\"" + className + "\"><a class=\"menuelement\" id=\"" + entry + "\" onclick=\"globals.menu.select(" + entry + ")\">" + entrys[entry].name + "</a></li>")
		}
	}
	
	this.update = function(id) {
		if ((typeof(id) == "number") && ($( ".menuentry a#" + currentId ).length) && (entrys.length > id)) {
			var entryName = entrys[id].name;
			if (entrys[id].name == null) {
				entryName = "Entry(" + id + ")";
			}
			if (!entrys[entry].enabled) {
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
	
	initialize.call(this);
} 