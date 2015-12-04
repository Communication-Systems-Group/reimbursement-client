app.factory('signExpenseService', ['pdfsign',

function(pdfsign) {
	"use strict";

	function sign(base64Pdf, privateKey) {
		return pdfsign.sign(base64Pdf, privateKey);
	}

	return {
		signPdf: sign
	};

}]);