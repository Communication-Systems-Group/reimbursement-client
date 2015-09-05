app.controller('AddExpenseItemController', ['$scope', '$modalInstance', '$filter', 'globalMessagesService', 'editExpenseRestService', 'expenseItemUid',

function($scope, $modalInstance, $filter, globalMessagesService, editExpenseRestService, expenseItemUid) {
	"use strict";

	$scope.form = {};
	$scope.calculatedAmount = 0;

	editExpenseRestService.getCostCategories().then(function(response) {
		$scope.costCategories =  response.data;

		editExpenseRestService.getSupportedCurrencies().then(function(response) {
			$scope.currencies = response.data;

			editExpenseRestService.getExpenseItem(expenseItemUid).then(function(response) {
				$scope.form.date = $filter('date')(response.data.date, 'yyyy-MM-dd');
				$scope.form.costCategory = response.data.costCategory;
				$scope.form.amount = response.data.originalAmount;
				$scope.form.currency = response.data.currency;
				$scope.form.project = response.data.costCenter;
				$scope.form.explanation = response.data.reason;

			}, function() {
				globalMessagesService.showGeneralError();
			});
		}, function() {
			globalMessagesService.showGeneralError();
		});
	}, function() {
		globalMessagesService.showGeneralError();
	});

	var exchangeRates = null;
	var exchangeRateDate = null;
	$scope.calculateAmount = function() {

		function calculate() {
			var exchangeRate = exchangeRates.rates[$scope.form.currency];
			if(typeof exchangeRate !== "undefined") {
				$scope.calculatedAmount = window.parseInt($scope.form.amount, 10) * exchangeRate;
			}
			else {
				$scope.calculatedAmount = window.parseInt($scope.form.amount, 10);
			}
		}

		if($scope.form.date !== "") {
			// only make back-end calls if necessary
			if(exchangeRateDate !== $scope.form.date) {
				editExpenseRestService.getExchangeRates($scope.form.date).then(function(response) {
					exchangeRates = response.data;
					exchangeRateDate = $scope.form.date;
					calculate();
				}, function() {
					$scope.calculatedAmount = 'Invalid Date';
				});
			}
			else {
				calculate();
			}
		}
		else {
			$scope.calculatedAmount = 0;
		}
	};

	$scope.dismissWithConfirmation = function() {
		globalMessagesService.confirmWarning("reimbursement.add-expenseitem.closeWarningTitle",
			"reimbursement.add-expenseitem.closeWarningMessage").then(function(){

			editExpenseRestService.deleteExpenseItem(expenseItemUid).then(undefined, function(){
				globalMessagesService.showGeneralError();
			})['finally'](function() {
				$modalInstance.dismiss();
			});
		});
	};

	$scope.sendForm = function() {
		// TODO improve validation
		var form = $scope.form;

		if(validate(form.date) && validate(form.costcategory) && validate(form.amount) && validate(form.currency) && validate(form.project) && validate(form.explanation)) {
			// TODO send to back-end
			console.log(true);
		}
		else {
			globalMessagesService.showWarning("reimbursement.expense.warning.formNotComplete.title", "reimbursement.expense.warning.formNotComplete.message");
		}
	};

	function validate(value) {
		return (typeof value !== "undefined" && value !== "");
	}

}]);
