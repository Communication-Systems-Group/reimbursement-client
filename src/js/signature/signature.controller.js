app.controller('SignatureController', function($scope, $state, Modernizr) {
	"use strict";

	$scope.Modernizr = Modernizr;
	$scope.showUploadImage = false;
	$scope.showTouchInput = true;
	$scope.currentURL = window.location.href;
	$scope.forceSignaturePad = false;
	$scope.uploadStarted = false;
	$scope.flow = {};

	$scope.selectTouchTab = function() {
		$scope.showUploadImage = false;
		$scope.showTouchInput = true;
	};
	$scope.selectUploadTab = function() {
		$scope.showUploadImage = true;
		$scope.showTouchInput = false;
	};

	$scope.submitTouch = function(file) {
		$scope.flow.touch.addFile(file);
		$scope.flow.touch.upload();
	};

	$scope.goToNextPage = function() {
		$state.go('cropping');
	};

});