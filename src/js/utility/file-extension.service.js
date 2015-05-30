app.factory('fileExtensionService', [

function() {
	"use strict";

	function fromFilename(filename) {
		var splitted = filename.split(".");
		if(splitted.length > 1) {
			return splitted[splitted.length - 1];
		}
		return "";
	}

	function isImageFile(filename) {
		var ext = fromFilename(filename);
		if(ext === "jpeg" || ext === "jpg" || ext === "png" || ext === "gif") {
			return true;
		}
		return false;
	}

	return {
		fromFilename: fromFilename,
		isImageFile: isImageFile
	};

}]);
