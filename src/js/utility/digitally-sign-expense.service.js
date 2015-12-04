app.factory('digitallySignExpenseService', ['pdfsign',

function(pdfsign) {
	"use strict";

	function sign(base64Pdf, privateKey) {
		// TODO remove check and make a direct call to the currently missing library "pdfsign"
		// if calculation takes too long, return a promise

		if(typeof pdfsign !== 'undefined' && typeof pdfsign.sign !== 'undefined') {
			return pdfsign.sign(base64Pdf, privateKey);
		}
		else {
			console.log("signing library is missing");
			return base64Pdf;
		}
	}

	return {
		signPdf: sign
	};

}]);