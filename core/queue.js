const EventEmitter = require('events');
const util = require('util');

const Queue = function () {
	this.commands = [];

	this.push = function(command) {
		this.commands.push(command);
		this.emit('push', command);
	};

	this.shift = function() {
		this.emit('shift');
		return this.commands.shift();
	};

	this.isEmpty = function() {
		return this.commands.length == 0;
	}
};

util.inherits(Queue, EventEmitter);

export default Queue;