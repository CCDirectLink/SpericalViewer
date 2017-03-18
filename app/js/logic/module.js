module.exports.load_module = function load_module(log, app)
{

	module = Object();

	module = Object();
	module.general = Object();

	// share module space
	// (for module group or all)
	module.shared = Object();

	// general module data (for all modules)
	// (read only for modules)
	module.general.loadedModules = Array();
	module.general.language = null;
	module.general.moduleInterface = null;

	return module;

}