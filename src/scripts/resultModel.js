define([
	'utils',
	'baseModel'
], function(
	Utils,
	BaseModel
) {
	'use strict';

	var prototype = Object.create(BaseModel.prototype);

	function Result(data, options){

		if (!(this instanceof Result)) {
			return new Result(data);
		}

		BaseModel.call(this, data, options);

		var defaults = {};

		this.properties = Utils.extend(defaults, data); 

	}

	Result.prototype = Utils.extend(prototype, {



	});

	return Result;

})