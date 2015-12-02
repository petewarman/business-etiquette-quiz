define([
	'questionModel'
], function(
	Model
) {
	'use strict';

	function QuestionsCollection(questionsData, options) {

		if (!(this instanceof QuestionsCollection)) {
			return new QuestionsCollection(questionsData);
		}

		this.eventBus = options.eventBus;
		this.models = [];

		if(questionsData){
			questionsData.forEach(this.addModel, this);
		}

		this.setNextButtonText();

	}

	QuestionsCollection.prototype = {

		"getNextUnansweredQuestion": function() {
			var ind = this.models.indexOf(this.getSelectedQuestion()) + 1;

			for(var i=0; i<this.models.length; i++) {

				if(ind >= this.models.length) {
					ind = 0;
				}

				if(this.models[ind].get('state') === 'unanswered') {
					return this.models[ind];
				} else {
					ind++;
				}

			}

			return null;

		},

		"getUnansweredQuestionCount": function() {
			return this.models.filter(function(model){
				return model.get('state') === 'unanswered';
			}).length;
		},

		"addModel": function(modelData) {
			this.models.push(new Model(modelData, {
				'eventBus': this.eventBus
			}));
		},

		"reset": function() {
			this.models.forEach(function(model){
				model.reset();
			});
		},

		"setRootPath": function(path) {
			this.models.forEach(function(model){
				model.set('rootPath', path);
			});
		},

		"setNextButtonText": function() {
			var modelCount = this.models.length;

			this.models.forEach(function(model, index){
				model.set('nextButtonText', ((index + 1) === modelCount) ? 'Finished' : 'Next');
			});
		},

		"setSelectedQuestion": function(selectedModel) {
			var oldSelected = this.getSelectedQuestion();

			if(!selectedModel || oldSelected !== selectedModel) {
				this.models.forEach(function(model){
					model.set('selected', (selectedModel === model));
					model.set('oldSelected', (oldSelected === model));
				});
			}
		},

		"getSelectedQuestion": function() {
			return this.models.filter(function(model){
				return model.get('selected');
			})[0];
		},

		"getCorrectAnswerCount": function() {
			return this.models.filter(function(model){
				return model.get('isCorrect');
			}).length
		}

	};

	return QuestionsCollection;

})