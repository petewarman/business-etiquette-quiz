define([
	'underscore',
	'eventBus'
], function(
	_,
	EventBus
) {
	'use strict';

	function BaseModel(data, options){

		this.options = options;

	}

	BaseModel.prototype = _.extend({

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

	}, EventBus.prototype);

	return BaseModel;

})