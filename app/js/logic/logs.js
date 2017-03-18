"use strict";

const varTypes = require('./varTypes');

// log level
module.exports.log_level = {
  note: 0,
  info: 0,
  message: 1,
  warn: 2,
  err: 3
}

// log console wrapper
module.exports.log_consoleWrapper = function log_consoleWrapper(logData)
{
  if (varTypes.isType(logData, "string"))
  {
    console.log(logData);
    return;
  }

  if (!varTypes.exist(logData.data))
  {
    console.log(logData);
    return;
  }

  if ((varTypes.isType(logData, "object")) &&
      (varTypes.isType(logData.level, "number")))
  {
    switch (logData.level)
    {
      case module.exports.log_level.note:
      case module.exports.log_level.info:
        console.log(logData.data);
        break;

      case module.exports.log_level.message:
        console.log(logData.data);
        break;

      case module.exports.log_level.warn:
        console.warn(logData.data);
        break;

      case module.exports.log_level.err:
        console.err(logData.data);
        break;
    }
    return;
  }

  console.log(logData.data);

}