app.controller('AdminPoolGraphsController', ['$scope', '$timeout', '$translate', 'globalMessagesService', 'administrationRestService', 'c3',

function($scope, $timeout, $translate, globalMessagesService, administrationRestService, c3) {
	'use strict';
	$scope.data = [];

	administrationRestService.getExpenseStateRawData().then(function(response) {
		$scope.data = response.data;

		$timeout(function() {

			$translate(['reimbursement.adminPoolSearch.expenseState.DRAFT',
							'reimbursement.adminPoolSearch.expenseState.ASSIGNED_TO_MANAGER',
							'reimbursement.adminPoolSearch.expenseState.TO_BE_ASSIGNED',
							'reimbursement.adminPoolSearch.expenseState.ASSIGNED_TO_FINANCE_ADMIN',
							'reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_USER',
							'reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_MANAGER',
							'reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_FINANCE_ADMIN',
							'reimbursement.adminPoolSearch.expenseState.SIGNED',
							'reimbursement.adminPoolGraphs.percentagePrinted']).then(function(translations) {

				c3.generate({
					bindto: "#graph-donut-current-state-distribution",
					data: {
						type: 'area-step',
						columns: [
							['Expenses in this state', $scope.data.draft, $scope.data.assignedToManager, $scope.data.toBeAssigned, $scope.data.assignedToFinanceAdmin, $scope.data.toSignByUser, $scope.data.toSignByManager, $scope.data.toSignByFinanceAdmin, $scope.data.signed],
						]
					},
					axis: {
						x: {
							type: 'category',
							categories: [
								translations['reimbursement.adminPoolSearch.expenseState.DRAFT'],
								translations['reimbursement.adminPoolSearch.expenseState.ASSIGNED_TO_MANAGER'],
								translations['reimbursement.adminPoolSearch.expenseState.TO_BE_ASSIGNED'],
								translations['reimbursement.adminPoolSearch.expenseState.ASSIGNED_TO_FINANCE_ADMIN'],
								translations['reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_USER'],
								translations['reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_MANAGER'],
								translations['reimbursement.adminPoolSearch.expenseState.TO_SIGN_BY_FINANCE_ADMIN'],
								translations['reimbursement.adminPoolSearch.expenseState.SIGNED']
							]
						}
					},
					legend: {
						show: false
					}
				});
				c3.generate({
					bindto: "#graph-gauge-accepted-declined",
					data: {
						type: "gauge",
						columns: [[translations['reimbursement.adminPoolGraphs.percentagePrinted'], $scope.data.percentagePrinted]]
					},
					color: {
						pattern: ['#ff0000', '#f97600', '#f6c600', '#60b044'],
						threshold: {
							values: [70, 80, 90, 100]
						}
					}
				});

				c3.generate({
					bindto: "#graph-line-sum-current-year",
					data: {
						x: 'x',
						type: 'area',
						columns: [['x', '2015-01-01', '2015-02-01', '2015-03-01', '2015-04-01', '2015-05-01', '2015-06-01', '2015-07-01', '2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01'], ['finished', 5, 20, 40, 20, 40, 50, 70, 80, 101, 120, 140], ['not-yet-finished', 20, 30, 40, 20, 30, 80, 90, 40, 30, 20, 10]],
						groups: [['finished', 'not-yet-finished']]
					},
					axis: {
						x: {
							type: 'timeseries',
							min: '2015-01-01',
							max: '2015-12-01',
							tick: {
								format: '%m.%y',
								multiline: false,
								rotate: 20
							}
						}
					}
				});
			}, function() {
						globalMessagesService.showGeneralError();
			});
		});
	});

}]);
