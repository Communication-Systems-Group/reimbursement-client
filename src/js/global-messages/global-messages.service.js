app.factory("globalMessagesService", ['$uibModal', '$translate', '$q',

	function ($uibModal, $translate, $q) {
		"use strict";

		var openModalInstances = [];

		// modal without confirmation (yes or no)
		function show(type, title, message, isMd) {

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
				var openModal = $uibModal.open({
					templateUrl: templateUrl,
					controller: 'GlobalMessagesController',
					size: isMd ? 'md' : 'sm',
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
		function confirm(type, title, message, yes, no, isMd) {
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
				var openModal = $uibModal.open({
					templateUrl: templateUrl,
					controller: 'GlobalMessagesConfirmController',
					size: isMd ? 'md' : 'sm',
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
		function showErrorMd(title, message) {
			return show('error', title, message, true);
		}
		function showWarningMd(title, message) {
			return show('warning', title, message, true);
		}
		function showInfoMd(title, message) {
			return show('info', title, message, true);
		}
		function confirmErrorMd(title, message, yes, no) {
			return confirm('error', title, message, yes, no, true);
		}
		function confirmWarningMd(title, message, yes, no) {
			return confirm('warning', title, message, yes, no, true);
		}
		function confirmInfoMd(title, message, yes, no) {
			return confirm('info', title, message, yes, no, true);
		}


		function hideMessages() {
			for (var instance in openModalInstances) {
				if (openModalInstances.hasOwnProperty(instance)) {
					openModalInstances[instance].dismiss();
				}
			}
			openModalInstances = [];
		}

		return {

			showError: showError,
			showWarning: showWarning,
			showInfo: showInfo,
			confirmError: confirmError,
			confirmWarning: confirmWarning,
			confirmInfo: confirmInfo,
			showErrorMd: showErrorMd,
			showWarningMd: showWarningMd,
			showInfoMd: showInfoMd,
			confirmErrorMd: confirmErrorMd,
			confirmWarningMd: confirmWarningMd,
			confirmInfoMd: confirmInfoMd,
			hideMessages: hideMessages,
			showGeneralError: function () {
				return showError("reimbursement.globalMessage.ServiceException.title",
					"reimbursement.globalMessage.ServiceException.message");
			}

		};

	}
]);
