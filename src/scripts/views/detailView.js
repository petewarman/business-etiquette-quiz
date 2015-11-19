define([
	'underscore',
	'hbs!../templates/detail',
	'hbs!../templates/response',
	'utils',
	'baseView'
], function(
	_,
	template,
	responseTemplate,
	Utils,
	BaseView
) {
	'use strict';

	function DetailView(options) {
		if (!(this instanceof DetailView)) {
			return new DetailView(options);
		}

		BaseView.call(this, options);
	}

	DetailView.prototype = _.extend({}, BaseView.prototype, {

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
			'nextButton': '.question__next',
			'closeButton': '.question__close'
		},

		"uiEvents": {
			'click options': 'onOptionClick',
			'click nextButton': 'onNextButtonClick',
			'click closeButton': 'onCloseButtonClick'
		},

		"bindContext": function() {
			_.bindAll(this, 'onOptionClick');
		},

		"removeOptionClickListeners": function(){
			_.each(this.ui.options, function(option){
				option.removeEventListener('click', this.onOptionClick);
			}, this);
		},

		"onOptionClick": function(e) {
			var selectedOption = Utils.getParentsWithClass(e.target, 'question__option')[0],
				selectedOptionInd = _.toArray(this.ui.options).indexOf(selectedOption);

			this.model.onAnswerSelected(selectedOptionInd);
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
			_.toArray(this.ui.options).forEach(function(option){
				option.removeAttribute('role');
				option.removeAttribute('tabindex');
			});
		},

		"renderResponse": function() {
			this.ui.answer[0].innerHTML = responseTemplate(this.model.properties);
		}

	});

	return DetailView;

})