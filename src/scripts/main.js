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