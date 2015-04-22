app.controller('SignatureController', function($scope, $state, Modernizr) {
	"use strict";
	
	var signaturePad;
	
	$scope.Modernizr = Modernizr;
	$scope.showUploadImage = false;
	$scope.showTouchInput = true;
	$scope.currentURL = window.location.href;
	$scope.forceSignaturePad = false;
	
	$scope.selectTouchTab = function() {
		$scope.showUploadImage = false;
		$scope.showTouchInput = true;
	};
	$scope.selectUploadTab = function() {
		$scope.showUploadImage = true;
		$scope.showTouchInput = false;
	};
	
	$scope.submitTouch = function() {
		if(!signaturePad.isEmpty()) {
			$state.go('cropping');
		}
	};
	
	createSignaturePad();
	
	$scope.resetSignaturePad = function() {
		signaturePad.clear(); 
	};
	
	function createSignaturePad() {
		var pad = jQuery('#signaturePad');
		jQuery(window).resize(resizeSignaturePad);
		resizeSignaturePad();
		signaturePad = new SignaturePad(pad[0]);
	}
	function resizeSignaturePad() {
		var pad = jQuery('#signaturePad');
		var width = parseInt(pad.css('width'), 10);
		var height = width * 1/3;
		pad.attr('width', width).attr('height', height);
	}
});