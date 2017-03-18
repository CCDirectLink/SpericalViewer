"use strict";

// read only object
module.exports.readOnlyProperty = function readOnlyProperty(object, name, data)
{
  return Object.defineProperty( object, name, {
    value: data,
    writable: false,
    enumerable: true,
    configurable: true
  });
}



// exist (defined and not null)
module.exports.exist = function varTypesExist(param)
{
	var resultCheck = ((typeof param === 'undefined') || (param === null));
	if (resultCheck)
	{
		return false;
	}
	return true;
}

// defined only
module.exports.defined = function varTypesDefined(param)
{
	var resultCheck = (typeof param === 'undefined');
	if (resultCheck)
	{
		return false;
	}
	return true;
}

// require type (defined and not null)
// error return if not valid
module.exports.require = function varTypesRequire(param)
{
	var resultCheck = ((typeof param === 'undefined') || (param === null));
	if (resultCheck)
	{
		return new Error("Var is required");
	}
	return param;
}

// defined only
// error return if undefined
module.exports.definedRequire = function varTypesDefinedRequire(param)
{
	var resultCheck = (typeof param === 'undefined');
	if (resultCheck)
	{
		return new Error("Var is undefined");
	}
	return param;
}

// check if param is type
module.exports.isType = function varTypesIsType(param, type)
{
	var result;
	var resultError;
	var resultCheck;

	var checkType = null;
	var paramType = null;

	result = module.exports.require(type);
	resultError = result instanceof Error;
	if (resultError) return new Error("Type is required");

	// Check if type is string
	// -------------------------

	// Type correction require
	resultCheck = ((typeof type === 'object') && (type instanceof String));
	if (resultCheck)
	{
		checkType = "" + type;
	}

	resultCheck = (typeof type === 'string');
	if (resultCheck)
	{
		checkType = type;
	}

	resultCheck = (checkType === null);
	if (resultCheck) return new Error("Type is invalid");

	// Check if type is valid string
	// -------------------------

	switch (checkType)
	{
		case "number": // also include Number(..)
		case "string": // also include String(..)
		case "boolean": // also include Boolean(..)
		case "symbol": // also include Symbol(..)
		case "object": // doesn't include null, Array(..), Number(..), String(..), Boolean(..) or Symbol(..)
		case "array":	// also include Array(..)
		case "function":
		case "null":
			result = module.exports.definedRequire(param);
			resultError = result instanceof Error;
			if (resultError) return new Error("Var is undefined");
			break;

		case "undefined": // safe undefined check
			result = module.exports.defined(param)
			if (result) return false;
			return true;

		default: // unknown type
			return new Error("Type is invalid");
	}

	// Check if param is type
	// -------------------------

	// Type correction require
	if (typeof param === 'object')
	{
		paramType = "object";
		if (param === null) paramType = "null";
		if (param instanceof Number) paramType = "number";
		if (param instanceof String) paramType = "string";
		if (param instanceof Boolean) paramType = "boolean";
		if (param instanceof Symbol) paramType = "symbol";
		if (param instanceof Array) paramType = "array";
	}
	else
	{
		paramType = typeof param;
	}

	if (paramType !== checkType)
	{
		return false;
	}

	return true;
}

// require type
// return error if wrong type
module.exports.requireType = function varTypesRequireType(param, type)
{
	var resultCheck = (!module.exports.isType(param, type));
	if (resultCheck) return new Error("Var has wrong type");
}

// check if param is in type list
module.exports.isListedType = function varTypesIsListedType(param, type)
{
	var resultCheck = (!module.exports.isType(type, "array"));
	if (resultCheck) return new Error("Type is invalid");

	for (var index in type)
	{
		if (module.exports.isType(param, type[index]))
		{
			return true;
		}
	}
	return false;
}

// require param type is in type list
// return error if wrong type
module.exports.requireListedType = function varTypesRequireListedType(param, type)
{
	var resultCheck = (!module.exports.isListedType(param, type));
	if (resultCheck) return new Error("Var has wrong type");
}
