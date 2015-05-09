app.controller('SignatureQRController', ['$scope', '$modalInstance', '$modal', 'signatureRestService', 'spinnerService',

function($scope, $modalInstance, $modal, signatureRestService, spinnerService) {
	"use strict";

	$scope.qrUrl = window.location.href;
	$scope.dismiss = $modalInstance.dismiss;

	$scope.checkAndClose = function() {
		spinnerService.show('spinnerSignatureQR');

		var promise = signatureRestService.getSignature();
		promise.then(function(image) {
			$modalInstance.close(image);
		}, function() {
			$modal.open({
				templateUrl: 'signature/signature-qr-error.tpl.html',
				controller: 'SignatureQRErrorController',
				size: 'sm'
			});
		})['finally'](function() {
			spinnerService.hide('spinnerSignatureQR');
		});

	};

}]);