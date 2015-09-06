app.directive('expenseItemForm', ['moment', '$filter', '$timeout', '$translate', 'spinnerService', 'globalMessagesService', 'listExpenseItemsRestService',

function(moment, $filter, $timeout, $translate, spinnerService, globalMessagesService, listExpenseItemsRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'list-expense-items/expense-item-form.directive.tpl.html',
		scope: {
			expenseItemUid: '=',
			form: '=',
			validatingFunction: '='
		},
		link: function($scope) {

			var expenseItem = {};
			$scope.calculatedAmount = $filter('number')(0, 2);

			$timeout(function(){
				spinnerService.show('spinnerEditExpenseItem');
			});

			var invalidDate = "";
			var invalidAmount = "";

			$translate(['reimbursement.add-expense-item.invalidDate', 'reimbursement.add-expense-item.invalidAmount']).then(function(translations) {
				invalidDate = translations['reimbursement.add-expense-item.invalidDate'];
				invalidAmount = translations['reimbursement.add-expense-item.invalidAmount'];
			}, function() {
				globalMessagesService.showGeneralError();
			});

			listExpenseItemsRestService.getCostCategories().then(function(response) {
				$scope.costCategories =  response.data;

				listExpenseItemsRestService.getSupportedCurrencies().then(function(response) {
					$scope.currencies = response.data;

					listExpenseItemsRestService.getExpenseItem($scope.expenseItemUid).then(function(response) {
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
						spinnerService.hide('spinnerEditExpenseItem');
					});
				}, function() {
					globalMessagesService.showGeneralError();
					spinnerService.hide('spinnerEditExpenseItem');
				});
			}, function() {
				globalMessagesService.showGeneralError();
				spinnerService.hide('spinnerEditExpenseItem');
			});

			var exchangeRates = null;
			var exchangeRateDate = null;
			$scope.calculateAmount = function() {

				function calculate() {
					var exchangeRate = exchangeRates.rates[$scope.form.currency];
					if(isNaN(window.parseFloat($scope.form.originalAmount)) || window.parseFloat($scope.form.originalAmount) < 0) {
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
						listExpenseItemsRestService.getExchangeRates($scope.form.date).then(function(response) {
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
					$scope.calculatedAmount = $filter('number')(0, 2);
				}
			};

			$scope.validatingFunction = function(form) {
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
			};

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
		}
	};

}]);
