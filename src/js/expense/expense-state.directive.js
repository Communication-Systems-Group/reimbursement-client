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
						"icon": 'fa-file-o',
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.draft'
					},
					'ASSIGNED_TO_PROF': {
						"icon": 'fa-graduation-cap',
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.assigned_to_professor'
					},
					'TO_BE_ASSIGNED': {
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.to_be_assigned'
					},
					'ASSIGNED_TO_FINANCE_ADMIN': {
						"icon": 'fa-money',
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.assigned_to_finance_admin'
					},
					'REJECTED': {
						"icon": 'fa-times-circle-o',
						"class": 'label-danger',
						"translate": 'reimbursement.expense.state.rejected'
					},
                    'SIGNED': {
                        "icon": 'fa-check-square',
                        "class": 'label-success',
                        "translate": 'reimbursement.expense.state.signed'
                    },
					'PRINTED': {
						"icon": 'fa-print',
						"class": 'label-success',
						"translate": 'reimbursement.expense.state.printed'
					},
					'TO_SIGN_BY_USER': {
						"icon": 'fa-pencil',
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.toSignByUser'
					},
					'TO_SIGN_BY_PROF': {
						"icon": 'fa-pencil',
						"class": 'label-info',
						"translate": 'reimbursement.expense.state.toSignByProf'
					},
					'TO_SIGN_BY_FINANCE_ADMIN': {
						"icon": 'fa-pencil',
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