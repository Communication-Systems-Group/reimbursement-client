app.factory("globalMessagesService", ['$modal', '$translate', '$q',

	function ($modal, $translate, $q) {
		"use strict";

		var openModalInstances = [];

		// modal without confirmation (yes or no)
		function show(type, title, message) {

			var templateUrl;
			if(type === 'error') {
				templateUrl = 'global-messages/global-error.tpl.html';
			}
			else if(type === 'warning') {
				templateUrl = 'global-messages/global-warning.tpl.html';
			}
			else if(type === 'info') {
				templateUrl = 'global-messages/global-info.tpl.html';
			}
			else {
				return;
			}

			var deferred = $q.defer();

			$translate([title, message]).then(function (translations) {
				var openModal = $modal.open({
					templateUrl: templateUrl,
					controller: 'GlobalMessagesController',
					size: 'sm',
					resolve: {
						title: function () {
							return translations[title];
						},
						message: function () {
							return translations[message];
						}
					}
				});

				openModalInstances.push(openModal);
				openModal.result.then(function() {
					deferred.resolve();
				}, function() {
					deferred.reject();
				});
			});

			return deferred.promise;
		}

		// modal with confirmation (yes or no)
		function confirm(type, title, message, yes, no) {
			yes = yes || "reimbursement.globalMessages.acceptButton";
			no = no || "reimbursement.globalMessages.denyButton";

			var templateUrl;
			if(type === "error") {
				templateUrl = 'global-messages/global-error-confirm.tpl.html';
			}
			else if(type === "warning") {
				templateUrl = 'global-messages/global-warning-confirm.tpl.html';
			}
			else if(type === "info") {
				templateUrl = 'global-messages/global-info-confirm.tpl.html';
			}
			else {
				return;
			}

			var deferred = $q.defer();
			$translate([title, message, yes, no]).then(function (translations) {
				var openModal = $modal.open({
					templateUrl: templateUrl,
					controller: 'GlobalMessagesConfirmController',
					size: 'sm',
					resolve: {
						title: function() {
							return translations[title];
						},
						message: function() {
							return translations[message];
						},
						yes: function() {
							return translations[yes];
						},
						no: function() {
							return translations[no];
						}
					}
				});

				openModalInstances.push(openModal);
				openModal.result.then(function() {
					deferred.resolve();
				}, function() {
					deferred.reject();
				});
			});

			return deferred.promise;
		}

		function showError(title, message) {
			return show('error', title, message);
		}
		function showWarning(title, message) {
			return show('warning', title, message);
		}
		function showInfo(title, message) {
			return show('info', title, message);
		}
		function confirmError(title, message, yes, no) {
			return confirm('error', title, message, yes, no);
		}
		function confirmWarning(title, message, yes, no) {
			return confirm('warning', title, message, yes, no);
		}
		function confirmInfo(title, message, yes, no) {
			return confirm('info', title, message, yes, no);
		}

		function hideMessages() {
			for (var instance in openModalInstances) {
				if (openModalInstances.hasOwnProperty(instance)) {
					openModalInstances[instance].dismiss();
				}
			}
			openModalInstances = [];
		}

		/**
		 * Checks if a 5xx error occurred and shoes an error message.
		 * Returns true if a server error message was catched; false if not
		 * @param statusCode
		 * @return boolean
		 */
		function isServerErrorMessages(statusCode, callback) {
			if (statusCode.toString()[0] === '5') {
				showError("reimbursement.globalMessage.ServerException.title",
					"reimbursement.globalMessage.ServerException.message");
				callback(true);
			} else {
				callback(false);
			}
		}

		return {

			showError: showError,
			showWarning: showWarning,
			showInfo: showInfo,
			confirmError: confirmError,
			confirmWarning: confirmWarning,
			confirmInfo: confirmInfo,

			hideMessages: hideMessages,
			showGeneralError: function () {
				showError("reimbursement.globalMessage.ServiceException.title",
					"reimbursement.globalMessage.ServiceException.message");
			},
			isServerErrorMessages: isServerErrorMessages

		};

	}
]);
