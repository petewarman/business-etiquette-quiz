define([
	'underscore',
	'hbs!../templates/thumb',
	'eventBus'
], function(
	_,
	template,
	EventBus
) {
	'use strict';

	function QuestionView(options) {

		if (!(this instanceof QuestionView)) {
			return new QuestionView(options);
		}

		this.model = options.model;
		this.bindContext();
		this.render();
		this.getUiRefs();
		this.addEventListeners();
	}


	QuestionView.prototype = {

		"bindContext": function() {
			_.bindAll(this, 'onElClick');
		},

		"render": function() {
			this.el = document.createElement('div');
			this.el.className = 'thumb';
			this.el.innerHTML = template(this.model.properties);
		},

		"getUiRefs": function() {
			this.ui = {};
			this.ui.image = this.el.querySelector('.question__image');
			this.ui.country = this.el.querySelector('.question__country');
			this.ui.description = this.el.querySelector('.question__description');
			this.ui.optionList = this.el.querySelector('.question__options-list');
			this.ui.options = this.el.querySelectorAll('.question__option');
			this.ui.answer = this.el.querySelector('.question__answer');
		},

		"addEventListeners": function() {
			this.el.addEventListener('click', this.onElClick);
		},

		"removeEventListeners": function() {
			this.el.removeEventListener('click', this.onElClick);
		},

		"onElClick": function(e) {
			EventBus.trigger('questionSelected', this.model);
		}

	};

	return QuestionView;

})