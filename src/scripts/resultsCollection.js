define([
	'resultModel'
], function(
	Model
) {
	'use strict';

	function ResultCollection(resultData, options) {

		if (!(this instanceof ResultCollection)) {
			return new ResultCollection(resultData);
		}

		this.eventBus = options.eventBus;
		this.models = [];

		if(resultData){
			resultData.forEach(this.addModel, this);
		}
	}

	ResultCollection.prototype = {

		"addModel": function(modelData) {
			this.models.push(new Model(modelData, {
				'eventBus': this.eventBus
			}));
		},

		"getResultModelByScore": function(score) {
			return this.models.filter(function(model){
				return (model.get('scores').indexOf(score) > -1);
			})[0];
		}

	};

	return ResultCollection;

})