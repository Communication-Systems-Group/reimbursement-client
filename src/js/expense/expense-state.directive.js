app.directive('expenseState',

	function () {
		"use strict";

		return {
			restrict: 'E',
			replace: true,
			scope: {
				state: '='
			},
			templateUrl: 'expense/state-expense.tpl.html',
			link: function (scope) {
				scope.states = {
					'DRAFT': {
						icon: 'fa-file-o',
						class: 'label-info',
						translate: 'reimbursement.expense.state.draft'
					},
					'ASSIGNED_TO_PROFESSOR': {
						icon: 'fa-graduation-cap',
						class: 'label-info',
						translate: 'reimbursement.expense.state.assigned_to_professor'
					},
					'ASSIGNED_TO_FINANCE_ADMIN': {
						icon: 'fa-money',
						class: 'label-info',
						translate: 'reimbursement.expense.state.assigned_to_finance_admin'
					},
					'ACCEPTED': {
						icon: 'fa-check-circle-o',
						class: 'label-success',
						translate: 'reimbursement.expense.state.accepted'
					},
					'REJECTED': {
						icon: 'fa-times-circle-o',
						class: 'label-danger',
						translate: 'reimbursement.expense.state.rejected'
					},
					'PRINTED': {
						icon: 'fa-print',
						class: 'label-success',
						translate: 'reimbursement.expense.state.printed'
					}
				};

				scope.$watch('state', function (data) {
					scope.expenseState = scope.states[data];
				});
			}
		};
	});


app.directive('expenseStateButton', function(USER) {

	"use strict";

	return {
		restrict: 'E',
		scope: {
			uid: '=',
			state: '='
		},
		templateUrl: 'expense/state-button-expense.tpl.html',
		link: function(scope) {

			scope.$watch('[uid, state]', function (data) {
				scope.uid = data[0];

				scope.showValidate = false;
				if(USER.hasRole('PROF')) {
					if(data[1] === 'ASSIGNED_TO_PROFESSOR') {
						scope.showValidate = true;
					}
				}

				if(USER.hasRole('FINANCE_ADMIN')) {
					if(data[1] === 'ASSIGNED_TO_FINANCE_ADMIN') {
						scope.showValidate = true;
					}
				}
			});
		}
	};

});