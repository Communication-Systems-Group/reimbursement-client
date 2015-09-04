app.controller('DashboardController', ['$scope', '$filter', '$state', 'USER', 'dashboardRestService', 'globalMessagesService',  'expenseRestService',

	function ($scope, $filter, $state, USER, dashboardRestService, globalMessagesService, expenseRestService) {
		'use strict';

		$scope.user = USER;

		$scope.showReviewSection = false;
		dashboardRestService.getMyExpenses().success(function (response) {
			$scope.myExpenses = response;
		}, function() {
			$scope.myExpenses = [];
		});

		var myReviewExpenses = null;
		if(USER.roles.indexOf('FINANCE_ADMIN') !== -1) {
			myReviewExpenses = dashboardRestService.getReviewExpensesAsFinanceAdmin();
		}
		else if(USER.roles.indexOf('PROF') !== -1) {
			myReviewExpenses = dashboardRestService.getReviewExpensesAsProf();
		}

		if(myReviewExpenses !== null) {
			$scope.showReviewSection = true;
			myReviewExpenses.then(function(response) {
				$scope.myReviewExpenses = response;
			}, function() {
				$scope.myReviewExpenses = [];
			});
		}

		$scope.go = function (state, params) {
			$state.go(state, params);
		};

		$scope.addExpense = function () {
			expenseRestService.postExpense({accounting: '', state: 'CREATED'})
				.success(function (response) {
					$state.go('expense', {id: response.uid, isReview: 0});
				})
				.error(function () {
					$filter('translate')('reimbursement.error.title');
					$filter('translate')('reimbursement.error.body');
				});
		};
	}
]);