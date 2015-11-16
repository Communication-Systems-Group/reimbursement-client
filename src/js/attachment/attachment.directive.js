app.directive('attachmentUpload', ['MAX_UPLOAD_SIZE',

function(MAX_UPLOAD_SIZE) {
	"use strict";

	return {
		restrict: 'E',
		replace: false,
		templateUrl: 'attachment/attachment.tpl.html',
		controller: 'AttachmentController',
		scope: {
			expenseItemUid: "=",
			hasAttachment: "=",
			editable: "="
		},
		link: function($scope) {
			$scope.maxUploadSize = MAX_UPLOAD_SIZE;
		}
	};
}]);