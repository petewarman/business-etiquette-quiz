define([
	'underscore',
	'baseView',
	'hbs!../templates/results',
	'utils'
], function(
	_,
	BaseView,
	template,
	Utils
) {
	'use strict';

	function ResultsView(options) {
		if (!(this instanceof ResultsView)) {
			return new ResultsView(options);
		}

		BaseView.call(this, options);
	}

	ResultsView.prototype = _.extend({}, BaseView.prototype, {

		"template": template,

		"className": "results",

		"uiRefs": {
			'title': '.results__title',
			'score': '.results__score',
			'copy': '.results__copy',
			'restartButton': '.results__restart'
		},

		"uiEvents": {
			'click': 'onElClick'
		},

		"bindContext": function() {
			//_.bindAll(this, '');
		}

	});

	return ResultsView;

})