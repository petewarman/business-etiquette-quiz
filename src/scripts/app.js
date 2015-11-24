define([
	'questionsCollection',
	'resultsCollection',
	'appView',
	'eventBus'
], function(
	QuestionsCollection,
	ResultsCollection,
	AppView,
	EventBus
) {
	'use strict';

	var app = {

		"init": function(options) {
			this.options = options; 
			this.eventBus = new EventBus();
			this._questionsCollection = this.createQuestionsCollection(this.options.data.questions);
			this._questionsCollection.setRootPath(options.rootPath);
			this._resultsCollection = this.createResultsCollection(this.options.data.results);
			this.view = this.createAppView();
			this.options.baseEl.appendChild(this.view.el);
			this.view.positionThumbs();
		},

		"createQuestionsCollection": function(collectionData) {
			return new QuestionsCollection(collectionData, {
				'eventBus': this.eventBus
			});
		},

		"createResultsCollection": function(collectionData) {
			return new ResultsCollection(collectionData, {
				'eventBus': this.eventBus
			});
		},

		"getQuestionsCollection": function() {
			return this._questionsCollection;
		},

		"getResultsCollection": function() {
			return this._resultsCollection;
		},

		"createAppView": function(rootPath) {
			return new AppView({
				"questions": this.getQuestionsCollection(),
				"results": this.getResultsCollection(),
				"eventBus": this.eventBus,
				"rootPath": this.options.rootPath,
				"shareCopy": this.options.data.shareCopy
			});
		}

	};

	return app;

})