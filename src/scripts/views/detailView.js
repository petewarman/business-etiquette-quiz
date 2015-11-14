define([
	'underscore',
	'hbs!../templates/question',
	'utils'
], function(
	_,
	template,
	Utils
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
			_.bindAll(this, 'onOptionClick');
		},

		"render": function() {
			this.el = document.createElement('div');
			this.el.className = 'question';
			this.el.innerHTML = template(this.model.properties);
		},

		getUiRefs: function() {
			this.ui = {};
			this.ui.image = this.el.querySelector('.question__image');
			this.ui.country = this.el.querySelector('.question__country');
			this.ui.description = this.el.querySelector('.question__description');
			this.ui.optionList = this.el.querySelector('.question__options-list');
			this.ui.options = this.el.querySelectorAll('.question__option');
			this.ui.answer = this.el.querySelector('.question__answer');
		},

		"addEventListeners": function() {
			_.each(this.ui.options, function(option){
				option.addEventListener('click', this.onOptionClick);
			}, this);
		},

		"removeEventListeners": function() {
			_.each(this.ui.options, function(option){
				option.removeEventListener('click', this.onOptionClick);
			}, this);
		},

		"onOptionClick": function(e) {
			var option = Utils.getParentsWithClass(e.target, 'question__option')[0];
			console.log('onOptionClick', _.toArray(this.ui.options).indexOf(option));
		}

	};

	return QuestionView;

})