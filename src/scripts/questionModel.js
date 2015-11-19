define([
	'underscore',
	'eventBus'
], function(
	_,
	EventBus
) {
	'use strict';

	function Question(questionData, options){

		if (!(this instanceof Question)) {
			return new Question(questionData);
		}

		var defaults = {
			"state": "unanswered",
			"answerGiven": null
		};

		this.options = options;
		this.properties = _.extend(defaults, questionData); 
		this._listeners = [];

	}

	Question.prototype = _.extend({

		"get": function(property) {
			return this.properties[property];
		},

		"set": function(property, value) {
			if(this.properties[property] !== value) {
				this.properties[property] = value;
				this.trigger('change:'+ property);
			}
		},

		"onAnswerSelected": function(answer) {
			var correctAnswer = this.get('answer').index;

			this.set('answerGiven', answer);
			this.set('isCorrect', (answer === correctAnswer));
			this.set('correctAnswerLetter', ['A','B','C'][correctAnswer]);
			this.set('state', 'answered');

		}

	}, EventBus.prototype);

	return Question;

})