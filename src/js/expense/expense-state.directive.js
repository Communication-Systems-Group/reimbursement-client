app.directive('expenseState',

	function () {
		"use strict";

		return {
			restrict: 'E',
			scope: true,
			templateUrl: 'expense/state-expense.tpl.html',
			link: function (scope, elem, attrs) {
				scope.states = {
					'DRAFT': {
						class: 'label-info',
						translate: 'reimbursement.expense.state.draft'
					},
					'ASSIGNED_TO_PROFESSOR': {
						class: 'label-info',
						translate: 'reimbursement.expense.state.assigned_to_professor'
					},
					'ASSIGNED_TO_FINANCE_ADMIN': {
						class: 'label-info',
						translate: 'reimbursement.expense.state.assigned_to_finance_admin'
					},
					'ACCEPTED': {
						class: 'label-success',
						translate: 'reimbursement.expense.state.accepted'
					},
					'REJECTED': {
						class: 'label-danger',
						translate: 'reimbursement.expense.state.rejected'
					},
					'PRINTED': {
						class: 'label-success',
						translate: 'reimbursement.expense.state.printed'
					}
				};

				scope.state = scope.states[attrs.state];
			}
		};
	});