app.filter('costCategoryLanguage', [ '$translate',

function ($translate) {
	'use strict';

	return function (value) {
		return value[$translate.use()];
	};
}]);

app.filter('limitWordwise', [ '$translate', '$filter',

function($translate, $filter) {
	"use strict";

	return function(input, limit) {
		if(!input) {
			return;
		}
		if(input.length <= limit) {
			return input;
		}
		var afterLimitText = input.substr(limit);
		if(afterLimitText === "") {
			return $filter('limitTo')(input, limit);
		}
		else {
			var spaceIndex = afterLimitText.indexOf(' ');
			if(spaceIndex === -1) {
				return $filter('limitTo')(input, limit);
			}
			else {
				var calculatedLimit = limit + spaceIndex;
				if(calculatedLimit === input.length) {
					return $filter('limitTo')(input, calculatedLimit);
				}
				else {
					return $filter('limitTo')(input, calculatedLimit) + ' (...)';
				}
			}
		}
	};

}]);

app.filter('getISODate', [ '$filter', 'moment',

function ($filter, moment) {
    'use strict';

    return function (date) {
        var d = new Date(moment(date, 'DD.MM.YYYY'));

        return $filter('date')(d, 'yyyy-MM-dd');
    };
}]);
