app.controller('ShowCostCategoryController', ['$scope', '$uibModalInstance', '$translate', 'costCategories', 'costCategoryUid', 'editable',

function($scope, $uibModalInstance, $translate, costCategories, costCategoryUid, editable) {
	"use strict";

	$scope.language = $translate.use();
	$scope.editable = editable;
	$scope.costCategories = costCategories;
	$scope.costCategoryUid = costCategoryUid;
	$scope.costCategory = {};

	function findcostCategory(uid) {
		for (var i = 0; i < $scope.costCategories.length; i++) {
			if ($scope.costCategories[i].uid === uid) {
				$scope.costCategory = $scope.costCategories[i];
				break;
			}
		}
	}

	findcostCategory($scope.costCategoryUid);

	$scope.save = function() {
		$uibModalInstance.close($scope.costCategory.uid);
	};

	$scope.dismiss = function() {
		$uibModalInstance.dismiss();
	};
}]);
