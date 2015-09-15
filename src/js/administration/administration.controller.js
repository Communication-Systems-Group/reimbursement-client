app.controller('AdministrationController', [ '$scope', '$modal', 'administrationRestService', 'globalMessagesService',

	function ($scope, $modal, administrationRestService, globalMessagesService) {
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
			var modalInstance = $modal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'AdministrationCostCategoryController',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					costCategory: function () {
						return {};
					}
				}
			});

			modalInstance.result.then()['finally'](loadData);
		};

		$scope.deleteItem = function (uid) {
			globalMessagesService.confirmWarning("reimbursement.administration.deleteCostCategoryItemTitle",
					"reimbursement.administration.deleteCostCategoryItemText").then(function () {

					administrationRestService.deleteCostCategory(uid).then(function () {
						loadData();
					});
				});
		};

		$scope.editItem = function (uid) {

			var modalInstance = $modal.open({
				templateUrl: 'administration/edit-cost-category.tpl.html',
				controller: 'AdministrationCostCategoryController',
				backdrop: 'static',
				keyboard: false,
				resolve: {
					costCategory: function () {
						return findCostCategoryItem(uid);
					}
				}
			});

			modalInstance.result.then()['finally'](loadData);
		};


	}]);
