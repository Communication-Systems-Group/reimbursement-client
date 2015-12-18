app.controller('AdminPoolGraphsController', ['$scope', '$timeout', '$translate', 'globalMessagesService', 'administrationRestService', 'c3',

function($scope, $timeout, $translate, globalMessagesService, administrationRestService, c3) {
	'use strict';

	$scope.data = [];
	$scope.activeSlide = {};
	$scope.dataReady = false;
	var charts = {
		chart1: null,
		chart2: null,
		chart3: null
	};

	$scope.$watch('activeSlide.slide1', function(slide1) {
		if(slide1) {
			if(charts.chart1 !== null) {
				charts.chart1.destroy();
			}
			$timeout(function() {
				charts.chart1 = generateGraphAreaStepCurrentStateDistribution();
			});
		}
	});
	$scope.$watch('activeSlide.slide2', function(slide2) {
		if(slide2) {
			if(charts.chart2 !== null) {
				charts.chart2.destroy();
			}
			$timeout(function() {
				charts.chart2 = generateGraphGaugeAcceptedDeclined();
			});
		}
	});
	$scope.$watch('activeSlide.slide3', function(slide3) {
		if(slide3) {
			if(charts.chart3 !== null) {
				charts.chart3.destroy();
			}
			$timeout(function() {
				charts.chart3 = generateGraphLineSumCurrentYear();
			});
		}
	});

	var allTranslations = [];

	function generateGraphAreaStepCurrentStateDistribution() {
		return c3.generate({
			bindto: "#graph-area-step-current-state-distribution",
			data: {
				type: 'area-step',
				columns: [
					['Expenses in this state', $scope.data.draft, $scope.data.assignedToManager, $scope.data.toBeAssigned, $scope.data.assignedToFinanceAdmin, $scope.data.toSignByUser, $scope.data.toSignByManager, $scope.data.toSignByFinanceAdmin, $scope.data.signed, $scope.data.printed]
				]
			},
			legend: {
				show: false
			},
			axis: {
				x: {
					type: 'category',
					categories: [
						allTranslations['reimbursement.expense.state.DRAFT'],
						allTranslations['reimbursement.expense.state.ASSIGNED_TO_MANAGER'],
						allTranslations['reimbursement.expense.state.TO_BE_ASSIGNED'],
						allTranslations['reimbursement.expense.state.ASSIGNED_TO_FINANCE_ADMIN'],
						allTranslations['reimbursement.expense.state.TO_SIGN_BY_USER'],
						allTranslations['reimbursement.expense.state.TO_SIGN_BY_MANAGER'],
						allTranslations['reimbursement.expense.state.TO_SIGN_BY_FINANCE_ADMIN'],
						allTranslations['reimbursement.expense.state.SIGNED'],
						allTranslations['reimbursement.expense.state.PRINTED']
					]
				}
			}
		});
	}

	function generateGraphGaugeAcceptedDeclined() {
		return c3.generate({
			bindto: "#graph-gauge-accepted-declined",
			data: {
				type: "gauge",
				columns: [[allTranslations['reimbursement.expense.state.ARCHIVED'], $scope.data.percentageArchived]]
			},
			color: {
				pattern: ['#ff0000', '#f97600', '#f6c600', '#60b044'],
				threshold: {
					values: [70, 80, 90, 100]
				}
			}
		});
	}

	function generateGraphLineSumCurrentYear() {
		var data = $scope.data.monthlyTotalAmounts;
		var keys = [];
		var values = [];
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				keys.push(key);
				values.push(data[key]);
			}
		}

		return c3.generate({
			bindto: "#graph-line-sum-current-year",
			data: {
				type: 'area',
				columns: [
					[allTranslations['reimbursement.administration.graphs.totalAmount']].concat(values)
				]
			},
			axis: {
				x: {
					type: 'category',
					categories: keys
				}
			}
		});
	}

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
			'reimbursement.expense.state.PRINTED',
			'reimbursement.expense.state.ARCHIVED',
			'reimbursement.administration.graphs.totalAmount']).then(function(translations) {

				allTranslations = translations;
				$scope.dataReady = true;

			}, function() {
				globalMessagesService.showGeneralError();
			});
		});
	});

}]);
