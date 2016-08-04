'use strict';

import DatabaseManager from './database-manager';
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

const Logger = function() {
	this.messages = [];

	this.add = function(message) {
		this.messages.push({
			timestamp: Date.now(),
			message: message
		});
	};
};


//while queue is not empty push new task to client

//each db client has its own query queue
const AppServer = function() {
	this.db_manager = new DatabaseManager();
	this.query_logger = new Logger();
	this.queues = new Map();

	this.connect = async function(db_conf, ssh_conf, port_config) {
		let connection_id = await this.db_manager.connect(db_conf, ssh_conf, port_config);
		this.initQueue(connection_id);
		console.log('Connection id ' + connection_id);
		return connection_id;
	};

	this.close = function(connection_id) {
		this.queues.delete(connection_id);
		//@todo do not forget to unbind events
		return this.db_manager.close(connection_id);
	};

	this.push = function(connection_id, command, params) {
		console.log('command pushed ' + command);
		console.log(this.queues.has(connection_id));
		this.queues.get(connection_id).push({
			id: connection_id,
			name: command,
			params: params
		});
	};

	this.initQueue = function(connection_id) {
		let queue = new Queue();
		queue.on('push', () => {
			console.log('Exec queue commands');
			this.exec(connection_id);
		});
		console.log('New queue inited, id ' + connection_id);
		this.queues.set(connection_id, queue);
	};

	this.exec = async function(connection_id) {
		let queue = this.queues.get(connection_id);
		let db_client = this.db_manager.get(connection_id);
		if(!queue || !db_client) {
			console.log('DB client or queue doesnt exist');
			return undefined;
		}
		console.log('Queue emptiness: ' + queue.isEmpty());
		while(!queue.isEmpty()) {
			let command = queue.shift();
			if(db_client[command.name] && typeof db_client[command.name] === 'function') {
				console.log('Execute command', command);
				//let params = (command.params).isArray() ? command.params : [command.params];
				let result = await db_client[command.name].apply(db_client, command.params);
				this.query_logger.add(db_client.last_query);
				console.log(result);
			}
			else {
				console.log('Command ' + command.name + ' is not a function or doesnt exist');
			}
		}
	};
};

export default AppServer;
