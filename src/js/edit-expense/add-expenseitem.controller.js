app.controller('AddExpenseItemController', ['moment', '$scope', '$modalInstance', '$filter', '$timeout', '$translate', 'spinnerService', 'globalMessagesService', 'editExpenseRestService', 'expenseItemUid',

function(moment, $scope, $modalInstance, $filter, $timeout, $translate, spinnerService, globalMessagesService, editExpenseRestService, expenseItemUid) {
	"use strict";

	$scope.form = {};
	$scope.calculatedAmount = 0;

	var expenseItem = {};

	$timeout(function(){
		spinnerService.show('spinnerEditExpenseItem');
	});

	var invalidDate = "";
	var invalidAmount = "";

	$translate(['reimbursement.add-expenseitem.invalidDate', 'reimbursement.add-expenseitem.invalidAmount']).then(function(translations) {
		invalidDate = translations['reimbursement.add-expenseitem.invalidDate'];
		invalidAmount = translations['reimbursement.add-expenseitem.invalidAmount'];
	}, function() {
		globalMessagesService.showGeneralError();
	});

	editExpenseRestService.getCostCategories().then(function(response) {
		$scope.costCategories =  response.data;

		editExpenseRestService.getSupportedCurrencies().then(function(response) {
			$scope.currencies = response.data;

			editExpenseRestService.getExpenseItem(expenseItemUid).then(function(response) {
				expenseItem = response.data;

				$scope.form.date = $filter('date')(response.data.date, 'yyyy-MM-dd');
				$scope.form.costCategoryUid = response.data.costCategory.uid;
				$scope.form.originalAmount = response.data.originalAmount;
				$scope.form.currency = response.data.currency;
				$scope.form.project = response.data.project;
				$scope.form.explanation = response.data.explanation;

				spinnerService.hide('spinnerEditExpenseItem');

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
			if(isNaN(window.parseFloat($scope.form.originalAmount))) {
				$scope.calculatedAmount = invalidAmount;
			}
			else {
				if(typeof exchangeRate !== "undefined") {
					$scope.calculatedAmount = $filter('number')(window.parseFloat($scope.form.originalAmount) / exchangeRate, 2);
				}
				else {
					$scope.calculatedAmount = $filter('number')(window.parseFloat($scope.form.originalAmount), 2);
				}
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
					$scope.calculatedAmount = invalidDate;
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

		if(expenseItem.state === 'INITIAL') {
			globalMessagesService.confirmWarning("reimbursement.add-expenseitem.closeWarningTitle",
				"reimbursement.add-expenseitem.closeWarningMessage").then(function() {

				editExpenseRestService.deleteExpenseItem(expenseItemUid).then(undefined, function(){
					globalMessagesService.showGeneralError();
				})['finally'](function() {
					$modalInstance.dismiss();
				});
			});
		}
		else {
			globalMessagesService.confirmWarning("reimbursement.add-expenseitem.closeWarningEditTitle",
				"reimbursement.add-expenseitem.closeWarningEditMessage").then(function() {

				$modalInstance.dismiss();
			});
		}
	};

	$scope.sendForm = function() {
		if(validForm($scope.form)) {
			editExpenseRestService.putExpenseItem(expenseItemUid, $scope.form).then(function() {
				$modalInstance.close();
			}, function() {
				globalMessagesService.showGeneralError();
			});
		}
		else {
			globalMessagesService.showWarning("reimbursement.expense.warning.formNotComplete.title", "reimbursement.expense.warning.formNotComplete.message");
		}
	};

	function validForm(form) {
		if(typeof form.date === "undefined" || form.date === null || !moment(form.date, 'yyyy-MM-dd').isValid()) {
			return false;
		}
		if(typeof form.costCategoryUid === "undefined" || form.costCategoryUid === null || form.costCategoryUid === "") {
			return false;
		}
		if(typeof form.originalAmount === "undefined" || form.originalAmount === null || !jQuery.isNumeric(form.originalAmount) || parseFloat(form.originalAmount) <= 0) {
			return false;
		}
		if(typeof form.currency === "undefined" || form.currency === null || form.currency === "") {
			return false;
		}
		if(typeof form.project === "undefined" || form.project === null || form.project === "") {
			return false;
		}
		if(typeof form.explanation === "undefined" || form.explanation === null || form.explanation === "") {
			return false;
		}
		return true;
	}

	$timeout(function() {
		jQuery('.datepicker').datetimepicker({
			format: 'YYYY-MM-DD',
			viewMode: 'months',
			allowInputToggle: true,
			maxDate: moment(),
			calendarWeeks: true
		}).on('dp.change', function() {
			$scope.form.date = jQuery('.datepicker').find('input').first().val();
			$scope.calculateAmount();
		});
	});

}]);