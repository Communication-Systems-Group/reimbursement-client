app.factory('stateService', ['$q', 'USER',

function($q, USER) {
	"use strict";

	return {
		// returns an object with the state the current user is allowed to go
		// it expects the state and the 3 users of an expense (uid) from the
		// back-end as an argument.
		getExpenseViewDetails: function(expenseState, expenseUsers) {

			var templates = {
				noAccess: {
					hasAccess: false
				},
				editExpense: {
					hasAccess: true,
					name: "edit-expense"
				},
				viewExpense: {
					hasAccess: true,
					name: "view-expense"
				},
				reviewExpense: {
					hasAccess: true,
					name: "review-expense"
				},
				signExpense: {
					hasAccess: true,
					name: "sign-expense"
				},
				printExpense: {
					hasAccess: true,
					name: "print-expense"
				},
				assignToMe: {
					hasAccess: false,
					name: "assign-to-me"
				}
			};

			var belonging = {
				"isUserExpense": USER.uid === expenseUsers.userUid,
				"isManagerOfExpense": typeof expenseUsers.assignedManagerUid !== "undefined" &&
					expenseUsers.assignedManagerUid !== null &&
					USER.uid === expenseUsers.assignedManagerUid,
				"isFinanceAdminOfExpense": typeof expenseUsers.financeAdminUid !== "undefined" &&
					expenseUsers.financeAdminUid !== null &&
					USER.uid === expenseUsers.financeAdminUid
			};

			if ( typeof USER.uid === "undefined" || USER.uid === null) {
				return templates.noAccess;
			}
			if ( typeof expenseUsers.userUid === "undefined" || expenseUsers.userUid === null) {
				return templates.noAccess;
			}

			for (var templateKey in templates) {
				if (templates.hasOwnProperty(templateKey)) {
					angular.extend(templates[templateKey], belonging);
				}
			}

			if (belonging.isUserExpense) {
				if (expenseState === 'ASSIGNED_TO_MANAGER' ||
					expenseState === 'TO_BE_ASSIGNED' ||
					expenseState === 'ASSIGNED_TO_FINANCE_ADMIN' ||
					expenseState === 'TO_SIGN_BY_MANAGER' ||
					expenseState === 'TO_SIGN_BY_FINANCE_ADMIN') {

					return templates.viewExpense;
				} else if (expenseState === 'REJECTED' || expenseState === 'DRAFT') {

					return templates.editExpense;
				} else if (expenseState === 'TO_SIGN_BY_USER') {

					return templates.signExpense;
				} else if (expenseState === 'SIGNED' || expenseState === 'PRINTED') {

					return templates.printExpense;
				} else {
					return templates.noAccess;
				}
			} else if (belonging.isManagerOfExpense && (USER.hasRole('PROF') || USER.hasRole('DEPARTMENT_MANAGER'))) {
				if (expenseState === 'REJECTED' ||
					expenseState === 'DRAFT' ||
					expenseState === 'TO_BE_ASSIGNED' ||
					expenseState === 'ASSIGNED_TO_FINANCE_ADMIN' ||
					expenseState === 'TO_SIGN_BY_USER' ||
					expenseState === 'TO_SIGN_BY_FINANCE_ADMIN' ||
					expenseState === 'SIGNED') {

					return templates.viewExpense;
				} else if (expenseState === 'ASSIGNED_TO_MANAGER') {
					return templates.reviewExpense;
				} else if (expenseState === 'TO_SIGN_BY_MANAGER') {
					return templates.signExpense;
				} else if (expenseState === 'PRINTED') {
					return templates.printExpense;
				} else {
					return templates.noAccess;
				}
			} else if (belonging.isFinanceAdminOfExpense && USER.hasRole('FINANCE_ADMIN')) {
				if (expenseState === 'REJECTED' ||
					expenseState === 'DRAFT' ||
					expenseState === 'ASSIGNED_TO_MANAGER' ||
					expenseState === 'TO_SIGN_BY_USER' ||
					expenseState === 'TO_SIGN_BY_MANAGER' ||
					expenseState === 'SIGNED') {

					return templates.viewExpense;
				} else if (expenseState === 'TO_BE_ASSIGNED') {
					return templates.assignToMe;
				} else if (expenseState === 'ASSIGNED_TO_FINANCE_ADMIN') {
					return templates.reviewExpense;
				} else if (expenseState === 'TO_SIGN_BY_FINANCE_ADMIN') {
					return templates.signExpense;
				} else if (expenseState === 'PRINTED') {
					return templates.assignToMe;
				} else {
					return templates.noAccess;
				}
			} else if (!belonging.isFinanceAdminOfExpense && USER.hasRole('FINANCE_ADMIN')) {
				if (expenseState === 'TO_BE_ASSIGNED' ||
					expenseState === 'PRINTED') {

					return templates.assignToMe;
				}
			}

			return templates.noAccess;
		},

		// returns a number, which is a combination of the expense state
		// and the expense date, ordered by the order purpose
		stateOrder: function(state, date, purpose) {
			var statesList = {
				forRegularUser: ["DRAFT",
					"REJECTED",
					"TO_SIGN_BY_USER",
					"SIGNED",
					"ASSIGNED_TO_MANAGER",
					"TO_BE_ASSIGNED",
					"ASSIGNED_TO_FINANCE_ADMIN",
					"TO_SIGN_BY_MANAGER",
					"TO_SIGN_BY_FINANCE_ADMIN",
					"PRINTED"
				],
				forManager: ["ASSIGNED_TO_MANAGER",
					"TO_SIGN_BY_MANAGER",
					"TO_BE_ASSIGNED",
					"ASSIGNED_TO_FINANCE_ADMIN",
					"TO_SIGN_BY_USER",
					"TO_SIGN_BY_FINANCE_ADMIN",
					"REJECTED",
					"DRAFT",
					"SIGNED",
					"PRINTED"
				],
				forFinanceAdmin: ["TO_BE_ASSIGNED",
					"ASSIGNED_TO_FINANCE_ADMIN",
					"TO_SIGN_BY_FINANCE_ADMIN",
					"REJECTED",
					"ASSIGNED_TO_MANAGER",
					"TO_SIGN_BY_USER",
					"TO_SIGN_BY_MANAGER",
					"DRAFT",
					"SIGNED",
					"PRINTED"
				]
			};

			function orderNumber(states) {
				var stateNr = states.length - states.indexOf(state);
				var shortDate = (date + "").substring(0, (date + "").length - 3);
				return parseInt("-" + stateNr + shortDate, 10);
			}

			if (purpose === 'MANAGER') {
				return orderNumber(statesList.forManager);
			} else if (purpose === 'FINANCE_ADMIN') {
				return orderNumber(statesList.forFinanceAdmin);
			} else {
				return orderNumber(statesList.forRegularUser);
			}
		},

		getStateListWorkflow: function() {
			return ["DRAFT",
				"ASSIGNED_TO_MANAGER",
				"TO_BE_ASSIGNED",
				"ASSIGNED_TO_FINANCE_ADMIN",
				"TO_SIGN_BY_USER",
				"TO_SIGN_BY_MANAGER",
				"TO_SIGN_BY_FINANCE_ADMIN",
				"SIGNED",
				"PRINTED"
			];
		}
	};

}]);
