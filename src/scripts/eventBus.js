define(function() {
	'use strict';

	function EventBus() {

		this._listeners = [];

	}

	EventBus.prototype = {

		"on": function(event, callback, context) {

			this._listeners.push({
				'event': event,
				'callback': callback,
				'context': context
			});

		},

		"off": function(event, callback) {

			this._listeners = this._listeners.filter(function(listener){
				return (listener.event !== event || listener.callback !== callback) 
			}, this);

		},

		"trigger": function(event, attrs) {

			this._listeners.forEach(function(listener) {
				if(listener.event === event) {
					listener.callback.apply(listener.context, [attrs]);
				}
			});


		}

	};

	return EventBus;

})