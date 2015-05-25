/**
 * Created by robinengbersen on 23.05.15.
 */
app.filter('idFormatting', function () {
	"use strict";

	return function (id, postLetter) {
		var s = "00000" + id;

		return postLetter + s.substr(s.length - 6);
	};
});