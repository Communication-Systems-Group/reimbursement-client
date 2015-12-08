app.factory("expenseRestService", ['$http', 'HOST',

function($http, HOST) {
	"use strict";

	function postCreateExpense(accounting) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses',
			params: {
				accounting: accounting
			}
		});
	}

	function getExpense(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/' + uid
		});
	}

	function putExpense(uid, accounting) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid,
			params: {
				accounting: accounting
			}
		});
	}

	function accept(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/accept'
		});
	}

	function assignToManager(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/assign-to-manager'
		});
	}

	function reject(uid, reason) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/reject',
			params: {
				comment: reason
			}
		});
	}

	function getExpensePdf(uid) {
		return $http({
			method: 'GET',
			url: HOST + '/api/expenses/' + uid + '/export-pdf'
		});
	}

	function getExpenseToken(uid) {
		return $http({
			method: 'POST',
			url: HOST + '/api/public/expenses/' + uid + '/token'
		});
	}

	function setSignMethodToDigital(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/set-digital-signature'
		});
	}

	function setSignMethodToElectronical(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/set-electronical-signature'
		});
	}

	function getSignDigitallyPath(uid) {
		return HOST + '/api/expenses/' + uid + '/sign-digitally';
	}

	function signElectronically(uid) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses/' + uid + '/sign-electronically'
		});
	}

	function generatePdf(uid, url) {
		return $http({
			method: 'POST',
			url: HOST + '/api/expenses/' + uid + '/generate-pdf',
			params: {
				url: url
			}
		});
	}

	function assignToMe(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/' + uid + '/assign-to-me'
		});
	}

	function deleteExpense(uid) {
		return $http({
			method: 'DELETE',
			url: HOST + '/api/expenses/' + uid
		});
	}

	function getMyExpenses() {
		return $http({
			method: 'GET',
			url: HOST + "/api/expenses/"
		});
	}

	function getReviewExpenses() {
		return $http({
			method: 'GET',
			url: HOST + "/api/expenses/review-expenses"
		});
	}

	function getUserByUid(uid) {
		return $http({
			method: 'GET',
			url: HOST + "/api/finance-admin/users/" + uid
		});
	}

	function archiveExpense(uid) {
		return $http({
			method: 'PUT',
			url: HOST + '/api/expenses/archive/' + uid
		});
	}

	return {
		postCreateExpense: postCreateExpense,
		getExpense: getExpense,
		putExpense: putExpense,
		assignToManager: assignToManager,
		accept: accept,
		reject: reject,
		getExpensePdf: getExpensePdf,
		getExpenseToken: getExpenseToken,
		setSignMethodToDigital: setSignMethodToDigital,
		setSignMethodToElectronical: setSignMethodToElectronical,
		getSignDigitallyPath: getSignDigitallyPath,
		signElectronically: signElectronically,
		generatePdf: generatePdf,
		assignToMe: assignToMe,
		deleteExpense: deleteExpense,
		getMyExpenses: getMyExpenses,
		getReviewExpenses: getReviewExpenses,
		getUserByUid: getUserByUid,
		archiveExpense: archiveExpense
	};

}]);
