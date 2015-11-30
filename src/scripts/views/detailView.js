define([
	'hbs!../templates/detail',
	'hbs!../templates/response',
	'utils',
	'baseView'
], function(
	template,
	responseTemplate,
	Utils,
	BaseView
) {
	'use strict';

	var prototype = Object.create(BaseView.prototype);

	function DetailView(options) {
		if (!(this instanceof DetailView)) {
			return new DetailView(options);
		}

		BaseView.call(this, options);
	}

	DetailView.prototype = Utils.extend(prototype, {

		"template": template,

		"className": "question",

		"modelEvents": {
			'change:state': 'onStateChange',
			'change:selected': 'onChangeSelected',
			'change:oldSelected': 'onChangeOldSelected'
		},

		"uiRefs": {
			'image': '.question__image',
			'country': '.question__country',
			'description': '.question__description',
			'optionList': '.question__options-list',
			'options': '.question__option',
			'answer': '.question__answer',
			'nextButton': '.question__next-button'
		},

		"uiEvents": {
			'click options': 'onOptionClick',
			'transitionend': 'onTransitionend',
			'click nextButton': 'onNextButtonClick'
		},

		"addOptionClickListeners": function(){
			[].forEach.call(this.ui.options, function(option){
				option.addEventListener('click', this.onOptionClick);
			}, this);
		},

		"removeOptionClickListeners": function(){
			[].forEach.call(this.ui.options, function(option){
				option.removeEventListener('click', this.onOptionClick);
			}, this);
		},

		"onTransitionend": function() {
			Utils.removeClass(this.el, 'is-old-selected');
		},

		"onOptionClick": function(e) {
			var selectedOption = Utils.getParentsWithClass(e.target, 'question__option')[0],
				selectedOptionInd = [].indexOf.call(this.ui.options, selectedOption);

			this.model.onAnswerSelected(selectedOptionInd);

			this.activateNextButton();
		},

		"activateNextButton": function() {
			Utils.addClass(this.ui.nextButton[0], 'is-active');
			this.ui.nextButton[0].setAttribute('role', 'button');
			this.ui.nextButton[0].setAttribute('tabindex', '0');
		},

		"deactivateNextButton": function() {
			Utils.removeClass(this.ui.nextButton[0], 'is-active');
			this.ui.nextButton[0].removeAttribute('role');
			this.ui.nextButton[0].removeAttribute('tabindex');
		},

		"onNextButtonClick": function() {
			this.eventBus.trigger('showNextQuestion');
		},

		"onStateChange": function() {
			if(this.model.get('state') === 'answered') {
				this.disableButtons();
				this.renderResponse();
				Utils.addClass(this.el, 'question--answered');

				if(!this.model.get('isCorrect')) {
					Utils.addClass(this.ui.options[this.model.get('answerGiven')], 'is-incorrect');
				}

				Utils.addClass(this.ui.options[this.model.get('answer').index], 'is-correct');
			} else {
				this.enableButtons();
				this.removeResponse();
				Utils.removeClass(this.el, 'question--answered');
				[].forEach.call(this.ui.options, function(option){
					Utils.removeClass(option, 'is-incorrect');
					Utils.removeClass(option, 'is-correct');
				}, this);
			}
		},

		"onChangeSelected": function() {
			if(this.model.get('selected')) {
				Utils.addClass(this.el, 'is-selected');
			} else {
				Utils.removeClass(this.el, 'is-selected');
			}
		},

		"onChangeOldSelected": function() {
			if(this.model.get('oldSelected')) {
				Utils.addClass(this.el, 'is-old-selected');
			} else {
				Utils.removeClass(this.el, 'is-old-selected');
			}
		},

		"disableButtons": function() {
			this.removeOptionClickListeners();
			[].forEach.call(this.ui.options, function(option){
				option.removeAttribute('role');
				option.removeAttribute('tabindex');
			}, this);
		},

		"enableButtons": function() {
			this.addOptionClickListeners();
			[].forEach.call(this.ui.options, function(option){
				option.setAttribute('role', 'button');
				option.setAttribute('tabindex', '0');
			}, this);
		},

		"renderResponse": function() {
			this.ui.answer[0].innerHTML = responseTemplate(this.model.properties);
		},

		"removeResponse": function() {
			this.ui.answer[0].innerHTML = '';
		}

	});

	return DetailView;

})