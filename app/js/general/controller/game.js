function gameDataController()
{

  this.gameArray = Object();
  this.idArray = Array();
  var callbackArray = Array();

  this.hasGame = function(id) {
    if (this.idArray.length == 0) return false;
    if ((typeof id == "undefined") || (id == null)) return true;
    if ((typeof this.gameArray[id] == "undefined") || (this.gameArray[id] == null)) return false;
    return true;
  }

  this.registerCallback = function(callback, filter) {
    callbackArray.push({call: callback, filter: filter});
  }

  this.addData = function(entry, identifier, data) {

    if ((typeof entry == "undefined") || (entry == null)) return null;
    if ((typeof this.gameArray[entry] != "object") || (this.gameArray[entry] == null))
    {
      this.gameArray[entry] = Object();
      this.idArray.push(entry);
    }
    this.gameArray[entry][identifier] = data;

    for (var callbackEntry in callbackArray)
    {

      var identifierMatch = 0;

      if ((typeof callbackArray[callbackEntry]['filter'] == "undefined") || (callbackArray[callbackEntry]['filter'] == null) || (typeof callbackArray[callbackEntry]['filter']['entry'] == "undefined") || (callbackArray[callbackEntry]['filter']['entry'] == null) || (callbackArray[callbackEntry]['filter']['entry'] == entry))
      {
        if ((typeof callbackArray[callbackEntry]['filter'] != "undefined") && (callbackArray[callbackEntry]['filter'] != null) && (typeof callbackArray[callbackEntry]['filter']['identifier'] != "undefined") && (Array.isArray(callbackArray[callbackEntry]['filter']['identifier'])))
        {
          for (var identifierIndex in callbackArray[callbackEntry]['filter']['identifier'])
          {
            if (typeof callbackArray[callbackEntry]['filter']['identifier'][identifierIndex].param == "undefined") continue;
            if (typeof this.gameArray[entry][callbackArray[callbackEntry]['filter']['identifier'][identifierIndex].param] == "undefined") return entry;
            if (callbackArray[callbackEntry]['filter']['identifier'][identifierIndex].param == identifier) identifierMatch++;
          }
        }
        else
        {
          identifierMatch = 1;
        }
        
        // trigger call
        if (identifierMatch > 0)
        {
          callbackArray[callbackEntry].call(this.gameArray[entry], entry, identifier, this);
        }
        
      }

    }

    return entry;
  }

  this.removeData = function(entry, identifier) {

    var removeInIdTable = false;


    if ((typeof entry == "undefined") || (entry == null)) return false;
    if ((typeof identifier == "undefined") || (identifier == null))
    {
      delete this.gameArray[entry];
      removeInIdTable = true;
    }
    else
    {
      delete this.gameArray[entry][identifier];
      if (this.gameArray[entry].length == 0)
      {
        delete this.gameArray[entry];
        removeInIdTable = true;
      }
    }

    if ((removeInIdTable) && (this.idArray.length > 0))
    {
      for (var idIndex in this.idArray)
      {
        if (this.idArray[idIndex] == entry)
        {
          this.idArray.splice(idIndex, 1);
          break;
        }
      }
    }

    for (var callbackEntry in callbackArray)
    {

      var identifierMatch = 0;

      if ((typeof callbackArray[callbackEntry]['filter'] == "undefined") || (callbackArray[callbackEntry]['filter'] == null) || (typeof callbackArray[callbackEntry]['filter']['entry'] == "undefined") || (callbackArray[callbackEntry]['filter']['entry'] == null) || (callbackArray[callbackEntry]['filter']['entry'] == entry))
      {
        if ((typeof callbackArray[callbackEntry]['filter'] != "undefined") && (callbackArray[callbackEntry]['filter'] != null) && (typeof callbackArray[callbackEntry]['filter']['identifier'] != "undefined") && (Array.isArray(callbackArray[callbackEntry]['filter']['identifier'])))
        {
          if ((typeof identifier != "undefined") && (identifier != null))
          {
            for (var identifierIndex in callbackArray[callbackEntry]['filter']['identifier'])
            {
              if (typeof callbackArray[callbackEntry]['filter']['identifier'][identifierIndex].param == "undefined") continue;
              if (callbackArray[callbackEntry]['filter']['identifier'][identifierIndex].param == identifier) identifierMatch++;
            }
          }
          else
          {
            identifierMatch = 1;
          }
        }
        else
        {
          identifierMatch = 1;
        }
        
        // trigger call
        if (identifierMatch > 0)
        {
          if (removeInIdTable)
          {
            callbackArray[callbackEntry].call(null, entry, null, this);
          }
          else
          {
            callbackArray[callbackEntry].call(null, entry, identifier, this);
          }
        }
        
      }

    }

    return true;

  }

  this.getData = function(entry, identifier) {
    return this.gameArray[entry][identifier];
  }

}