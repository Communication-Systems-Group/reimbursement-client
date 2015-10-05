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
			link: function (scope) {
				scope.states = {
					'DRAFT': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.draft'
					},
					'ASSIGNED_TO_PROF': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.assigned_to_professor'
					},
					'TO_BE_ASSIGNED': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.to_be_assigned'
					},
					'ASSIGNED_TO_FINANCE_ADMIN': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.assigned_to_finance_admin'
					},
					'REJECTED': {
						"class": 'label-danger',
						"translate": 'reimbursement.expense.state.rejected'
					},
					'SIGNED': {
						"class": 'label-success',
						"translate": 'reimbursement.expense.state.signed'
					},
					'PRINTED': {
						"class": 'label-success',
						"translate": 'reimbursement.expense.state.printed'
					},
					'TO_SIGN_BY_USER': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.toSignByUser'
					},
					'TO_SIGN_BY_PROF': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.toSignByProf'
					},
					'TO_SIGN_BY_FINANCE_ADMIN': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.toSignByFinanceAdmin'
					}
				};

				scope.$watch('state', function (data) {
					scope.expenseState = scope.states[data];
				});
			}
		};
	});