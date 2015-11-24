define([
	'utils',
	'baseModel'
], function(
	Utils,
	BaseModel
) {
	'use strict';

	var prototype = Object.create(BaseModel.prototype);

	function Question(data, options){

		if (!(this instanceof Question)) {
			return new Question(data);
		}

		BaseModel.call(this, data, options);

		var defaults = {
			"state": "unanswered",
			"answerGiven": null
		};

		this.properties = Utils.extend(defaults, data); 

	}

	Question.prototype = Utils.extend(prototype, {

		"onAnswerSelected": function(answer) {
			var correctAnswer = this.get('answer').index;

			this.set('answerGiven', answer);
			this.set('isCorrect', (answer === correctAnswer));
			this.set('correctAnswerLetter', ['A','B','C'][correctAnswer]);
			this.set('state', 'answered');

		},

		"reset": function() {
			this.set('answerGiven', null);
			this.set('isCorrect', null);
			this.set('correctAnswerLetter', null);
			this.set('state', 'unanswered');
		}

	});

	return Question;

})