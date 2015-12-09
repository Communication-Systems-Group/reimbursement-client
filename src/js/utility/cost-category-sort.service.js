app.factory('costCategorySortService', ['$translate',

function($translate) {
	"use strict";

	var currentLanguage = $translate.use();

	return {
		sort: function(costCategories) {
			return costCategories.sort(function(a, b) {
				var leftValue = a.name[currentLanguage];
				var rightValue = b.name[currentLanguage];

				if(leftValue < rightValue) {
					return -1;
				}
				else if(leftValue > rightValue) {
					return 1;
				}

				return 0;
			});
		}
	};
}]);
