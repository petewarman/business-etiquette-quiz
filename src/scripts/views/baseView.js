define([
	'utils'
], function(
	Utils
) {
	'use strict';

	function BaseView(options) {
		if(options.model) {
			this.model = options.model;
		} else {
			this.model = {
				"properties": {}
			};
		}

		if(options.eventBus) {
			this.eventBus = options.eventBus;
		}

		this.bindContext();
		this.bindUiEventContexts();
		this.addDataEventListeners();
		this.render();
		this.getUiRefs();
		this.addUiEventListeners();

	}

	BaseView.prototype = {


	// Utils.extend(baseProto, {
		
	//});

	// var proto = {

		"tagName": "div",

		"className": "view",

		"template": function() { return ''; },

		"uiRefs": {},

		"modelEvents": {},

		"uiEvents": {},

		"bindContext": function() {},

		"bindUiEventContexts": function() {
			Object.keys(this.uiEvents).forEach(function (event) { 
				this[this.uiEvents[event]] = this[this.uiEvents[event]].bind(this);
			}, this);
		},

		"render": function() {
			this.el = document.createElement(this.tagName);
			this.el.className = this.className;
			this.el.innerHTML = this.template(this.model.properties);
		},

		"addDataEventListeners": function() {
			if(this.model && this.model.on) {
				Object.keys(this.modelEvents).forEach(function (event) { 
					var handler = this[this.modelEvents[event]];
					this.model.on(event, handler, this);
				}, this);
			}
		},

		"getUiRefs": function() {
			this.ui = {};

			Object.keys(this.uiRefs).forEach(function (key) { 
				this.ui[key] = this.el.querySelectorAll(this.uiRefs[key]);
			}, this);
		},

		"addUiEventListeners": function() {
			Object.keys(this.uiEvents).forEach(function (event) { 
				var listener = this[this.uiEvents[event]],
					parts = event.split(' '),
					eventType = parts[0],
					uiRef = this.ui[parts[1]] || null; 

				if(uiRef && uiRef.length > 0) {
					[].forEach.call(uiRef, function(el){
						el.addEventListener(eventType, listener);
					}, this);
				} else {
					this.el.addEventListener(eventType, listener);
				}
			}, this);
		},

		"removeUiEventListeners": function() {
			Object.keys(this.uiEvents).forEach(function (event) { 
				var listener = this[this.uiEvents[event]],
					parts = event.split(' '),
					eventType = parts[0],
					uiRef = this.ui[parts[1]] || null; 

				if(uiRef) {
					[].forEach.call(uiRef, function(el){
						el.removeEventListener(eventType, listener);
					}, this);
				} else {
					this.el.removeEventListener(eventType, listener);
				}
			}, this);
		}

	};

	return BaseView;

})