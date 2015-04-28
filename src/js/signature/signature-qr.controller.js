app.controller('SignatureQRController', function($scope, $modalInstance, $modal, signatureRESTService) {
	"use strict";
	
	$scope.qrUrl = window.location.href;
	$scope.dismiss = $modalInstance.dismiss;
	
	$scope.checkAndClose = function() {
		
		var promise = signatureRESTService.getSignature();
		promise.then(function(image) {
			$modalInstance.close(image);
		}, function() {
			$modal.open({
				templateUrl: 'templates/signature-qr-error.html',
				controller: 'SignatureQRErrorController',
				size: 'sm'
			});
		});
		
	};
});