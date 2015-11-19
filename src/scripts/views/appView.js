define([
	'underscore',
	'hbs!../templates/app',
	'baseView',
	'thumbView',
	'detailView',
	'resultsView',
	'utils'
], function(
	_,
	template,
	BaseView,
	ThumbView,
	DetailView,
	ResultsView,
	Utils
) {
	'use strict';

	function AppView(options) {

		if (!(this instanceof AppView)) {
			return new AppView(options);
		}

		BaseView.call(this, options);

		this.gridLayoutSettings = {
			"gutter": 4,
			"breakPoint": 640,
			"thumbsPerRowSmall": 2,
			"thumbsPerRowLarge": 4
		};

		this.state = 'map';

		this.questionsCollection = options.questions;
		this.renderThumbs();
		this.renderDetails();
		this.addEventBusListeners();
		this.positionThumbs();

		window.addEventListener('resize', _.debounce(this.onResize, 200));
	}

	AppView.prototype = _.extend({}, BaseView.prototype, {

		"className": "ups-interactive",

		"template": template,

		"getUiRefs": function() {
			this.ui = {
				"thumbsContainer" : {
					"el": this.el.querySelector('.thumbs-container'),
					"views": []
				},
				"detailContainer":  {
					"el": this.el.querySelector('.detail-container'),
					"views": []
				},
				"resultsContainer":  {
					"el": this.el.querySelector('.results-container'),
					"view": null
				},
				"closeDetailButton": this.el.querySelectorAll('.close-detail'),
				"nextQuestionButton": this.el.querySelectorAll('.next-question')
			};
		},

		"uiEvents": {
			'click nextQuestionButton': 'onNextButtonClick',
			'click closeDetailButton': 'onCloseButtonClick'
		},

		"bindContext": function() {
			_.bindAll(this, 'onResize', 'onNextButtonClick', 'onCloseButtonClick');
		},

		"addEventBusListeners": function() {
			this.eventBus.on('questionSelected', this.displayDetail, this);
			this.eventBus.on('nextQuestion', this.showNextUnansweredQuestion, this);
			this.eventBus.on('hideDetail', this.hideDetail, this);
		},

		"onResize": function() {
			this.positionThumbs();
		},

		"renderThumbs": function() {
			this.questionsCollection.models.forEach(this.renderThumb, this);
		},

		"renderThumb": function(questionModel) {
			var view = new ThumbView({
				"model": questionModel,
				"eventBus": this.eventBus
			});

			this.ui.thumbsContainer.views.push(view);
			this.ui.thumbsContainer.el.appendChild(view.el);
		},

		"renderDetails": function() {
			this.questionsCollection.models.forEach(this.renderDetail, this);
		},

		"renderDetail": function(questionModel) {
			var view = new DetailView({
				"model": questionModel,
				"eventBus": this.eventBus
			});

			this.ui.detailContainer.views.push(view);
			this.ui.detailContainer.el.appendChild(view.el);
		},

		"getThumbsPerRow": function() {
			var winWidth = window.innerWidth;
			return (winWidth >= this.gridLayoutSettings.breakPoint) ? this.gridLayoutSettings.thumbsPerRowLarge : this.gridLayoutSettings.thumbsPerRowSmall;
		},

		"positionThumbs": function() {
			switch(this.state) {
				case 'grid':
					Utils.removeClass(this.el, 'question-selected');
					Utils.removeClass(this.el, 'map-view');
					this.positionThumbsAsGrid();
					break;
				case 'map':
					Utils.removeClass(this.el, 'question-selected');
					Utils.addClass(this.el, 'map-view');
					this.positionThumbsAsMap();
					break;
				case 'detail':
					Utils.addClass(this.el, 'question-selected');
					Utils.removeClass(this.el, 'map-view');
					this.positionThumbsAsFooter();
					break;
				case 'finished':
					this.hideThumbs();
			}
		},

		"positionThumbsAsMap": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 36,
				containerHeight = containerWidth * 0.573554933;

			this.el.style.height = containerHeight + 'px';

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = thumbView.model.get('mapY'),
					left = thumbView.model.get('mapX');

				thumbView.el.style.top = top + '%';
				thumbView.el.style.left = left + '%';
				thumbView.el.style.width = thumbSize + 'px';

			}, this);
		},

		"positionThumbsAsGrid": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbsPerRow = this.getThumbsPerRow(),
				thumbSize = (containerWidth - (this.gridLayoutSettings.gutter * (thumbsPerRow - 1))) / thumbsPerRow,
				containerHeight = Math.floor((this.ui.thumbsContainer.views.length - 1) / thumbsPerRow) * (thumbSize + this.gridLayoutSettings.gutter) + thumbSize;

			this.el.style.height = containerHeight + 'px';

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = Math.floor(index / thumbsPerRow) * (thumbSize + this.gridLayoutSettings.gutter),
					left = (index % thumbsPerRow) * (thumbSize + this.gridLayoutSettings.gutter);

				thumbView.el.style.top = top + 'px';
				thumbView.el.style.left = left + 'px';
				thumbView.el.style.width = thumbSize + 'px';

			}, this);
		},

		"positionThumbsAsFooter": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 36,
				thumbCount = this.ui.thumbsContainer.views.length,
				gutter = 10;

			this.el.style.height = (containerWidth * 0.6 + gutter + thumbSize + 40) + 'px';

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = containerWidth * 0.6 + gutter + 40,
					left = containerWidth * 0.6 - ((thumbCount - index) * (thumbSize + gutter)) + gutter;

				thumbView.el.style.top = top + 'px';
				thumbView.el.style.left = left + 'px';
				thumbView.el.style.width = thumbSize + 'px';

			}, this);
		},

		"showNextUnansweredQuestion": function() {
			var question = this.questionsCollection.getNextUnansweredQuestion();

			if(question) {
				this.displayDetail(question);
			} else {
				this.showResults();
			}
		},

		"showResults": function(){
			//this.emptyRegion(this.ui.detailContainer);

			var view = new ResultsView({
				"eventBus": this.eventBus
			});

			this.ui.resultsContainer.view = view;
			this.ui.resultsContainer.el.appendChild(view.el);
		},

		"emptyRegion": function(region) {
			if(region.view) {
				region.view.removeUiEventListeners();
				while (region.el.firstChild) {
					region.el.removeChild(region.el.firstChild);
				}
				region.view = null;
			}
		},

		"displayDetail": function(questionModel) {
			Utils.addClass(this.el, 'question-selected');
			Utils.removeClass(this.el, 'map-view');
			this.state = 'detail';
			this.positionThumbs();
			this.questionsCollection.setSelectedQuestion(questionModel);
			//this.renderDetail(questionModel);
		},

		"hideDetail": function() {
			Utils.removeClass(this.el, 'question-selected');
			Utils.removeClass(this.el, 'map-view');
			this.state = 'grid';
			this.positionThumbs();
			this.questionsCollection.setSelectedQuestion();
			//this.emptyRegion(this.ui.detailContainer);
		},


		"onNextButtonClick": function() {
			this.showNextUnansweredQuestion();
		},

		"onCloseButtonClick": function() {
			this.hideDetail();
		}

	});

	return AppView;

})