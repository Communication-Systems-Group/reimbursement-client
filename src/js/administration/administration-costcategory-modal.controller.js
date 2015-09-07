app.controller('AdministrationCostCategoryController', [ '$scope', '$modalInstance', 'globalMessagesService', 'costCategory', '$translate', 'administrationRestService',

	function ($scope, $modalInstance, globalMessagesService, costCategory, $translate, administrationRestService) {
		"use strict";

		$scope.isLoading = false;
		$scope.lang = $translate.use();
		$scope.costCategory = {};
		angular.copy(costCategory, $scope.costCategory);

		function validation(form) {
			if (!form.accountNumber.$valid || !form.name_de.$valid || !form.name_en.$valid || !form.description_de.$valid || !form.description_en.$valid || !form.accounting_policy_de.$valid || !form.accounting_policy_en.$valid) {
				globalMessagesService.showInfo("reimbursement.expense.warning.formNotComplete.title",
					"reimbursement.expense.warning.formNotComplete.message");

				return false;
			} else {
				return true;
			}
		}

		$scope.dismissWithConfirmation = function () {
			globalMessagesService.confirmWarning("reimbursement.add-expense-item.closeWarningEditTitle",
					"reimbursement.add-expense-item.closeWarningEditMessage").then(function () {

					$modalInstance.dismiss();
				});
		};

		$scope.save = function (form) {

			if (validation(form)) {
				$scope.isLoading = true;

				if ($scope.costCategory.uid !== undefined) {
					administrationRestService.putCostCategory($scope.costCategory, $scope.costCategory.uid).then(function () {
						$modalInstance.dismiss();
					});
				} else {
					administrationRestService.postCostCategory($scope.costCategory).then(function () {
						$modalInstance.dismiss();
					});
				}
			}
		};
	}]);
