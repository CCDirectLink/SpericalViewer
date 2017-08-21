function Module(){
	var MODULE_EXTENSION = ".ccsvm";
	var baseDirectory;
	var instance = this;
	var onLoadeds = [];
	
	//Constructor
	function initialize(){
		
	}
	
	//Loads scripts. Takes an Array of scripts
	this.loadScripts = function(scripts, cb){
		var cnt = scripts.length;
		var loaded = 0;
		for(var i in scripts){
			this.loadScript(scripts[i], function(){
				loaded++;
				if(loaded >= cnt && cb){
					cb();
				}
			});
		}
	}
	
	//Loads a script
	this.loadScript = function(script, cb){
		$.getScript(script).done(cb);
	}
	
	this.loadModules = function(modules, cb){
		var cnt = modules.length;
		var loaded = 0;
		for(var i in modules){
			this.loadModule(modules[i], function(){
				loaded++;
				if(loaded >= cnt && cb){
					cb();
				}
			});
		}
	}
	
	this.loadModule = function(file, cb){
		if(_isZipped(file)){
			_unzip(file);
			file = _removeExtension(file) + "/package.json";
		}
		
		_getData(file, function(data){
			instance.loadScript(path.dirname(file) + "/" + data.main, cb);
		})
	}

	this.findModules = function(directory){
		var files = fs.readdirSync(directory);
		var result = [];
		for(var i in files){
			var file = fs.realpathSync(directory + "/" + files[i]);
			if(file.endsWith(MODULE_EXTENSION)){
				result.push(file);
			} else if (fs.lstatSync(file).isDirectory() && fs.existsSync(file + "/package.json")){
				result.push(file + "/package.json");
			}
		}
		return result;
	}
	
	this.registerOnLoaded = function(onLoaded){
		onLoadeds.push(onLoaded)
	}
	this.onLoaded = function(){
		for(var i in onLoadeds){
			onLoadeds[i].apply(this, arguments);
		}
	}
	
	function _isZipped(path){
		return path.endsWith(MODULE_EXTENSION);
	}
	
	function _unzip(path){
		fs.createReadStream(path).pipe(unzip.Extract({ path: _removeExtension(path) }));
	}
	
	function _removeExtension(path){
		return path.substr(0, path.length - MODULE_EXTENSION.length);
	}
	
	function _getData(path, cb){
		$.ajax({
			url: path,
			success: cb,
			dataType: "json",
			context: this
		});
	}
	
	initialize();
}