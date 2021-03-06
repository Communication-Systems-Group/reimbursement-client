app.controller('EditCostCategoryController', [ '$scope', '$uibModalInstance', 'globalMessagesService', 'costCategory', 'isCreate', '$translate', 'administrationRestService',

	function ($scope, $uibModalInstance, globalMessagesService, costCategory, isCreate, $translate, administrationRestService) {
		"use strict";

		$scope.isLoading = false;
		$scope.lang = $translate.use();

		$scope.costCategory = {};
		angular.copy(costCategory, $scope.costCategory);

		$scope.isCreate = isCreate;

		function validation(form) {
			if (!form.accountNumber.$valid || !form.nameDe.$valid || !form.nameEn.$valid || !form.descriptionDe.$valid || !form.descriptionEn.$valid) {
				globalMessagesService.showInfo("reimbursement.globalMessage.expense.warning.formNotCompleteTitle",
					"reimbursement.globalMessage.expense.warning.formNotCompleteMessage");

				return false;
			}
			else {
				return true;
			}
		}

		$scope.dismissWithConfirmation = function () {
			globalMessagesService.confirmWarning("reimbursement.globalMessage.expenseItem.closeWarningTitle",
			"reimbursement.globalMessage.costCategory.closeWarningEditMessage").then($uibModalInstance.dismiss);
		};

		$scope.save = function (form) {

			if (validation(form)) {
				$scope.isLoading = true;

				if ($scope.costCategory.uid !== undefined) {
					administrationRestService.putCostCategory($scope.costCategory, $scope.costCategory.uid).then($uibModalInstance.dismiss);
				}
				else {
					administrationRestService.postCostCategory($scope.costCategory).then($uibModalInstance.dismiss);
				}
			}
		};
	}]);
