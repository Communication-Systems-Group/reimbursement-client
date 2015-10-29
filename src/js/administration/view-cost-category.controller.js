app.controller('ViewCostCategoryController', [ '$scope', '$uibModal', 'administrationRestService', 'globalMessagesService',

	function ($scope, $uibModal, administrationRestService, globalMessagesService) {
		"use strict";

		function loadData() {
			administrationRestService.getCostCategories().then(function (response) {
				$scope.costCategories = response.data;
			});
		}

		function findCostCategoryItem(uid) {
			for (var i = 0; i < $scope.costCategories.length; i++) {
				if ($scope.costCategories[i].uid === uid) {
					return $scope.costCategories[i];
				}
			}
		}

		loadData();

		$scope.addItem = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'EditCostCategoryController',
				backdrop: 'static',
				keyboard: false,
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

		$scope.deleteItem = function (uid) {
			globalMessagesService.confirmWarning("reimbursement.language.deleteCostCategoryItemTitle",
					"reimbursement.language.deleteCostCategoryItemText").then(function () {

					administrationRestService.deleteCostCategory(uid).then(function () {
						loadData();
					});
				});
		};

		$scope.editItem = function (uid) {
			var modalInstance = $uibModal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'EditCostCategoryController',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					costCategory: function () {
						return findCostCategoryItem(uid);
					},
					isCreate: function() {
						return false;
					}
				}
			});

			modalInstance.result.then()['finally'](loadData);
		};


	}]);
