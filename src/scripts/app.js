define([
	'underscore',
	'questionsCollection',
	'appView'
], function(
	_,
	QuestionsCollection,
	AppView
) {
	'use strict';

	var app = {

		"init": function(options) {
			this.options = options; 
			this._questionsCollection = this.createQuestionsCollection(this.options.data.questions);
			this._questionsCollection.setRootPath(options.rootPath);
			this.view = this.createAppView();
			this.options.baseEl.appendChild(this.view.el);
		},

		"createQuestionsCollection": function(collectionData) {
			return new QuestionsCollection(collectionData);
		},

		"getQuestionsCollection": function() {
			return this._questionsCollection;
		},

		"createAppView": function() {
			return new AppView({
				"questions": this.getQuestionsCollection()
			});
		}

	};

	return app;

})