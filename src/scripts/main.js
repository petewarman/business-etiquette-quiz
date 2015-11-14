define([
	'jquery',
	'app',
],function(
	$,
	app,
	template
){

	'use strict';

	var interactiveEl;
	var rootPath;

	function requestData() {
		$.getJSON(rootPath + 'json/data.json')
			.done(onDataLoaded)
			.fail(function(){
				console.log('failed to load data.json', arguments);
			});
	};

	function onDataLoaded(data) {
		data.rootPath = rootPath;

		//$(interactiveEl).append(template(data));

		app.init({
			"baseEl": interactiveEl,
			"rootPath": rootPath,
			"data": data
		});
	};

	function init(el, root) {
		interactiveEl = el;
		rootPath = root;

		requestData();
	};

	return {
		init: init
	};

});