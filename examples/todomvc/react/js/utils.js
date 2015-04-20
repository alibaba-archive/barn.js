var app = app || {};

(function () {
	'use strict';

	app.Utils = {
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();
