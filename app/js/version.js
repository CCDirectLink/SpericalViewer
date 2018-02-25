/* eslint-env node */
/* global globals */

/* eslint-disable */
// ESLint: 1 Error
// TODO: Version export

function Version() {
  this.getList = function(currentVersion) {
    var option = "";

    for (var version in globals.gameData.versions) {
      var full =
        version + " - " + globals.gameData.versions[version].version.string;

      var selected = "";
      if (currentVersion === full) selected = "selected";

      option +=
        '<option value="' +
        version +
        '" ' +
        selected +
        ">" +
        full +
        "</option>";
    }

    return option;
  };
}
