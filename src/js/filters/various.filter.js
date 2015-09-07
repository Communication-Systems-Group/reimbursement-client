app.filter('costCategoryLanguage', [ '$translate', function ($translate) {
	'use strict';

	return function (value) {
		return value[$translate.use()];
	};
}]);