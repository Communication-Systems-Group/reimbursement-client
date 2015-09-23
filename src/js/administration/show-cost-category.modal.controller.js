app.controller('CostCategoryModalController', [ '$scope', 'costCategories', 'costCategoryUid', '$modalInstance',

	function ($scope, costCategories, costCategoryUid, $modalInstance) {
		"use strict";

        $scope.costCategories = costCategories;
        $scope.costCategoryUid = costCategoryUid;
        $scope.costCategoryObject = {};

        function findCostCategoryObject(uid) {
            for(var i=0; i<$scope.costCategories.length; i++) {
                if($scope.costCategories[i].uid === uid) {
                    $scope.costCategoryObject = $scope.costCategories[i];
                    break;
                }
            }
        }

        findCostCategoryObject($scope.costCategoryUid);

        $scope.save = function() {
            $modalInstance.close($scope.costCategoryObject.uid);
        };

        $scope.dismiss = function() {
            $modalInstance.dismiss();
        };
	}]);
