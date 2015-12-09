app.factory('costCategorySortService', ['$translate',

function($translate) {
	"use strict";

	var uniqueSeparator = "-;-;-;|#_|_#|;-;-;-";
	var currentLanguage = $translate.use();

	return {
		sort: function(costCategories) {
			var tempArray = [];
			for(var m = 0; m < costCategories.length; m++) {
				tempArray.push(costCategories[m].name[currentLanguage] + uniqueSeparator + costCategories[m].uid);
			}
			tempArray = tempArray.sort();

			var newCostCategories = [];
			for(var i = 0; i < tempArray.length; i++) {
				var uid = tempArray[i].split(uniqueSeparator)[1];
				for(var j = 0; j < costCategories.length; j++) {
					if(costCategories[j].uid === uid) {
						newCostCategories.push(costCategories[j]);
						break;
					}
				}
			}
			return newCostCategories;
		}
	};
}]);
