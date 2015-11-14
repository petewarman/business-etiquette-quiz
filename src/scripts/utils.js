define(['underscore'], function(_) {
	'use strict';

	var utils = {

		"addClass": function(el, className) {
			var classNames = el.className.split(' ');
			if(classNames.indexOf(className) === -1) {
				classNames.push(className);
				el.className = classNames.join(' ');
			}
		},

		"removeClass": function(el, className) {
			var classNames = el.className.split(' '),
				index = classNames.indexOf(className);

			if(index > -1) {
				classNames.splice(index, 1);
				el.className = classNames.join(' ');
			}
		},

		"hasClass": function(el, className) {
			var classNames = el.className.split(' ');
			return classNames.indexOf(className) > -1;
		},

		"getParentsWithClass": function (el, className) {
			var parents = [];

			// Get matches
			for ( ; el && el !== document; el = el.parentNode ) {
				if (this.hasClass(el, className)) {
					parents.push( el );
				}
			}

			// Return parents if any exist
			if ( parents.length === 0 ) {
				return null;
			} else {
				return parents;
			}

		}

	};

	return utils;

})