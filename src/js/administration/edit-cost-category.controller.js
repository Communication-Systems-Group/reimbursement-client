app.controller('EditCostCategoryController', [ '$scope', '$uibModalInstance', 'globalMessagesService', 'costCategory', 'isCreate', '$translate', 'administrationRestService',

	function ($scope, $uibModalInstance, globalMessagesService, costCategory, isCreate, $translate, administrationRestService) {
		"use strict";

		$scope.isLoading = false;
		$scope.lang = $translate.use();

		$scope.costCategory = {};
		angular.copy(costCategory, $scope.costCategory);

		$scope.isCreate = isCreate;

		function validation(form) {
			if (!form.accountNumber.$valid || !form.nameDe.$valid || !form.nameEn.$valid || !form.descriptionDe.$valid || !form.descriptionEn.$valid || !form.accountingPolicyDe.$valid || !form.accountingPolicyEn.$valid) {
				globalMessagesService.showInfo("reimbursement.expense.warning.formNotComplete.title",
					"reimbursement.expense.warning.formNotComplete.message");

				return false;
			}
			else {
				return true;
			}
		}

		$scope.dismissWithConfirmation = function () {
			globalMessagesService.confirmWarning("reimbursement.expenseItem.closeWarningEditTitle",
			"reimbursement.expenseItem.closeWarningEditMessage").then(function () {

				$uibModalInstance.dismiss();
			});
		};

		$scope.save = function (form) {

			if (validation(form)) {
				$scope.isLoading = true;

				if ($scope.costCategory.uid !== undefined) {
					administrationRestService.putCostCategory($scope.costCategory, $scope.costCategory.uid).then(function () {
						$uibModalInstance.dismiss();
					});
				}
				else {
					administrationRestService.postCostCategory($scope.costCategory).then(function () {
						$uibModalInstance.dismiss();
					});
				}
			}
		};
	}]);
