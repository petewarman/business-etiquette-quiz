define([
	'baseView',
	'hbs!../templates/thumb',
	'utils'
], function(
	BaseView,
	template,
	Utils
) {
	'use strict';

	var prototype = Object.create(BaseView.prototype);

	function ThumbView(options) {

		if (!(this instanceof ThumbView)) {
			return new ThumbView(options);
		}

		this.transitionCount = 0;

		BaseView.call(this, options);
	}

	ThumbView.prototype = Utils.extend(prototype, {

		"template": template,

		"className": "thumb",

		"modelEvents": {
			'change:selected': 'onChangeSelected',
			'change:state': 'onChangeState'
		},

		"uiRefs": {
			'box': '.thumb__box',
			'smallBox': '.thumb__box--small',
			'text': '.thumb__text',
			'image': '.thumb__image'
		},

		"onChangeSelected": function() {
			if(this.model.get('selected')) {
				Utils.addClass(this.el, 'is-selected');
			} else {
				Utils.removeClass(this.el, 'is-selected');
			}
		},

		"onChangeState": function() {
			if(this.model.get('state') === 'answered') {
				if(this.model.get('isCorrect')) {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--correct');
				} else {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--wrong');
				}
			} else {
				Utils.removeClass(this.el, 'is-answered');
				Utils.removeClass(this.el, 'is-answered--correct');
				Utils.removeClass(this.el, 'is-answered--wrong');

			}
		}

	});

	return ThumbView;

})