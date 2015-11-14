define([
	'underscore',
	'hbs!../templates/app',
	'thumbView',
	'detailView',
	'eventBus',
	'utils'
], function(
	_,
	template,
	ThumbView,
	DetailView,
	EventBus,
	Utils
) {
	'use strict';

	function AppView(options) {

		if (!(this instanceof AppView)) {
			return new AppView(options);
		}

		this.questionsCollection = options.questions;
		this.render();
		this.getUiRefs();
		this.addEventListeners();
		this.renderThumbs();
	}

	AppView.prototype = {

		"render": function() {
			this.el = document.createElement('div');
			this.el.className = 'ups-interactive';
			this.el.innerHTML = template({});
		},

		"getUiRefs": function() {
			this.ui = {
				"thumbsContainer" : {
					"el": this.el.querySelector('.thumbs-container'),
					"views": []
				},
				"detailContainer":  {
					"el": this.el.querySelector('.detail-container'),
					"view": null
				}
			};
		},

		"addEventListeners": function() {
			EventBus.on('questionSelected', this.displayDetail, this);
		},

		"renderThumbs": function() {
			this.questionsCollection.models.forEach(this.renderThumb, this);
		},

		"renderThumb": function(questionModel) {
			var view = new ThumbView({
				"model": questionModel
			});

			this.ui.thumbsContainer.views.push(view);
			this.ui.thumbsContainer.el.appendChild(view.el);
		},

		"renderDetail": function(questionModel) {
			this.emptyRegion(this.ui.detailContainer);

			var view = new DetailView({
				"model": questionModel
			});

			this.ui.detailContainer.view = view;
			this.ui.detailContainer.el.appendChild(view.el);
		},

		"emptyRegion": function(region) {
			if(region.view) {
				region.view.removeEventListeners();
				while (region.el.firstChild) {
					region.el.removeChild(region.el.firstChild);
				}
				region.view = null;
			}
		},

		"displayDetail": function(questionModel) {
			Utils.addClass(this.el, 'question-selected');
			this.renderDetail(questionModel);
		}

	};

	return AppView;

})