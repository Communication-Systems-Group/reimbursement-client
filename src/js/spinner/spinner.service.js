app.factory('spinnerService', function() {
	"use strict";
	
	var cache = {};
	
	return {
		// private method for spinner directive
		_register: function(spinnerScope) {
			if(!spinnerScope.id) {
				throw new Error("A spinner must have an ID to register with the spinner service!");
			}
			cache[spinnerScope.id] = spinnerScope;
		},
		
		show: function(spinnerId) {
			if(cache.hasOwnProperty(spinnerId)) {
				var spinnerScope = cache[spinnerId];
				spinnerScope.showSpinner = true;
			}
		},
		
		hide: function(spinnerId) {
			if(cache.hasOwnProperty(spinnerId)) {
				var spinnerScope = cache[spinnerId];
				spinnerScope.showSpinner = false;
			}
		},
		
		// useful for global error handler
		hideAll: function() {
			for(var spinnerId in cache) {
				if(cache.hasOwnProperty(spinnerId)) {
					var spinnerScope = cache[spinnerId];
					spinnerScope.showSpinner = false;
				}
			}
		}
	};
});