app.directive('expenseState',

	function () {
		"use strict";

		return {
			restrict: 'E',
			replace: true,
			scope: {
				state: '='
			},
			templateUrl: 'expense/expense-state.tpl.html',
			link: function ($scope) {

				function pushState(state) {
					$scope.expenseState = state;
					$scope.isSuccess = state === "PRINTED" || state === "SIGNED";
					$scope.isRejected = state === "REJECTED";
				}
				pushState();

				$scope.$watch('state', pushState);
			}
		};
	});