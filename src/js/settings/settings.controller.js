app.controller('SettingsController', ['$scope', '$timeout', 'settingsRestService', 'USER',

function($scope, $timeout, settingsRestService, USER) {
	'use strict';
	$scope.languages = [];
	// $scope.selectedLanguage=USER.language;
	USER.test=1;

	settingsRestService.getSupportedLanguages().then(function(response){
		$scope.languages = response.data;
		$timeout(function() {
			$scope.selectedLanguage = 'EN';
		});
	});
}]);
