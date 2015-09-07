app.filter('costCategoryLanguage', [ '$translate', function ($translate) {
	'use strict';

	return function (value) {
		return value[$translate.use()];
	};
}]);

app.filter('idFormatting', function () {
	"use strict";

	return function (id, postLetter) {
		if (id !== '0' && id !== undefined) {
			var s = "00000" + id;

			return postLetter + s.substr(s.length - 6);
		}
	};
});

