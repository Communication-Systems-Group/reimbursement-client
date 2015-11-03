app.controller('ShowCostCategoryController', ['$scope', '$uibModalInstance', '$translate', 'costCategories', 'costCategoryUid', 'editable',

function($scope, $uibModalInstance, $translate, costCategories, costCategoryUid, editable) {
	"use strict";

	$scope.language = $translate.use();
	$scope.editable = editable;
	$scope.costCategories = costCategories;
	$scope.costCategoryUid = costCategoryUid;
	$scope.costCategoryObject = {};

	function findCostCategoryObject(uid) {
		for (var i = 0; i < $scope.costCategories.length; i++) {
			if ($scope.costCategories[i].uid === uid) {
				$scope.costCategoryObject = $scope.costCategories[i];
				break;
			}
		}
	}

	findCostCategoryObject($scope.costCategoryUid);

	$scope.save = function() {
		$uibModalInstance.close($scope.costCategoryObject.uid);
	};

	$scope.dismiss = function() {
		$uibModalInstance.dismiss();
	};
}]);
