app.factory('digitallySignExpenseService', ['$q', 'PDFSIGN', 'base64BinaryConverterService',

function($q, PDFSIGN, base64BinaryConverterService) {
	"use strict";

	function signPdf(base64Pdf, arrayBufferCertificate, password) {
		var deferred = $q.defer();

		var uint8Pdf = base64BinaryConverterService.toUint8ArrayFromBase64(base64Pdf);
		var uint8Certificate = new window.Uint8Array(arrayBufferCertificate);

		try {
			var signedPdfArray = [PDFSIGN.signpdf(uint8Pdf, uint8Certificate, password)];

			var type = base64Pdf.split(',')[0].split(':')[1].split(";base64")[0];
			var fileEnding = type.split('/')[1];

			var blob = new window.Blob(signedPdfArray, { type: type });
			blob.lastModifiedDate = new Date();
			blob.name = new Date().toUTCString() + "." + fileEnding;

			deferred.resolve(blob);
		}
		catch(error) {
			console.error(error);
			deferred.reject();
		}
		return deferred.promise;
	}

	return {
		signPdf: signPdf
	};

}]);