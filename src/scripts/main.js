define([
	'app',
],function(
	app,
	template
){

	'use strict';

	var interactiveEl;
	var rootPath;

	function requestData() {
		// $.getJSON(rootPath + 'json/data.json')
		// 	.done(onDataLoaded)
		// 	.fail(function(){
		// 		console.log('failed to load data.json', arguments);
		// 	});
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", onDataLoaded);
		oReq.open("GET", rootPath + 'json/data.json');
		oReq.send();
	};

	function onDataLoaded() {
		var data = JSON.parse(this.responseText);

		data.rootPath = rootPath;

		//$(interactiveEl).append(template(data));

		app.init({
			"baseEl": interactiveEl,
			"rootPath": rootPath,
			"data": data
		});

		setupGATracking();

	};

	function setupGATracking() {

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-70855359-1', 'auto');
		ga('send', 'pageview');

	}

	function init(el, root) {
		interactiveEl = el;
		rootPath = root;

		requestData();
	};

	return {
		init: init
	};

});