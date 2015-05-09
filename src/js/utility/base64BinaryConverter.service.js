app.factory('base64BinaryConverterService', [

function() {
	"use strict";

	return {
		toBase64: function(binary, callback) {
			var fileReader = new window.FileReader();
			fileReader.onload = function() {
				callback(fileReader.result);
			};
			fileReader.readAsDataURL(binary);
		},
		toBinary: function(base64) {
			var type = base64.split(',')[0].split(':')[1].split(";base64")[0];
			var fileEnding = type.split('image/')[1];

			// taken from: http://stackoverflow.com/a/14988118/3233827
			var binaryData = window.atob(base64.split(',')[1]);
			var binaryLength = binaryData.length;
			var arrayBuffer = new window.ArrayBuffer(binaryLength);
			var uint8Array = new window.Uint8Array(arrayBuffer);

			for(var i=0; i<binaryLength; i++) {
				uint8Array[i] = binaryData.charCodeAt(i);
			}

			var blob = new window.Blob([uint8Array], {type: type});
			blob.lastModifiedDate = new Date();
			blob.name = new Date().toUTCString() + "." + fileEnding;

			var file = blob;
			return file;
		}
	};

}]);