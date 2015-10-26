app.factory('stateService', ['$q', 'USER', 'expenseRestService',

function($q, USER, expenseRestService) {
	"use strict";

	return {
		// returns an object with the state the current user is allowed to go
		// it expects an expense from the back-end as an argument.
		getExpenseViewDetails: function(expenseUid) {

			var deferred = $q.defer();

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

			expenseRestService.getExpense(expenseUid).then(function(response) {
				var expense = response.data;

				var belonging = {
					"isUserExpense": USER.uid === expense.userUid,
					"isManagerOfExpense": typeof expense.assignedManagerUid !== "undefined" &&
						expense.assignedManagerUid !== null &&
						USER.uid === expense.assignedManagerUid,
					"isFinanceAdminOfExpense": typeof expense.financeAdminUid !== "undefined" &&
						expense.financeAdminUid !== null &&
						USER.uid === expense.financeAdminUid
				};

				if(typeof USER.uid === "undefined" || USER.uid === null) {
					deferred.resolve(templates.noAccess);
					return;
				}
				if(!belonging.isUserExpense && !belonging.isManagerOfExpense && !belonging.isFinanceAdminOfExpense) {
					deferred.resolve(templates.noAccess);
					return;
				}

				for(var templateKey in templates) {
					if(templates.hasOwnProperty(templateKey)) {
						angular.extend(templates[templateKey], belonging);
					}
				}

				if(belonging.isUserExpense) {
					if(expense.state === 'ASSIGNED_TO_MANAGER' ||
						expense.state === 'TO_BE_ASSIGNED' ||
						expense.state === 'ASSIGNED_TO_FINANCE_ADMIN' ||
						expense.state === 'TO_SIGN_BY_MANAGER' ||
						expense.state === 'TO_SIGN_BY_FINANCE_ADMIN') {

						deferred.resolve(templates.viewExpense);
					}
					else if(expense.state === 'REJECTED' ||
						expense.state === 'DRAFT') {

						deferred.resolve(templates.editExpense);
					}
					else if(expense.state === 'TO_SIGN_BY_USER') {
						deferred.resolve(templates.signExpense);
					}
					else if(expense.state === 'SIGNED' ||
						expense.state === 'PRINTED') {

						deferred.resolve(templates.printExpense);
					}
					else {
						deferred.resolve(templates.noAccess);
					}
				}

				else if(belonging.isManagerOfExpense) {
					if(expense.state === 'REJECTED' ||
						expense.state === 'DRAFT' ||
						expense.state === 'TO_BE_ASSIGNED' ||
						expense.state === 'ASSIGNED_TO_FINANCE_ADMIN' ||
						expense.state === 'TO_SIGN_BY_USER' ||
						expense.state === 'TO_SIGN_BY_FINANCE_ADMIN' ||
						expense.state === 'SIGNED') {

						deferred.resolve(templates.viewExpense);
					}
					else if(expense.state === 'ASSIGNED_TO_MANAGER') {
						deferred.resolve(templates.reviewExpense);
					}
					else if(expense.state === 'TO_SIGN_BY_MANAGER') {
						deferred.resolve(templates.signExpense);
					}
					else if(expense.state === 'PRINTED') {
						deferred.resolve(templates.printExpense);
					}
					else {
						deferred.resolve(templates.noAccess);
					}
				}

				else if(belonging.isFinanceAdminOfExpense) {
					if(expense.state === 'REJECTED' ||
						expense.state === 'DRAFT' ||
						expense.state === 'ASSIGNED_TO_MANAGER' ||
						expense.state === 'TO_SIGN_BY_USER' ||
						expense.state === 'TO_SIGN_BY_MANAGER' ||
						expense.state === 'SIGNED') {

						deferred.resolve(templates.viewExpense);
					}
					else if(expense.state === 'TO_BE_ASSIGNED') {
						deferred.resolve(templates.assignToMe);
					}
					else if(expense.state === 'ASSIGNED_TO_FINANCE_ADMIN') {
						deferred.resolve(templates.reviewExpense);
					}
					else if(expense.state === 'TO_SIGN_BY_FINANCE_ADMIN') {
						deferred.resolve(templates.signExpense);
					}
					else if(expense.state === 'SIGNED') {
						deferred.resolve(templates.printExpense);
					}
					else {
						deferred.resolve(templates.noAccess);
					}
				}

				// should not be possible to reach this branch
				else {
					deferred.resolve(templates.noAccess);
				}

			}, function(response) {
				response.errorHandled = true;
				deferred.resolve(templates.noAccess);
			});

			return deferred.promise;
		}
	};

}]);
