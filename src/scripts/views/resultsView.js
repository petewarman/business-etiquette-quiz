define([
	'baseView',
	'hbs!../templates/results',
	'utils'
], function(
	BaseView,
	template,
	Utils
) {
	'use strict';

	var prototype = Object.create(BaseView.prototype);

	function ResultsView(options) {
		if (!(this instanceof ResultsView)) {
			return new ResultsView(options);
		}

		BaseView.call(this, options);

		this.rootPath = options.rootPath;
		this.shareCopy = options.shareCopy;
		this.setScore(options.score, options.questionCount);
		this.setEmailShareLink();
	}

	ResultsView.prototype = Utils.extend(prototype, {

		"template": template,

		"className": "results",

		"uiRefs": {
			'title': '.results__title',
			'score': '.results__score',
			'copy': '.results__copy',
			'restartButton': '.results__restart',
			'facebookShareButton': '.results__social-link--facebook',
			'twitterShareButton': '.results__social-link--twitter',
			'linkedinShareButton': '.results__social-link--linkedin',
			'emailShareButton': '.results__social-link--email'
		},

		"uiEvents": {
			'click restartButton': 'onRestartButtonClick',
			'click facebookShareButton': 'shareToFacebook',
			'click twitterShareButton': 'shareToTwitter',
			'click linkedinShareButton': 'shareToLinkedin',
		},

		"setScore": function(score, questionCount){
			this.ui.score[0].innerHTML = score + '/' + questionCount;
		},

		"onRestartButtonClick": function() {
			this.eventBus.trigger('restartQuiz');
		},

		"shareToFacebook": function() {
			var base = "https://www.facebook.com/dialog/feed",
				params = this.shareCopy.facebook;

			params.link = window.location.href;
			params.picture = this.rootPath + 'images/' + this.shareCopy.facebook.picture;

			this.openShareWindow(this.createUrl(base, params), 520, 350);
		},

		"shareToTwitter": function() {
			var base = 'https://twitter.com/intent/tweet',
				params = this.shareCopy.twitter;

			params.text += ' ' + window.location.href;

			this.openShareWindow(this.createUrl(base, params), 520, 350);
		},

		"shareToLinkedin": function() {
			var base = 'https://www.linkedin.com/shareArticle',
				params = this.shareCopy.linkedin;

			params.url = window.location.href;

			this.openShareWindow(this.createUrl(base, params), 520, 350);
		},

		"setEmailShareLink": function() {
			var base = 'mailto:',
				params = this.shareCopy.email;

			params.body += ' ' + window.location.href;

			this.ui.emailShareButton[0].setAttribute('href', this.createUrl(base, params));
		},

		"openShareWindow": function(url, winWidth, winHeight) {
			var winTop = (screen.height / 2) - (winHeight / 2);
			var winLeft = (screen.width / 2) - (winWidth / 2);
			window.open(url, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
		},

		"createUrl": function(base, paramsObj) {
			var params = [];

			Object.keys(paramsObj).forEach(function(key) { 
				params.push(key + '=' + encodeURIComponent(paramsObj[key]));
			});

			return base + '?' + params.join('&');
		}

	});

	return ResultsView;

})