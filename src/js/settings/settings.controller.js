app.controller('SettingsController', ['$scope', 'settingsRestService', 'USER',

function($scope, settingsRestService, USER) {
	'use strict';
	$scope.form={};
	$scope.languages = [];
	// $scope.selectedLanguage=USER.language;
	USER.test=1;

	settingsRestService.getSupportedLanguages().then(function(response){
		$scope.languages=response.data;
		$scope.form.selectedLanguage='EN';
		console.log($scope.selectedLanguage);
	});
}]);
