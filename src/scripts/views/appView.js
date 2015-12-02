define([
	'hbs!../templates/app',
	'baseView',
	'thumbView',
	'detailView',
	'resultsView',
	'introView',
	'utils'
], function(
	template,
	BaseView,
	ThumbView,
	DetailView,
	ResultsView,
	IntroView,
	Utils
) {
	'use strict';

	var prototype = Object.create(BaseView.prototype);

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
		this.resultsCollection = options.results;
		this.rootPath = options.rootPath;
		this.shareCopy = options.shareCopy;
		this.renderIntro();
		this.renderThumbs();
		this.renderDetails();
		this.addEventBusListeners();

		setTimeout(this.startIntro, 500);

		window.addEventListener('resize', Utils.debounce(this.onResize, 200));
	}

	AppView.prototype = Utils.extend(prototype, {

		"className": "ups-interactive intro",

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
				"introContainer":  {
					"el": this.el.querySelector('.intro-container'),
					"view": null
				},
				"nextQuestionButton": this.el.querySelectorAll('.next-question')
			};
		},

		"bindContext": function() {
			this.onResize = this.onResize.bind(this);
			this.startIntro = this.startIntro.bind(this);
		},

		"addEventBusListeners": function() {
			this.eventBus.on('thumbIntroComplete', this.onThumbIntroComplete, this);
			this.eventBus.on('restartQuiz', this.restartQuiz, this);
			this.eventBus.on('startQuiz', this.showNextUnansweredQuestion, this);
			this.eventBus.on('showNextQuestion', this.onShowNextQuestion, this);
		},

		"restartQuiz": function() {
			this.questionsCollection.reset();
			this.showNextUnansweredQuestion();
			this.ui.detailContainer.views.forEach(function(view){
				view.deactivateNextButton();
			});

			//track
			ga('send', 'event', 'restart', 'click');
		},

		"onThumbIntroComplete": function(thumbModel) {
			this.thumbIntrosCompleted++;

			if(this.thumbIntrosCompleted >= this.questionsCollection.models.length) {
				if(this.state === 'map'){
					//setTimeout(this.showNextUnansweredQuestion.bind(this), 800);
				}
			}
		},

		"onResize": function() {
			this.positionThumbs();
		},

		"startIntro": function() {
			this.state = 'map';
			this.positionThumbs();
			this.thumbIntrosCompleted = 0;
			Utils.removeClass(this.el, 'intro');
			if(!Utils.supportsTransitions()) {
				this.showNextUnansweredQuestion();
			}
		},

		"renderIntro": function() {
			var view = new IntroView({
				"eventBus": this.eventBus
			});

			this.ui.introContainer.view = view;
			this.ui.introContainer.el.appendChild(view.el);
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

		"renderDetail": function(questionModel, index) {
			var view = new DetailView({
				"model": questionModel,
				"eventBus": this.eventBus,
				"index": index
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
				case 'map':
					Utils.addClass(this.el, 'map-view');
					Utils.removeClass(this.el, 'question-selected');
					Utils.removeClass(this.el, 'results-view');
					this.positionThumbsAsMap();
					break;
				case 'detail':
					Utils.addClass(this.el, 'question-selected');
					Utils.removeClass(this.el, 'results-view');
					Utils.removeClass(this.el, 'map-view');
					Utils.removeClass(this.el, 'intro');
					this.positionThumbsAsFooter();
					break;
				case 'results':
					Utils.addClass(this.el, 'results-view');
					Utils.removeClass(this.el, 'question-selected');
					Utils.removeClass(this.el, 'map-view');
					Utils.removeClass(this.el, 'intro');
					//this.positionThumbsAsFooter();
					this.positionThumbsAsResult();
			}
		},

		"positionThumbsAsMap": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 6,
				containerHeight = containerWidth * 0.573554933;

			this.el.style.height = containerHeight + 'px';

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = thumbView.model.get('mapY'),
					left = thumbView.model.get('mapX');

				thumbView.el.style.top = top + '%';
				thumbView.el.style.left = left + '%';
				thumbView.el.style.width = thumbSize + '%';

			}, this);
		},

		"positionThumbsAsResult": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 36,
				thumbCount = this.ui.thumbsContainer.views.length,
				gutter = 10,
				thumbsWidth = (thumbCount * thumbSize) + ((thumbCount - 1) * gutter);

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = 10,
					left = (containerWidth/2) - (thumbsWidth/2) + (index * (thumbSize + gutter));

				thumbView.el.style.top = top + 'px';
				thumbView.el.style.left = left + 'px';
				thumbView.el.style.width = thumbSize + 'px';

			}, this);
		},

		"positionThumbsAsFooter": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 36,
				thumbCount = this.ui.thumbsContainer.views.length,
				gutter = 10,
				elHeight = Math.min((containerWidth * 0.6), 700);

			this.el.style.height = (elHeight + gutter + thumbSize + 40) + 'px';

			this.ui.thumbsContainer.views.forEach(function(thumbView, index){

				var top = elHeight + gutter + 40,
					//left = elHeight - ((thumbCount - index) * (thumbSize + gutter)) + gutter;
					left = index * (thumbSize + gutter);

				thumbView.el.style.top = 0 + 'px';
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
			this.emptyRegion(this.ui.resultsContainer);

			var score = this.questionsCollection.getCorrectAnswerCount();
			var resultModel = this.resultsCollection.getResultModelByScore(score);

			var view = new ResultsView({
				"model": resultModel,
				"score": score,
				"questionCount": this.questionsCollection.models.length,
				"eventBus": this.eventBus,
				"rootPath": this.rootPath,
				"shareCopy": this.shareCopy
			});

			this.ui.resultsContainer.view = view;
			this.ui.resultsContainer.el.appendChild(view.el);
			this.state = 'results';
			this.positionThumbs();
			this.questionsCollection.setSelectedQuestion();

			//track
			ga('send', 'event', 'results', 'show', score);
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
			this.state = 'detail';
			this.positionThumbs();
			this.questionsCollection.setSelectedQuestion(questionModel);

			//track
			ga('send', 'event', 'question', 'show', questionModel.get('name'));
		},

		"onShowNextQuestion": function() {
			var topOffset = this.el.getBoundingClientRect().top - 10;

			this.showNextUnansweredQuestion();

			if(topOffset < 0) {
				Utils.animatedScrollBy(topOffset, 300);
			}
		},

		"setAsLastQuestion": function() {
			this.ui.nextQuestionButton[0].textContent = 'Finished';
		}

	});

	return AppView;

})