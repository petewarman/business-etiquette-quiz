define([
	'underscore'
], function(
	_
) {
	'use strict';

	function Question(questionData){

		if (!(this instanceof Question)) {
			return new Question(questionData);
		}

		var defaults = {
			"state": "unanswered",
			"answerGiven": null
		};

		this.properties = _.extend(defaults, questionData); 

	}

	Question.prototype.get = function(property) {
		return this.properties[property];
	};

	Question.prototype.set = function(property, value) {
		this.properties[property] = value;
	};

	Question.prototype.onAnswerSelected = function(answer) {

	};

	return Question;

})