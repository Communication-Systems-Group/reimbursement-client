app.controller('CsrfTestingPageController', ['$scope', 'csrfTestingPageRestService',

function($scope, csrfTestingPageRestService) {
	"use strict";

	$scope.form = {
		username: null,
		password: null
	};
	
	$scope.stringForm = {
		string: null
	};
	
	$scope.croppingDtoForm = {
		width: null,
		height: null,
		top: null,
		left: null	
	};

	$scope.loginSent = false;
	$scope.loginSuccess = false;
	$scope.submit = function() {
		csrfTestingPageRestService.postLogin($scope.form).then(function() {
			$scope.loginSuccess = true;
		}, function() {
			$scope.loginSuccess = false;
		})['finally'](function() {
			$scope.loginSent = true;
		});
	};
	

	
	$scope.getUsersSent = false;
	$scope.getUsersSuccess = false;
	$scope.getUsers = function (){
		csrfTestingPageRestService.getUsers().then(function() {
			$scope.getUsersSuccess = true;
		}, function() {
			$scope.getUsersSuccess = false;
		})['finally'](function() {
			$scope.getUsersSent = true;
		});
	};
	
	$scope.	getPrivateUsersSent = false;
	$scope.	getPrivateUsersSuccess = false;
	$scope.	getPrivateUsers = function (){
		csrfTestingPageRestService.	getPrivateUsers().then(function() {
			$scope.getPrivateUsersSuccess = true;
		}, function() {
			$scope.getPrivateUsersSuccess = false;
		})['finally'](function() {
			$scope.getPrivateUsersSent = true;
		});
	};
	
	$scope.sendStringSent = false;
	$scope.sendStringSuccess = false;
	$scope.sendString = function (){
		csrfTestingPageRestService.sendString($scope.stringForm).then(function() {
			$scope.sendStringSuccess = true; 
		}, function() {
			$scope.sendStringSuccess = false;
		})['finally'](function() {
			$scope.sendStringSent = true;
		});
	};
	
	$scope.sendCroppingDtoSent = false;
	$scope.sendCroppingDtoSuccess = false;
	$scope.sendCroppingDto = function (){
		csrfTestingPageRestService.sendCroppingDto($scope.croppingDtoForm).then(function() {
			$scope.sendCroppingDtoSuccess = true; 
		}, function() {
			$scope.sendCroppingDtoSuccess = false;
		})['finally'](function() {
			$scope.sendCroppingDtoSent = true;
		});
	};

}]);
