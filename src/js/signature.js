reimbursement.signature = (function($, SignaturePad) {

	"use strict";

	var signaturePad;

	function createSignaturePad() {
		signaturePad = new SignaturePad($('canvas#signaturePad')[0]);
		addClickListenerToClearButton();
	}

	function addClickListenerToClearButton() {
		$('button.clearSignaturePad').click(function() {
			signaturePad.clear();
		});
	}

	return {
		createPad: createSignaturePad
	};

})(jQuery, SignaturePad);
