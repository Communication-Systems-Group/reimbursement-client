app.factory('digitallySignExpenseService', ['PDFSIGN',

function(PDFSIGN) {
	"use strict";

	function sign(base64Pdf, privateKey, optionalPassword) {

		// TODO add PDFSIGN library
		window.console.log(PDFSIGN, privateKey, optionalPassword);

		window.console.log("signing library is missing");
		return base64Pdf;
	}

	return {
		signPdf: sign
	};

}]);