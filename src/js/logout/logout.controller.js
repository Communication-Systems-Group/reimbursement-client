app.controller('LogoutController', ['$scope', '$timeout', 'logoutRestService', 'globalMessagesService', 'spinnerService',

function($scope, $timeout, logoutRestService, globalMessagesService, spinnerService) {
	"use strict";

	$scope.success = false;
	$timeout(function(){
		// timeout because spinner directive is loaded afterwards
		spinnerService.show('spinnerLogout');
	});

	logoutRestService.postLogout().then(function() {
		$scope.success = true;
	}, function() {
		globalMessagesService.showGeneralError();
	})['finally'](function() {
		$timeout(function() {
			spinnerService.hide("spinnerLogout");
		});
	});

}]);
