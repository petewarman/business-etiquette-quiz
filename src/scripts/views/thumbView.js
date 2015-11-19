define([
	'underscore',
	'baseView',
	'hbs!../templates/thumb',
	'utils'
], function(
	_,
	BaseView,
	template,
	Utils
) {
	'use strict';

	function ThumbView(options) {

		if (!(this instanceof ThumbView)) {
			return new ThumbView(options);
		}

		BaseView.call(this, options);

		this.el.setAttribute('role', 'button');
		this.el.setAttribute('tabindex', '0');
	}

	ThumbView.prototype = _.extend({}, BaseView.prototype, {

		"template": template,

		"className": "thumb",

		"bindContext": function() {
			_.bindAll(this, 'onElClick');
		},

		"modelEvents": {
			'change:selected': 'onChangeSelected',
			'change:state': 'onChangeState'
		},

		"uiRefs": {
			'image': '.question__image',
			'country': '.question__country',
			'description': '.question__description',
			'optionList': '.question__options-list',
			'options': '.question__option',
			'answer': '.question__answer'
		},

		"uiEvents": {
			'click': 'onElClick'
		},

		"onElClick": function(e) {
			this.eventBus.trigger('questionSelected', this.model);
		},

		"onChangeSelected": function() {
			if(this.model.get('selected')) {
				Utils.addClass(this.el, 'is-selected');
			} else {
				Utils.removeClass(this.el, 'is-selected');
			}
		},

		"onChangeState": function() {
			if(this.model.get('state') === 'answered') {
				this.removeUiEventListeners();

				this.el.removeAttribute('role');
				this.el.removeAttribute('tabindex');

				if(this.model.get('isCorrect')) {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--correct');
				} else {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--wrong');
				}
			}
		}

	});

	return ThumbView;

})