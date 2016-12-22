
var globalMenu = new menu();
var gameData = new gameDataController();
var moduleMemory = new moduleMemorySet();
var imageData = new imageLink();

$(function(){

  console.log("basic logic - " + envVersion);

  globalMenu.menuElement = $( "#menulist" )[0];
  globalMenu.entryElement = $( ".entrycontainer" )[0];

});


function moduleMemorySet()
{
  this.module = Object();
}


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


function menu(element, entryContainer, callback)
{
  var currentId = -1;
  var registeredEntrys = Array();

  if (typeof (element) == "undefined")
  {
    element = null;
  }

  if (typeof (entryContainer) == "undefined")
  {
    entryContainer = null;
  }

  this.menuElement = element;
  this.entryElement = entryContainer;

  this.add = function (name, functionName, siteUrl, enableState)
  {
    registeredEntrys[registeredEntrys.length] = {function: functionName, name: name, site: siteUrl, enabled: enableState};
  }

  this.edit = function (id, name, functionName, siteUrl, enableState)
  {
    if (typeof(id) == "number")
    {
      registeredEntrys[id] = {function: functionName, name: name, site: siteUrl, enabled: enableState};
      return true;
    }
    this.update(id);
    return false;
  }

  this.remove = function (id)
  {
    if (typeof(id) == "number")
    {
      registeredEntrys.splice(id, 1);
      this.updateAll();
      return true;
    }
    return false;
  }

  this.clear = function()
  {
    currentId = -1;
    registeredEntrys = [];
  }

  this.getSelect = function()
  {
    return currentId;
  }

  this.select = function (id)
  {
    if ((currentId != id) && (typeof(id) == "number") && (typeof(registeredEntrys[id]) == "object") && (registeredEntrys[id] != null))
    {

      if (!registeredEntrys[id].enabled)
      {
        return false;
      }

      if (registeredEntrys[id].site != null)
      {
        $( this.entryElement ).attr('id', registeredEntrys[id].name);
        $( this.entryElement ).empty();
        $( this.entryElement ).load(registeredEntrys[id].site);
      }
      
      currentId = id;

      if ($( ".menuentrySelected" ).length)
      {
        $( ".menuentrySelected" )[0].className = "menuentry";
      }

      if ($( ".menuentry a#" + currentId ).length)
      {
        $( ".menuentry a#" + currentId )[0].parentNode.className = "menuentrySelected";
      }

      if (registeredEntrys[id].function != null)
      {
        return registeredEntrys[id].function(id);
      }
      else
      {
        return true;
      }
    }
    return false;

  }

  this.updateAll = function()
  {
    $( this.menuElement ).empty();
    for (var entry in registeredEntrys)
    {
      var className = "menuentry";
      if (entry == currentId)
      {
        className = "menuentrySelected";
      }
      if (!registeredEntrys[entry].enabled)
      {
        className = "menuentryDisabled";
      }
      $( this.menuElement ).append("<li class=\"" + className + "\"><a class=\"menuelement\" id=\"" + entry + "\" onclick=\"globalMenu.select(" + entry + ")\">" + registeredEntrys[entry].name + "</a></li>")
    }
    
  }

  this.update = function(id)
  {
    if ((typeof(id) == "number") && ($( ".menuentry a#" + currentId ).length) && (registeredEntrys.length > id))
    {
      var entryName = registeredEntrys[id].name;
      if (registeredEntrys[id].name == null)
      {
        entryName = "Entry(" + id + ")";
      }
      if (!registeredEntrys[entry].enabled)
      {
        $( ".menuentry a#" + currentId )[0].parentNode.className = "menuentryDisabled";
      }
      else
      {
        $( ".menuentry a#" + currentId )[0].parentNode.className = "menuentry";
      }
      $( ".menuentry a#" + currentId )[0].text = entryName;
      return true;
    }
    return false;
  }

}