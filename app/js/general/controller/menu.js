function menuController(element, entryContainer, callback)
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
      $( this.menuElement ).append("<li class=\"" + className + "\"><a class=\"menuelement\" id=\"" + entry + "\" onclick=\"spo.globalMenu.select(" + entry + ")\">" + registeredEntrys[entry].name + "</a></li>")
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