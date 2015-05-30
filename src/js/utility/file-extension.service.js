app.factory('fileExtensionService', [

function() {
	"use strict";

	return {
		fromFilename: function(filename) {
			var splitted = filename.split(".");
			if(splitted.length > 1) {
				return splitted[splitted.length - 1];
			}
			return "";
		}
	};

}]);
