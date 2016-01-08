app.directive('settingsForm', ['$timeout', '$translate', '$uibModal', 'settingsRestService', 'globalMessagesService', 'USER',

function($timeout, $translate, $uibModal, settingsRestService, globalMessagesService, USER) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		scope: false,
		templateUrl: 'settings/settings-form.directive.tpl.html',
		link: function($scope) {

			$scope.personnelNumberLoading = false;
			$scope.phoneNumberLoading = false;
			$scope.languageLoading = false;
			$scope.isActiveLoading = false;

			$scope.isLoading = false;

			var timeoutTime = 700;
			$scope.timeouts = {};
			$scope.languages = [];
			$scope.form = {
				personnelNumber: USER.personnelNumber,
				phoneNumber: USER.phoneNumber,
				isActive: USER.isActive
			};

			settingsRestService.getSupportedLanguages().then(function(response) {
				$scope.languages = response.data;
				$timeout(function() {
					$scope.form.language = USER.language;
				});
			});

			$scope.saveLanguage = function() {
				$scope.languageLoading = true;
				$scope.isLoading = true;
				settingsRestService.putLanguage($scope.form.language.toUpperCase()).then(function() {
					USER.language = $scope.form.language;
					$translate.use($scope.form.language.toLowerCase());
				})['finally'](function() {
					$timeout(function() {
						$scope.languageLoading = false;
						$scope.isLoading = false;
					}, timeoutTime - 1);
				});
			};

			$scope.savePersonnelNumber = function() {
				$timeout(function() {
					var personnelNumber = "";

					if($scope.form.personnelNumber !== null && $scope.form.personnelNumber !== undefined && $scope.formSettings.personnelNumber.$valid) {
						personnelNumber = $scope.form.personnelNumber;
					}

					$timeout.cancel($scope.timeouts.personnelNumber);

					if($scope.formSettings.personnelNumber.$valid) {

						$scope.timeouts.personnelNumber = $timeout(function() {
							$scope.personnelNumberLoading = true;
							$scope.isLoading = true;

							settingsRestService.putPersonnelNumber(personnelNumber).then(function() {
								USER.personnelNumber = $scope.form.personnelNumber;
							})['finally'](function() {
								$timeout(function () {
									$scope.personnelNumberLoading = false;
									$scope.isLoading = false;
								}, timeoutTime - 1);
							});

						}, timeoutTime);
					}
				});
			};

			$scope.savePhoneNumber = function() {
				$timeout(function() {
					var phoneNumber = "";

					if($scope.form.phoneNumber !== null && $scope.form.phoneNumber !== undefined && $scope.formSettings.phoneNumber.$valid) {
						phoneNumber = $scope.form.phoneNumber;
					}

					$timeout.cancel($scope.timeouts.phoneNumber);

					if($scope.formSettings.phoneNumber.$valid) {

						$scope.timeouts.phoneNumber = $timeout(function() {
							$scope.phoneNumberLoading = true;
							$scope.isLoading = true;

							settingsRestService.putPhoneNumber(phoneNumber).then(function() {
								USER.phoneNumber = $scope.form.phoneNumber;
							})['finally'](function() {
								$timeout(function() {
									$scope.phoneNumberLoading = false;
									$scope.isLoading = false;
								}, timeoutTime - 1);
							});

						}, timeoutTime);
					}
				});
			};

			$scope.saveIsActive = function() {
				if($scope.form.isActive !== "") {
					$scope.isActiveLoading = true;
					$scope.isLoading = true;

					settingsRestService.putIsActive($scope.form.isActive).then(function() {
							USER.isActive = $scope.form.isActive;
						}, function(reason) {
							if(reason.data.type === "UserMustAlwaysBeActiveException") {
								reason.errorHandled = true;
								globalMessagesService.showErrorMd('reimbursement.globalMessage.settings.isActive.UserMustBeActiveTitle',
								'reimbursement.globalMessage.settings.isActive.UserMustBeActiveMessage');
								$scope.form.isActive = true;
								USER.isActive = $scope.form.isActive;
							}
						})['finally'](function() {
						$timeout(function() {
							$scope.isActiveLoading = false;
							$scope.isLoading = false;
						}, timeoutTime - 1);
					});
				}
			};

			$scope.openPersonnelNumberModal = function() {
					$uibModal.open({
						templateUrl: 'settings/show-personnel-number.modal.tpl.html',
						controller: 'ShowPersonnelNumberController'
					});
				};
		}
	};
}]);
