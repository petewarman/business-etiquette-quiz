define([
	'underscore',
	'questionModel'
], function(
	_,
	Model
) {
	'use strict';

	function QuestionsCollection(questionsData) {

		if (!(this instanceof QuestionsCollection)) {
			return new QuestionsCollection(questionsData);
		}

		this.models = [];

		if(questionsData){
			questionsData.forEach(this.addModel, this);
		}
	}

	QuestionsCollection.prototype = {

		"addModel": function(modelData) {
			this.models.push(new Model(modelData));
		},

		"getUnansweredQuestions": function() {

		},

		"setRootPath": function(path) {
			this.models.forEach(function(model){
				model.set('rootPath', path);
			});
		}

	};

	return QuestionsCollection;

})