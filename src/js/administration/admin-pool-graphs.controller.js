app.controller('AdminPoolGraphsController', ['$scope', '$timeout', '$translate', 'globalMessagesService', 'administrationRestService', 'c3',

function($scope, $timeout, $translate, globalMessagesService, administrationRestService, c3) {
	'use strict';

	$scope.data = [];

	administrationRestService.getExpenseStateRawData().then(function(response) {
		$scope.data = response.data;

		$timeout(function() {

			$translate(['reimbursement.expense.state.DRAFT',
			'reimbursement.expense.state.ASSIGNED_TO_MANAGER',
			'reimbursement.expense.state.TO_BE_ASSIGNED',
			'reimbursement.expense.state.ASSIGNED_TO_FINANCE_ADMIN',
			'reimbursement.expense.state.TO_SIGN_BY_USER',
			'reimbursement.expense.state.TO_SIGN_BY_MANAGER',
			'reimbursement.expense.state.TO_SIGN_BY_FINANCE_ADMIN',
			'reimbursement.expense.state.SIGNED',
			'reimbursement.administration.graphs.percentagePrinted',
			'reimbursement.administration.graphs.totalAmount',
			'reimbursement.administration.graphs.firstQuarter',
			'reimbursement.administration.graphs.secondQuarter',
			'reimbursement.administration.graphs.thirdQuarter',
			'reimbursement.administration.graphs.fourthQuarter']).then(function(translations) {

				c3.generate({
					bindto: "#graph-area-step-current-state-distribution",
					data: {
						type: 'area-step',
						columns: [
							['Expenses in this state', $scope.data.draft, $scope.data.assignedToManager, $scope.data.toBeAssigned, $scope.data.assignedToFinanceAdmin, $scope.data.toSignByUser, $scope.data.toSignByManager, $scope.data.toSignByFinanceAdmin, $scope.data.signed]
						]
					},
					axis: {
						x: {
							type: 'category',
							categories: [
								translations['reimbursement.expense.state.DRAFT'],
								translations['reimbursement.expense.state.ASSIGNED_TO_MANAGER'],
								translations['reimbursement.expense.state.TO_BE_ASSIGNED'],
								translations['reimbursement.expense.state.ASSIGNED_TO_FINANCE_ADMIN'],
								translations['reimbursement.expense.state.TO_SIGN_BY_USER'],
								translations['reimbursement.expense.state.TO_SIGN_BY_MANAGER'],
								translations['reimbursement.expense.state.TO_SIGN_BY_FINANCE_ADMIN'],
								translations['reimbursement.expense.state.SIGNED']
							]
						}
					}
				});

				c3.generate({
					bindto: "#graph-gauge-accepted-declined",
					data: {
						type: "gauge",
						columns: [[translations['reimbursement.administration.graphs.percentagePrinted'], $scope.data.percentagePrinted]]
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
						type: 'area',
						columns: [
							[translations['reimbursement.administration.graphs.totalAmount'], $scope.data.totalAmountFirstQuarter, $scope.data.totalAmountSecondQuarter, $scope.data.totalAmountThirdQuarter, $scope.data.totalAmountFourthQuarter]]
					},
					axis: {
						x: {
							type: 'category',
							categories: [
								translations['reimbursement.administration.graphs.firstQuarter'],
								translations['reimbursement.administration.graphs.secondQuarter'],
								translations['reimbursement.administration.graphs.thirdQuarter'],
								translations['reimbursement.administration.graphs.fourthQuarter']
							]
						}
					}
				});
			}, function() {
				globalMessagesService.showGeneralError();
			});
		});
	});

}]);
