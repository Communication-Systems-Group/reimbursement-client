app.controller('SettingsController', ['$scope', '$state', '$timeout', 'settingsRestService', 'USER', 'globalMessagesService',

function($scope, $state, $timeout, settingsRestService, USER, globalMessagesService) {
	'use strict';
	$scope.languages = [];

	settingsRestService.getSupportedLanguages().then(function(response) {
		$scope.languages = response.data;
		$timeout(function() {
			$scope.selectedLanguage = USER.language;
		});
	});
	$scope.saveLanguage = function() {
		settingsRestService.putLanguage($scope.selectedLanguage).then(function() {
			globalMessagesService.showInfo('reimbursement.settings.language.submitInfoTitle', 'reimbursement.settings.language.submitInfoMessage');
		});
	};
	$scope.newSignature = function() {
		$state.go('signature');
	};
}]);
