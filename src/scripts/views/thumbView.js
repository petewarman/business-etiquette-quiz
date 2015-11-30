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

		this.el.setAttribute('role', 'button');
		this.el.setAttribute('tabindex', '0');
		this.updateBox = this.updateBox.bind(this);
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

		"uiEvents": {
			'click': 'onElClick',
			'transitionend': 'onTransitionend'
		},

		"updateBox": function(thumbWidth) {
			var textWidth = this.ui.text[0].offsetWidth,
				boxWidth = this.ui.box[0].offsetWidth,
				offsetDifference = 8, // differece in right offset between text and box. 
				pxDiff = boxWidth - (textWidth - offsetDifference),  
				dashOffset = 0;

			if(pxDiff < 0) {
				dashOffset = 120;
			} else {
				dashOffset = ((textWidth) / boxWidth) * 100 + 10;
			}

			this.ui.box[0].setAttribute('stroke-dashoffset', dashOffset);
			this.ui.smallBox[0].setAttribute('stroke-dashoffset', dashOffset);
		},

		"onElClick": function(e) {
			this.eventBus.trigger('questionSelected', this.model);
		},

		"onTransitionend": function() {
			this.transitionCount++;
			if(this.transitionCount >= 6) {
				this.eventBus.trigger('thumbIntroComplete', this.model);
				this.el.removeEventListener('transitionend', this.onTransitionend);
			}
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
				this.removeUiEventListeners();

				this.el.removeAttribute('role');
				this.el.removeAttribute('tabindex');

				if(this.model.get('isCorrect')) {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--correct');
				} else {
					Utils.addClass(this.el, 'is-answered');
					Utils.addClass(this.el, 'is-answered--wrong');
				}
			} else {
				this.addUiEventListeners();

				this.el.setAttribute('role', 'button');
				this.el.setAttribute('tabindex', '0');

				Utils.removeClass(this.el, 'is-answered');
				Utils.removeClass(this.el, 'is-answered--correct');
				Utils.removeClass(this.el, 'is-answered--wrong');

			}
		}

	});

	return ThumbView;

})