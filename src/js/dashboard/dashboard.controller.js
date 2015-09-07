app.controller('DashboardController', ['$scope', '$filter', '$state', 'USER', 'dashboardRestService', 'globalMessagesService',

	function ($scope, $filter, $state, USER, dashboardRestService) {
		'use strict';

		$scope.user = USER;

		$scope.showReviewSection = false;
		dashboardRestService.getMyExpenses().success(function (response) {
			$scope.myExpenses = response;
		}, function () {
			$scope.myExpenses = [];
		});

		var myReviewExpenses = null;
		if (USER.roles.indexOf('FINANCE_ADMIN') !== -1) {
			$scope.showReviewSection = true;
			myReviewExpenses = dashboardRestService.getReviewExpensesAsFinanceAdmin();
		}
		else if (USER.roles.indexOf('PROF') !== -1) {
			$scope.showReviewSection = true;
			myReviewExpenses = dashboardRestService.getReviewExpensesAsProf();
		}

		if (myReviewExpenses !== null) {
			myReviewExpenses.then(function (response) {
				$scope.myReviewExpenses = response.data;
			}, function () {
				$scope.myReviewExpenses = [];
			});
		}

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		$scope.addExpense = function () {
			$state.go('create-expense');
		};
	}
]);