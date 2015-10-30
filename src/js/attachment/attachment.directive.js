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
		}
	};
});