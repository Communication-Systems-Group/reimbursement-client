app.controller('PrintExpenseController', ['$scope', '$state', '$stateParams', 'expenseRestService', 'globalMessagesService',

	function ($scope, $state, $stateParams, expenseRestService, globalMessagesService) {
		"use strict";

		$scope.expenseUid = $stateParams.uid;
		$scope.expenseItems = [];
		$scope.expenseState = '';

        expenseRestService.getExpense($scope.expenseUid).then(function (response) {
            $scope.expenseAccountingText = response.data.accounting;
            $scope.expenseState = response.data.state;
        });

        $scope.showPdf = function() {
            globalMessagesService.confirmInfoMd("reimbursement.expense.printWithSignature",
                    "reimbursement.expense.printWithSignatureMessage")
                .then(function() {
                    var data = {showSignature: true};
                    expenseRestService.getExpensePdf($scope.expenseUid, data).then();

                    // ToDo show sent document from server
                })
                .catch(function() {
                    var data = {showSignature: true};
                    expenseRestService.getExpensePdf($scope.expenseUid, data).then();

                    // ToDo show sent document from server
                });
        };

	}]);
