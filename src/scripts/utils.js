define(function() {
	'use strict';

	var utils = {

		"addClass": function(el, className) {
			var classNames = el.className.split(' ');
			if(classNames.indexOf(className) === -1) {
				classNames.push(className);
				el.className = classNames.join(' ');
			}
		},

		"removeClass": function(el, className) {
			var classNames = el.className.split(' '),
				index = classNames.indexOf(className);

			if(index > -1) {
				classNames.splice(index, 1);
				el.className = classNames.join(' ');
			}
		},

		"hasClass": function(el, className) {
			var classNames = el.className.split(' ');
			return classNames.indexOf(className) > -1;
		},

		"getParentsWithClass": function (el, className) {
			var parents = [];

			// Get matches
			for ( ; el && el !== document; el = el.parentNode ) {
				if (this.hasClass(el, className)) {
					parents.push( el );
				}
			}

			// Return parents if any exist
			if ( parents.length === 0 ) {
				return null;
			} else {
				return parents;
			}

		},

		"extend": function(a, b) {
			for(var prop in b) {
				if(b.hasOwnProperty(prop)) {
					a[prop] = b[prop];
				}
			}

			return a;
		},

		"debounce": function(func, wait, immediate) {
			var timeout, args, context, timestamp, result;

			var later = function() {
				var last = Date.now() - timestamp;

				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						if (!timeout) context = args = null;
					}
				}
			};

			return function() {
				context = this;
				args = arguments;
				timestamp = Date.now();
				var callNow = immediate && !timeout;
				if (!timeout) timeout = setTimeout(later, wait);
				if (callNow) {
					result = func.apply(context, args);
					context = args = null;
				}

				return result;
			};
		},

		"supportsTransitions": function() {
			var b = document.body || document.documentElement,
				s = b.style,
				p = 'transition';

			if (typeof s[p] == 'string') { return true; }

			// Tests for vendor specific prop
			var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
			p = p.charAt(0).toUpperCase() + p.substr(1);

			for (var i=0; i<v.length; i++) {
				if (typeof s[v[i] + p] == 'string') { return true; }
			}

			return false;
		},

		"getScrollTop": function() {
			return document.documentElement.scrollTop || document.body.scrollTop;
		},

		"animatedScrollBy": function(yDiff, duration) {
			if(!this.scrollIsAnimating) {
				this.scrollIsAnimating = true;
				this.scrollAnimationDuration = duration;
				this.scrollAnimationYDiff = yDiff;
				this.scrollAnimationInitialPosition = this.getScrollTop();
				window.requestAnimationFrame(this.animatedScrollByStep.bind(this));
			}
		},

		"animatedScrollByStep": function(timestamp) {
			if(!this.scrollAnimationStart) { this.scrollAnimationStart = timestamp; }
			var progress = (timestamp - this.scrollAnimationStart) / this.scrollAnimationDuration;

			if(progress >= 1) {
				window.scroll(0, this.scrollAnimationInitialPosition + this.scrollAnimationYDiff);
				this.scrollIsAnimating = false;
				this.scrollAnimationDuration = 0;
				this.scrollAnimationYDiff = 0;
				this.scrollAnimationStart = false;
			} else {
				window.scroll(0, this.scrollAnimationInitialPosition + progress * this.scrollAnimationYDiff);
				window.requestAnimationFrame(this.animatedScrollByStep.bind(this));
			}
		}

	};

	return utils;

})