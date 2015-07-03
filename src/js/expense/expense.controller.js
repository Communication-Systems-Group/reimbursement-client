/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', '$filter', '$state', '$stateParams', '$modal',

	function ($scope, $filter, $state, $stateParams, $modal) {
		"use strict";

		function find(obj, id) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].id === id) {
					return [i, obj[i]];
				}
			}
		}

		$scope.getTotal = function () {
			var total = 0;

			for (var i = 0; i < $scope.expense.receipts.length; i++) {
				total += parseFloat($scope.expense.receipts[i].amount.value);
			}

			$scope.total = total;
		};

		// ToDo refactor with globalmessageservice
		$scope.alert = {
			info: {
				state: true,
				value: $filter('translate')('reimbursement.expense.info')
			},
			success: {
				state: false,
				value: 'blabla'
			},
			danger: {
				state: false,
				value: 'blabla'
			}
		};

		$scope.expenseId = $stateParams.id;
		$scope.receiptChanges = false;

		$scope.note = '';

		/**
		 * Initalize empty expense object
		 * @type {{id: number, creator: {name: string}, contact: {person: {name: string}, phone: string}, accounting: string, note: Array, receipts: Array}}
		 */
		$scope.expense = {
			id: 1,
			creator: {
				name: ''
			},
			contact: {
				person: {
					name: ''
				},
				phone: ''
			},
			accounting: '',
			note: [
				{
					date: '2015-05-11T18:00:00.000+02:00',
					person: {
						ldap_id: 20,
						name: 'Burkhard Stiller'
					},
					text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
				},

				{
					date: '2015-03-12T15:12:00.000+02:00',
					person: {
						ldap_id: 23,
						name: 'Jens Meier'
					},
					text: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
				},
				{
					date: '2015-05-12T16:30:00.000+02:00',
					person: {
						ldap_id: 23,
						name: 'Jens Meier'
					},
					text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
				}
			],
			receipts: []
		};

		$scope.getTotal();

		$scope.uploadReceipt = function () {
			// ToDo
		};

		$scope.addNewReceipt = function () {
			var receipt_id = 1;
			if ($scope.expense.receipts.length > 0) {
				receipt_id = $scope.expense.receipts[($scope.expense.receipts.length - 1)].id + 1;
			}
			$scope.receipt = {
				id: receipt_id,
				date_receipt: null,
				account: null,
				description: '',
				amount: {
					original: '',
					currency: 'CHF',
					exchange_rate: '1.00',
					value: ''
				},
				cost_center: {
					prefix: 'E-1000',
					value: ''
				}
			};

			$scope.modalReceipt = $modal.open({
				templateUrl: 'expense/receipt.tpl.html',
				controller: 'ReceiptController',
				scope: $scope
			});
		};

		$scope.documentExistsForExpense = function (receipt_id) {
			for (var i = 0; i < $scope.expense.documents.length; i++) {
				if ($scope.expense.documents[i].belongs_to_receipt.indexOf(receipt_id) !== -1) {
					return true;
				}
			}
			return false;
		};


		$scope.alert = {
			info: {
				state: true,
				value: $filter('translate')('reimbursement.expense.info')
			},
			success: {
				state: false,
				value: 'blabla'
			},
			danger: {
				state: false,
				value: 'blabla'
			}
		};

		$scope.accounts = [306020, 306900, 310010, 310040, 310050, 312000, 313000, 313010, 313020, 320240, 320250, 321200, 322000, 322020, 322040, 325050, 325060, 325070, 326000, 329000, 329100, 330000];

//		$scope.expense = {
//			id: 1,
//			creator: {
//				ldap_id: 23,
//				name: 'Jens Meier'
//			},
//			contact: {
//				person: {
//					ldap_id: 3,
//					name: 'Claudia Leibundgut'
//				},
//				phone: '044 786 23 45'
//			},
//			accounting: 'Reise nach New York',
//			note: [
//				{
//					date: '2015-03-11T18:00:00.000+02:00',
//					person: {
//						ldap_id: 20,
//						name: 'Burkhard Stiller'
//					},
//					text: 'Es fehlen noch die Belege fÃƒÂ¼r das Abendessen im Fridays!'
//				},
//				{
//					date: '2015-03-12T16:30:00.000+02:00',
//					person: {
//						ldap_id: 23,
//						name: 'Jens Meier'
//					},
//					text: 'Habe die Belege hinzugefÃƒÂ¼gt'
//				}
//			],
//			receipts: [
//				{
//					id: 1,
//					date_receipt: '2015-01-13T18:00:00.000+02:00',
//					account: '310050',
//					description: 'Schwimmen im Hudson',
//					amount: '220.20',
//					cost_center: 'E-10000-01-01'
//				},
//				{
//					id: 2,
//					date_receipt: '2015-01-10T18:00:00.000+02:00',
//					account: '329100',
//					description: 'Flight ZRH => JFK',
//					amount: '1210.20',
//					cost_center: 'E-10000-01-01'
//				},
//				{
//					id: 3,
//					date_receipt: '2015-01-14T18:00:00.000+02:00',
//					account: '329100',
//					description: 'Flight JFK => ZRH',
//					amount: '1210.20',
//					cost_center: 'E-10000-01-01'
//				},
//				{
//					id: 4,
//					date_receipt: '2015-01-14T19:00:00.000+02:00',
//					account: '313020',
//					description: 'Zeichenblock',
//					amount: '10.20',
//					cost_center: 'E-10000-01-01'
//				}
//			],
//			documents: [
//				{
//					url: 'url_to_pdf_doc',
//					belongs_to_receipt: [2, 3]
//				},
//				{
//					url: 'url_to_pdf_doc',
//					belongs_to_receipt: [1]
//				}
//			]
//		};

		$scope.deleteReceipt = function (receipt_id) {
			var receipt = find($scope.expense.receipts, receipt_id);
			var confirm = window.confirm($filter('translate')('reimbursement.expense.delete_text', {
				name: receipt[1].description.substr(0, 25)
			}));


			if (confirm) {
				$scope.receiptChanges = true;
				$scope.expense.receipts.splice(receipt[0], 1);
				$scope.getTotal();
			}
		};

		$scope.saveExpense = function (form) {
			if (form.$dirty) {
				$scope.alert.danger.state = true;
				$scope.alert.danger.value = $filter('translate')('reimbursement.expense.dirty_form');
			} else {
				//ToDo save expense
			}
		};

		$scope.cancel = function (form) {
			if (!form.$pristine || $scope.receiptChanges) {
				var confirm = confirm($filter('transalte')('reimbursement.expense.confirm_cancel_unsaved_changes'));

				var myModal = $modal({title: 'My Title', content: 'My Content', show: true});
				myModal.show();
				if (confirm) {
					$state.go('dashboard');
				}
			}
		};

	}]);