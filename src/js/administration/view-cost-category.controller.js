app.controller('ViewCostCategoryController', [ '$scope', '$uibModal', 'administrationRestService', 'globalMessagesService',

	function ($scope, $uibModal, administrationRestService, globalMessagesService) {
		"use strict";

		function loadData() {
			administrationRestService.getCostCategories().then(function (response) {
				$scope.costCategories = response.data;
			});
		}

		function findCostCategory(uid) {
			for (var i = 0; i < $scope.costCategories.length; i++) {
				if ($scope.costCategories[i].uid === uid) {
					return $scope.costCategories[i];
				}
			}
		}

		loadData();

		$scope.addCostCategory = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'EditCostCategoryController',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					costCategory: function () {
						return {};
					},
					isCreate: function() {
						return true;
					}
				}
			});

			modalInstance.result.then()['finally'](loadData);
		};

		$scope.toggleCostCategory = function (uid, isActive) {
			if(isActive) {
				// check if there is more than one cost category left
				var totalNumberOfCostCategories = 0;
				for(var i = 0; i < $scope.costCategories.length; i++) {
					if($scope.costCategories[i].isActive) {
						totalNumberOfCostCategories++;
					}
				}
				if(totalNumberOfCostCategories <= 1) {
					globalMessagesService.showWarningMd("reimbursement.administration.deactivateCostCategoryNotPossibleTitle",
					"reimbursement.administration.deactivateCostCategoryNotPossibleMessage");
				}
				else {
					globalMessagesService.confirmInfoMd("reimbursement.administration.deactivateCostCategoryTitle",
					"reimbursement.administration.deactivateCostCategoryText").then(function () {
						administrationRestService.deactivateCostCategory(uid).then(loadData);
					});
				}
			}
			else {
				globalMessagesService.confirmInfoMd("reimbursement.administration.activateCostCategoryTitle",
				"reimbursement.administration.activateCostCategoryText").then(function () {
					administrationRestService.activateCostCategory(uid).then(loadData);
				});
			}
		};

		$scope.editCostCategory = function (uid) {
			var modalInstance = $uibModal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'EditCostCategoryController',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					costCategory: function () {
						return findCostCategory(uid);
					},
					isCreate: function() {
						return false;
					}
				}
			});

			modalInstance.result.then()['finally'](loadData);
		};

	}]);
