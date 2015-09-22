app.directive('attachmentUpload',

function() {
	"use strict";

	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'attachment/attachment.tpl.html',
		controller: 'AttachmentController',
		scope : {
			expenseItemUid : '='
		},
		link: function($scope, element){
			$scope.addImageToElement = function(base64Image){
				element.append("<image src="+base64Image+"><image>");
			};
		}
	};
});