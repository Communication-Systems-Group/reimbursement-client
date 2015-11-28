app.directive('expenseItemForm', ['moment', '$filter', '$timeout', '$translate', '$uibModal', 'USER', 'spinnerService', 'globalMessagesService', 'expenseItemsRestService',

function(moment, $filter, $timeout, $translate, $uibModal, USER, spinnerService, globalMessagesService, expenseItemsRestService) {
	"use strict";

	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'expense-items/expense-item-form.directive.tpl.html',
		scope: {
			expenseItem: '=',
			validate: '=',
			form: '=',
			editable: '='
		},
		link: function($scope) {

			$scope.form = $scope.form || {};
			$scope.USER = USER;
			$scope.projectFieldRequired = ($scope.USER.hasRole('PROF') || $scope.USER.hasRole('DEPARTMENT_MANAGER') || $scope.USER.hasRole('FINANCE_ADMIN')) ? true : false;

			// pass the hasAttachment property from the child directive to the parent
			$scope.attachment = {};
			$scope.$watch('attachment.hasAttachment', function() {
				$scope.hasAttachment = $scope.attachment.hasAttachment;
			});

			$scope.calculatedAmount = $filter('number')(0, 2);

			$timeout(function() {
				spinnerService.show('spinnerExpenseItemForm');

				expenseItemsRestService.getCostCategories().then(function(response) {
					$scope.costCategories = response.data;

					expenseItemsRestService.getSupportedCurrencies().then(function(response) {
						$scope.currencies = response.data;

						if(!$scope.editable) {
							$scope.staticCalculatedAmount = $scope.expenseItem.calculatedAmount;
						}
						else {
							$scope.currentCostCategoryIsInactive = true;
							for(var i = 0; i < $scope.costCategories.length; i++) {
								if($scope.costCategories[i].uid === $scope.expenseItem.costCategory.uid) {
									$scope.currentCostCategoryIsInactive = false;
									break;
								}
							}
							if($scope.currentCostCategoryIsInactive) {
								$scope.costCategories.push($scope.expenseItem.costCategory);
							}
						}

						$scope.form.date = $filter('date')($scope.expenseItem.date, 'dd.MM.yyyy');
						$scope.form.costCategoryUid = $scope.expenseItem.costCategory.uid;
						$scope.form.originalAmount = $scope.expenseItem.originalAmount;
						$scope.form.project = $scope.expenseItem.project;
						$scope.form.explanation = $scope.expenseItem.explanation;

						$timeout(function() {
							// make sure the currencies are completely loaded before setting the default
							$scope.form.currency = $scope.expenseItem.currency;
						});

						if($scope.editable) {
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

			if($scope.editable) {

				var invalidDate = "";
				var invalidAmount = "";

				$translate(['reimbursement.expenseItem.invalidDate', 'reimbursement.expenseItem.invalidAmount']).then(function(translations) {
					invalidDate = translations['reimbursement.expenseItem.invalidDate'];
					invalidAmount = translations['reimbursement.expenseItem.invalidAmount'];
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

					if(($scope.form.date !== "" && $scope.form.date !== undefined && $scope.$parent.formExpenseItem.originalAmount.$valid) || (!$scope.$parent.formExpenseItem.originalAmount.$valid && !$scope.$parent.formExpenseItem.originalAmount.$touched)) {
						// only make back-end calls if necessary
						if(exchangeRateDate !== $filter('getISODate')($scope.form.date)) {
							var date = $filter('getISODate')($scope.form.date);
							expenseItemsRestService.getExchangeRates(date).then(function(response) {
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

				$scope.validate = function() {
					if(typeof $scope.form.date === "undefined" || $scope.form.date === null || !moment($scope.form.date, 'dd.MM.yyyy').isValid()) {
						return false;
					}
					if(typeof $scope.form.costCategoryUid === "undefined" || $scope.form.costCategoryUid === null || $scope.form.costCategoryUid === "") {
						return false;
					}
					if(typeof $scope.form.originalAmount === "undefined" || $scope.form.originalAmount === null || !jQuery.isNumeric($scope.form.originalAmount) || parseFloat($scope.form.originalAmount) <= 0) {
						return false;
					}
					if(typeof $scope.form.currency === "undefined" || $scope.form.currency === null || $scope.form.currency === "") {
						return false;
					}
					if(typeof $scope.attachment.hasAttachment === "undefined" || $scope.attachment.hasAttachment === null || $scope.attachment.hasAttachment === false) {
						return false;
					}
					return true;
				};

				$timeout(function() {
					jQuery('.datepicker').datetimepicker({
						format: 'DD.MM.YYYY',
						viewMode: 'months',
						allowInputToggle: true,
						maxDate: moment(),
						calendarWeeks: true
					}).on('dp.hide', function() {
						$scope.form.date = jQuery('.datepicker').find('input').first().val();
						$scope.calculateAmount();
					});
				});

				$scope.openCostCategoryModal = function() {
					var modalInstance = $uibModal.open({
						templateUrl: 'expense-items/show-cost-category.modal.tpl.html',
						controller: 'ShowCostCategoryController',
						resolve: {
							costCategories: function() {
								return $scope.costCategories;
							},
							costCategoryUid: function() {
								return $scope.form.costCategoryUid;
							},
							editable: function() {
								return $scope.editable;
							}
						}
					});

					modalInstance.result.then(function(response) {
						$scope.form.costCategoryUid = response;
					});
				};
			}

			if(!$scope.editable) {
				$scope.openViewOnlyCostCategoryModal = function() {
					$uibModal.open({
						templateUrl: 'expense-items/show-cost-category.modal.tpl.html',
						controller: 'ShowCostCategoryController',
						resolve: {
							costCategories: function() {
								return $scope.costCategories;
							},
							costCategoryUid: function() {
								return $scope.form.costCategoryUid;
							},
							editable: function() {
								return $scope.editable;
							}
						}
					});
				};
			}
		}
	};

}]);
