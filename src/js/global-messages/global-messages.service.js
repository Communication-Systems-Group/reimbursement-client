app.factory("globalMessagesService", ['$modal', '$translate',

function($modal, $translate) {
	"use strict";

	var openModalInstances = [];

	function showError(title, message) {
		$translate([title, message]).then(function(translations) {
			openModalInstances.push($modal.open({
				templateUrl: 'global-messages/global-error.tpl.html',
				controller: 'GlobalMessagesController',
				size: 'sm',
				resolve: {
					title: function() {
						return translations[title];
					},
					message: function() {
						return translations[message];
					}
				}
			}));
		});
	}

	function showWarning(title, message) {
		$translate([title, message]).then(function(translations) {
			openModalInstances.push($modal.open({
				templateUrl: 'global-messages/global-warning.tpl.html',
				controller: 'GlobalMessagesController',
				size: 'sm',
				resolve: {
					title: function() {
						return translations[title];
					},
					message: function() {
						return translations[message];
					}
				}
			}));
		});
	}

	function showInfo(title, message) {
		$translate([title, message]).then(function(translations) {
			openModalInstances.push($modal.open({
				templateUrl: 'global-messages/global-info.tpl.html',
				controller: 'GlobalMessagesController',
				size: 'sm',
				resolve: {
					title: function() {
						return translations[title];
					},
					message: function() {
						return translations[message];
					}
				}
			}));
		});
	}

	function hideMessages() {
		for(var instance in openModalInstances) {
			if(openModalInstances.hasOwnProperty(instance)) {
				openModalInstances[instance].dismiss();
			}
		}
		openModalInstances = [];
	}

	return {
		showError: showError,
		showWarning: showWarning,
		showInfo: showInfo,
		hideMessages: hideMessages
	};

}]);
