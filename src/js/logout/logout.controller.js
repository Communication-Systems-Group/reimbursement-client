app.controller('LogoutController', ['$scope', '$timeout', 'USER', 'logoutRestService', 'globalMessagesService', 'spinnerService',

function($scope, $timeout, USER, logoutRestService, globalMessagesService, spinnerService) {
	"use strict";

	$scope.success = false;
	$timeout(function(){
		// timeout because spinner directive is loaded afterwards
		spinnerService.show('spinnerLogout');
	});

	logoutRestService.postLogout().then(function() {
		$scope.success = true;
		USER.loggedIn = false;
		USER.roles = [];
		logoutRestService.refreshCSRFToken();
	}, function() {
		globalMessagesService.showGeneralError();
	})['finally'](function() {
		$timeout(function() {
			spinnerService.hide("spinnerLogout");
		});
	});

}]);
