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

	this.findModules = function(directories){
		var files = [];
		var result = [];

		if (typeof directories === 'string' || directories instanceof String) {
			try {
				files = fs.readdirSync(directories);
				for(var i in files){
					files[i] = directories + "/" + files[i];
				}
			} catch(err) {
				// no module folder - ignore files
			}
		} else {
			for(var i in directories){
				try {
					var _tempFiles = fs.readdirSync(directories[i]);
					for(var j in _tempFiles){
						_tempFiles[j] = directories[i] + "/" + _tempFiles[j];
					}
					files = files.concat(_tempFiles);
				} catch(err) {
					// no module folder - ignore files
				}
			}
		}
		
		for(var i in files){
			var file = fs.realpathSync(files[i]);
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