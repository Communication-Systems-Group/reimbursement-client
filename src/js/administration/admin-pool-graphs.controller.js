app.controller('AdminPoolGraphsController', ['$scope', '$timeout', 'administrationRestService', 'c3',

function($scope, $timeout, administrationRestService, c3) {
	'use strict';
	$scope.data = [];
	$scope.modData = {
		percentagePrinted: 0
	};

	administrationRestService.getExpenseStateRawData().then(function(response) {
		$scope.data = response.data;
	});

	$timeout(function() {

		calculateValues();
		console.log($scope.data);

		c3.generate({
			bindto: "#graph-donut-current-state-distribution",
			data: {
				type: 'bar',
				columns: [
					['DRAFT', $scope.data.draft || 0],
					['ASSIGNED_TO_PROF', $scope.data.assignedToProf || 0],
					['REJECTED', $scope.data.rejected || 0],
					['TO_BE_ASSIGNED', $scope.data.toBeAssigned || 0],
					['ASSIGNED_TO_FINANCE_ADMIN', $scope.data.assignedToFinanceAdmin || 0],
					['TO_SIGN_BY_USER', $scope.data.toSignByUser || 0],
					['TO_SIGN_BY_PROF', $scope.data.toSignByProf || 0],
					['TO_SIGN_BY_FINANCE_ADMIN', $scope.data.toSignByFianceAdmin || 0],
					['SIGNED', $scope.data.signed || 0]
				]
			},
			legend: {
				show: false
			}
		});
		c3.generate({
			bindto: "#graph-gauge-accepted-declined",
			data: {
				type: "gauge",
				columns: [['Printed', $scope.modData.percentagePrinted || 0]]
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
	});

	function calculateValues() {
		if ($scope.data.printed !== 0) {
			$scope.modData.percentagePrinted = ($scope.data.printed / $scope.data.totalAmountOfExpenses) * 100;
		}
	}

}]);
