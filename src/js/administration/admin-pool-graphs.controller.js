app.controller('AdminPoolGraphsController', ['administrationRestService', 'c3',

function(administrationRestService, c3) {
	'use strict';
	var data = [];

	administrationRestService.getExpenseStateRawData().then(function(response) {
		data = response.data;
		console.log(data);
	});

	c3.generate({
		bindto: "#graph-donut-current-state-distribution",
		data: {
			type: 'donut',
			columns: [
				['DRAFT', 10],
				['ASSIGNED_TO_PROF', 20],
				['REJECTED', 30],
				['TO_BE_ASSIGNED', 40],
				['ASSIGNED_TO_FINANCE_ADMIN', 50],
				['TO_SIGN_BY_USER', 60],
				['TO_SIGN_BY_PROF', 70],
				['TO_SIGN_BY_FINANCE_ADMIN', 80],
				['SIGNED', 90]
				//['PRINTED', 100]
			]
		},
		legend: { show: false }
	});

	c3.generate({
		bindto: "#graph-gauge-accepted-declined",
		data: {
			type: "gauge",
			columns: [
				['data', 61.4],
			]
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
			columns: [
				['x', '2015-01-01', '2015-02-01', '2015-03-01', '2015-04-01', '2015-05-01', '2015-06-01', '2015-07-01', '2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01'],
				['finished', 5, 20, 40, 20, 40, 50, 70, 80, 101, 120, 140],
				['not-yet-finished', 20, 30, 40, 20, 30, 80, 90, 40, 30, 20, 10]
			],
			groups: [[ 'finished', 'not-yet-finished' ]]
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

}]);
