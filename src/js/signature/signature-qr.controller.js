app.controller('SignatureQRController', function($scope,$modalInstance) {
	"use strict";
	
	$scope.qrUrl = window.location.href;
	$scope.dismiss = $modalInstance.dismiss;
	
	$scope.checkAndClose = function() {
		// TODO sebi | check before closing
		$modalInstance.close();
	};
});