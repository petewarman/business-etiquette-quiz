define([
	'hbs!../templates/app',
	'baseView',
	'thumbView',
	'detailView',
	'resultsView',
	'utils'
], function(
	template,
	BaseView,
	ThumbView,
	DetailView,
	ResultsView,
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
				"closeDetailButton": this.el.querySelectorAll('.close-detail'),
				"nextQuestionButton": this.el.querySelectorAll('.next-question')
			};
		},

		"uiEvents": {
			'click nextQuestionButton': 'onNextButtonClick',
			'click closeDetailButton': 'onCloseButtonClick'
		},

		"bindContext": function() {
			this.onResize = this.onResize.bind(this);
			this.startIntro = this.startIntro.bind(this);
		},

		"addEventBusListeners": function() {
			this.eventBus.on('questionSelected', this.displayDetail, this);
			this.eventBus.on('thumbIntroComplete', this.onThumbIntroComplete, this);
			this.eventBus.on('restartQuiz', this.restartQuiz, this);
			this.eventBus.on('answerSelected', this.onAnswerSelected, this);
		},

		"onAnswerSelected": function() {
			if(this.questionsCollection.getUnansweredQuestionCount() === 0) {
				this.setAsLastQuestion();
			}

			this.activateButton(this.ui.nextQuestionButton[0]);
		},

		"activateButton": function(button) {
			Utils.addClass(button, 'is-active');
			button.setAttribute('role', 'button');
			button.setAttribute('tabindex', '0');
		},

		"deactivateButton": function(button) {
			Utils.removeClass(button, 'is-active');
			button.removeAttribute('role');
			button.removeAttribute('tabindex');
		},

		"restartQuiz": function() {
			this.questionsCollection.reset();
			this.displayGrid();
		},

		"onThumbIntroComplete": function(thumbModel) {
			this.thumbIntrosCompleted++;

			if(this.thumbIntrosCompleted >= this.questionsCollection.models.length) {
				if(this.state === 'map'){
					this.displayGrid();
				}
			}
		},

		"onResize": function() {
			this.positionThumbs();
		},

		"startIntro": function() {
			console.log('startIntro');
			this.state = 'map';
			this.positionThumbs();
			this.thumbIntrosCompleted = 0;
			Utils.removeClass(this.el, 'intro');
			if(!Utils.supportsTransitions()) {
				console.log('no transition support detected');
				this.displayGrid();
			}
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
					Utils.removeClass(this.el, 'intro');
					Utils.removeClass(this.el, 'results-view');
					this.positionThumbsAsGrid();
					break;
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
			}
		},

		"positionThumbsAsMap": function() {
			var containerWidth = this.ui.thumbsContainer.el.getBoundingClientRect().width,
				thumbSize = 2,
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
				thumbView.updateBox(thumbSize);

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
			if(this.state !== 'map') {
				this.state = 'detail';
				this.positionThumbs();
				this.activateButton(this.ui.closeDetailButton[0]);
				this.questionsCollection.setSelectedQuestion(questionModel);
			}
		},

		"displayGrid": function() {
			this.state = 'grid';
			this.positionThumbs();
			this.deactivateButton(this.ui.nextQuestionButton[0]);
			this.questionsCollection.setSelectedQuestion();
		},

		"onNextButtonClick": function() {
			this.deactivateButton(this.ui.nextQuestionButton[0]);
			this.showNextUnansweredQuestion();
		},

		"onCloseButtonClick": function() {
			this.displayGrid();
		},

		"setAsLastQuestion": function() {
			this.ui.nextQuestionButton[0].textContent = 'Finished';
			this.deactivateButton(this.ui.closeDetailButton[0]);
		}

	});

	return AppView;

})