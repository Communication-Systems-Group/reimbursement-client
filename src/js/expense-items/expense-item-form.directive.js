app.directive('expenseItemForm', ['moment', '$filter', '$timeout', '$translate', 'spinnerService', 'globalMessagesService', 'expenseItemsRestService',

function(moment, $filter, $timeout, $translate, spinnerService, globalMessagesService, expenseItemsRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'expense-items/expense-item-form.directive.tpl.html',
		scope: {
			expenseItemUid: '=',
			form: '=',
			validatingFunction: '=',
			readonly: '='
		},
		link: function($scope) {

			$scope.form = $scope.form || {};

			var expenseItem = {};
			$scope.calculatedAmount = $filter('number')(0, 2);

			$timeout(function(){
				spinnerService.show('spinnerExpenseItemForm');
			});

			expenseItemsRestService.getCostCategories().then(function(response) {
				$scope.costCategories =  response.data;

				expenseItemsRestService.getSupportedCurrencies().then(function(response) {
					$scope.currencies = response.data;

					expenseItemsRestService.getExpenseItem($scope.expenseItemUid).then(function(response) {
						expenseItem = response.data;

						if($scope.readonly) {
							$scope.staticCalculatedAmount = response.data.calculatedAmount;

							for(var i=0; i<$scope.costCategories.length; i++) {
								if($scope.costCategories[i].uid === response.data.costCategory.uid) {
									$scope.costCategoryLabel = $filter('costCategoryLanguage')($scope.costCategories[i].name);
									break;
								}
							}
						}

						$scope.form.date = $filter('date')(response.data.date, 'yyyy-MM-dd');
						$scope.form.costCategoryUid = response.data.costCategory.uid;
						$scope.form.originalAmount = response.data.originalAmount;
						$scope.form.project = response.data.project;
						$scope.form.explanation = response.data.explanation;

						$timeout(function() {
							// make sure the currencies are completely loaded before setting the default
							$scope.form.currency = response.data.currency;
						});

						if(!$scope.readonly) {
							$scope.calculateAmount();
						}

						spinnerService.hide('spinnerExpenseItemForm');

					}, function() {
						spinnerService.hide('spinnerExpenseItemForm');
					});
				}, function() {
					spinnerService.hide('spinnerExpenseItemForm');
				});
			}, function() {
				spinnerService.hide('spinnerExpenseItemForm');
			});

			if(!$scope.readonly) {

				var invalidDate = "";
				var invalidAmount = "";

				$translate(['reimbursement.add-expense-item.invalidDate', 'reimbursement.add-expense-item.invalidAmount']).then(function(translations) {
					invalidDate = translations['reimbursement.add-expense-item.invalidDate'];
					invalidAmount = translations['reimbursement.add-expense-item.invalidAmount'];
				}, function() {
					globalMessagesService.showGeneralError();
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
							expenseItemsRestService.getExchangeRates($scope.form.date).then(function(response) {
								exchangeRates = response.data;
								exchangeRateDate = $scope.form.date;
								calculate();
							}, function(response) {
								response.errorHandled = true;
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
					}).on('dp.hide', function() {
						$scope.form.date = jQuery('.datepicker').find('input').first().val();
						$scope.calculateAmount();
					});
				});
			}
		}
	};

}]);
