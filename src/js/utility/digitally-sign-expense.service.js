app.factory('digitallySignExpenseService', ['$q', 'PDFSIGN', 'base64BinaryConverterService',

function($q, PDFSIGN, base64BinaryConverterService) {
	"use strict";

	function signPdf(base64Pdf, arrayBufferCertificate, password) {
		var deferred = $q.defer();

		var uint8Pdf = base64BinaryConverterService.toUint8ArrayFromBase64(base64Pdf);
		var uint8Certificate = new window.Uint8Array(arrayBufferCertificate);

		try {
			var signedPdfArray = PDFSIGN.signpdf(uint8Pdf, uint8Certificate, password);
			var typeAndFileEnding = base64BinaryConverterService.getTypeAndFileEndingFromBase64(base64Pdf);
			var blob = base64BinaryConverterService.toBlobFromUint8Array(signedPdfArray, typeAndFileEnding);
			deferred.resolve(blob);
		}
		catch(error) {
			deferred.reject(error);
		}
		return deferred.promise;
	}

	return {
		signPdf: signPdf
	};

}]);