app.factory("globalMessagesService", ['$modal', '$translate',

	function ($modal, $translate) {
		"use strict";

		var openModalInstances = [];

		function showError(title, message) {
			$translate([title, message]).then(function (translations) {
				openModalInstances.push($modal.open({
					templateUrl: 'global-messages/global-error.tpl.html',
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
				}));
			});
		}

		function showWarning(title, message) {
			$translate([title, message]).then(function (translations) {
				openModalInstances.push($modal.open({
					templateUrl: 'global-messages/global-warning.tpl.html',
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
				}));
			});
		}

		function showInfo(title, message) {
			$translate([title, message]).then(function (translations) {
				openModalInstances.push($modal.open({
					templateUrl: 'global-messages/global-info.tpl.html',
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
				}));
			});
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
			hideMessages: hideMessages,
			showGeneralError: function () {
				showError("reimbursement.globalMessage.ServiceException.title",
					"reimbursement.globalMessage.ServiceException.message");
			},
			isServerErrorMessages: isServerErrorMessages
		};

	}
]);
