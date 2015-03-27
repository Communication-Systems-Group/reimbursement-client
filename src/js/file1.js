var reimbursement = {};

reimbursement.test = (function() {

	"use strict";
	
	function hiYou() {
		sayingHiTo("you");
	}
	
	function hiMe() {
		sayingHiTo("me");
	}
	
	function sayingHiTo(person) {
		console.log("hi "+person);
	}
	
	return {
		hiYou: hiYou,
		hiMe: hiMe
	};
	
})();
