define([
	'jquery',
	'underscore'
], function(
	$,
	_
) {
	'use strict';

	var app = {

		"init": function(options) {

			var defaults = {};

			this.options = _.extend(defaults, options); 

			this.getElementRefs();
			this.addEventListeners();
		},

	/* Set Up */

		"getElementRefs": function() {
			this.$container = $(this.options.containerSelector, this.options.interactiveEl);
		},

		"addEventListeners": function (){
			$(window).on('resize', _.debounce(this.onResize, 300));
		},

	/* Event Handlers */

		"onResize": function(e) {
			
		},


	};

	_.bindAll(
		app,
		'init',
		'onResize'
	);

	return app;

})