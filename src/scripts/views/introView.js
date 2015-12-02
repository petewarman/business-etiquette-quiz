define([
	'baseView',
	'hbs!../templates/intro',
	'utils'
], function(
	BaseView,
	template,
	Utils
) {
	'use strict';

	var prototype = Object.create(BaseView.prototype);

	function IntroView(options) {

		if (!(this instanceof IntroView)) {
			return new IntroView(options);
		}

		BaseView.call(this, options);
	}

	IntroView.prototype = Utils.extend(prototype, {

		"template": template,

		"className": "intro",

		"uiRefs": {
			'introButton': '.intro__button'
		},

		"uiEvents": {
			'click': 'onIntroClick'
		},

		"onIntroClick": function() {
			this.eventBus.trigger('startQuiz');
		}

	});

	return IntroView;

})