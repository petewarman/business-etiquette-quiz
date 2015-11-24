define([
	'utils',
	'eventBus'
], function(
	Utils,
	EventBus
) {
	'use strict';

	var prototype = Object.create(EventBus.prototype);

	function BaseModel(properties, options){

		this.options = options;
		this.properties = properties; 
		this._listeners = [];

	}

	BaseModel.prototype = Utils.extend(prototype, {

		"properties": [],

		"_listeners": [],

		"get": function(property) {
			return this.properties[property];
		},

		"set": function(property, value) {
			if(this.properties[property] !== value) {
				this.properties[property] = value;
				this.trigger('change:'+ property);
			}
		}

	});

	return BaseModel;

})