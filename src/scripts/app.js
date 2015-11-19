define([
	'underscore',
	'questionsCollection',
	'appView',
	'eventBus'
], function(
	_,
	QuestionsCollection,
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
			this.view = this.createAppView();
			this.options.baseEl.appendChild(this.view.el);
			this.view.positionThumbs();
		},

		"createQuestionsCollection": function(collectionData) {
			return new QuestionsCollection(collectionData, {
				'eventBus': this.eventBus
			});
		},

		"getQuestionsCollection": function() {
			return this._questionsCollection;
		},

		"createAppView": function() {
			return new AppView({
				"questions": this.getQuestionsCollection(),
				"eventBus": this.eventBus
			});
		}

	};

	return app;

})