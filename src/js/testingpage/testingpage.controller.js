app.controller('TestingPageController', ['$scope', 'testingPageRestService', 'signExpenseFactory',

function($scope, testingPageRestService, signExpenseFactory) {
	"use strict";

	$scope.form = {
		username: null,
		password: null
	};

	$scope.croppingDtoForm = {
		width: null,
		height: null,
		top: null,
		left: null
	};

	$scope.loginSent = false;
	$scope.loginSuccess = false;
	$scope.submit = function() {
		testingPageRestService.postLogin($scope.form).then(function() {
			$scope.loginSuccess = true;
		}, function() {
			$scope.loginSuccess = false;
		})['finally'](function() {
			$scope.loginSent = true;
		});
	};

	$scope.getUsersSent = false;
	$scope.getUsersSuccess = false;
	$scope.getUsers = function (){
		testingPageRestService.getUsers().then(function() {
			$scope.getUsersSuccess = true;
		}, function() {
			$scope.getUsersSuccess = false;
		})['finally'](function() {
			$scope.getUsersSent = true;
		});
	};
	$scope.getSignatureSent = false;
	$scope.getSignatureSuccess = false;
	$scope.getSignature = function (){
		testingPageRestService.getSignature().then(function(result) {
			$scope.getSignatureSuccess = true;
			$scope.image = result.data;
		}, function() {
			$scope.getSignatureSuccess = false;
		})['finally'](function() {
			$scope.getSignatureSent = true;
		});
	};
	$scope.getSignatureFailureSent = false;
	$scope.getSignatureFailureSuccess = false;
	$scope.getSignatureFailure = function (){
		testingPageRestService.getSignatureFailure().then(function(result) {
			$scope.getSignatureFailureSuccess = false;
			$scope.imageFailure = result.data;
		}, function(reason) {
			$scope.getSignatureFailureSuccess = true;
			$scope.imageFailure = reason.data;
		})['finally'](function() {
			$scope.getSignatureFailureSent = true;
		});
	};

	$scope.sendCroppingDtoSent = false;
	$scope.sendCroppingDtoSuccess = false;
	$scope.sendCroppingDto = function (){
		testingPageRestService.sendCroppingDto($scope.croppingDtoForm).then(function() {
			$scope.sendCroppingDtoSuccess = true;
		}, function() {
			$scope.sendCroppingDtoSuccess = false;
		})['finally'](function() {
			$scope.sendCroppingDtoSent = true;
		});
	};

	$scope.signExpense = function() {
		testingPageRestService.generatePDF($scope.expenseUid).then(function() {
			// Success generating pdf
			//console.log('PDF generation succeeded');
		}, function() {
			// Error generating pdf
			//console.log('PDF generation failed');
		})['finally'](function() {
			testingPageRestService.exportPDF($scope.expenseUid).then(function(response) {
				signExpenseFactory.construct(response.data.content, $scope.privateKey, function(signature) {
					//console.log("Signature: " + signature);
					signExpenseFactory.verify(response.data.content, signature, function() {
						//console.log("Is signature valid: " + isValid);
					});
				});
			}, function() {
				// Error generating pdf
				//console.log('PDF export failed');
			});
		});
	};

}]);
