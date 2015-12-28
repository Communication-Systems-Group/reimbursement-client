app.factory('base64BinaryConverterService', [

function() {
	"use strict";

	function toBase64(binary, callback) {
		var fileReader = new window.FileReader();
		fileReader.onload = function() {
			callback(fileReader.result);
		};
		fileReader.readAsDataURL(binary);
	}

	function toBinary(base64) {
		// taken from: http://stackoverflow.com/a/14988118/3233827
		var binaryData = window.atob(base64.split(',')[1]);
		var binaryLength = binaryData.length;
		var arrayBuffer = new window.ArrayBuffer(binaryLength);
		var uint8Array = new window.Uint8Array(arrayBuffer);

		for (var i = 0; i < binaryLength; i++) {
			uint8Array[i] = binaryData.charCodeAt(i);
		}

		var typeAndEnding = getTypeAndFileEndingFromBase64(base64);
		var file = toBlobFromUint8Array(uint8Array, typeAndEnding);

		// TODO check if this url creation need explicit revoke of url
		file.url = window.URL.createObjectURL(file);
		return file;
	}

	function getTypeAndFileEndingFromBase64(base64) {
		var type = base64.split(',')[0].split(':')[1].split(";base64")[0];
		return {
			type: type,
			fileEnding: type.split('/')[1]
		};
	}

	function toBlobFromUint8Array(uint8Array, typeAndFileEnding) {
		var blob = new window.Blob([ uint8Array ], { type: typeAndFileEnding.type });
		blob.lastModifiedDate = new Date();
		blob.name = new Date().toUTCString() + "." + typeAndFileEnding.fileEnding;
		return blob;
	}

	function toBase64FromJson(json, callback) {
		var base64String = "data:" + json.type + ";base64," + json.content;
		if (typeof (callback) === "function") {
			callback(base64String);
		}
		else {
			return base64String;
		}
	}

	function toUint8ArrayFromBase64(base64) {
		var binaryData = window.atob(base64.split(',')[1]);
		var binaryLength = binaryData.length;
		var arrayBuffer = new window.ArrayBuffer(binaryLength);
		var uint8Array = new window.Uint8Array(arrayBuffer);

		for (var i = 0; i < binaryLength; i++) {
			uint8Array[i] = binaryData.charCodeAt(i);
		}
		return uint8Array;
	}

	return {
		toBase64: toBase64,
		toBinary: toBinary,
		getTypeAndFileEndingFromBase64: getTypeAndFileEndingFromBase64,
		toBlobFromUint8Array: toBlobFromUint8Array,
		toBase64FromJson: toBase64FromJson,
		toUint8ArrayFromBase64: toUint8ArrayFromBase64
	};
}]);