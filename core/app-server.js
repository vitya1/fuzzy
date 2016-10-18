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
		//console.log('Connection id ' + connection_id);
		return connection_id;
	};

	this.close = function(connection_id) {
		this.queues.delete(connection_id);
		//@todo do not forget to unbind events
		return this.db_manager.close(connection_id);
	};

	/**
	 * Pushes a command to the command queue
	 * @param connection_id
	 * @param command
	 * @param params
	 * @param callback
	 */
	this.push = function(connection_id, command, params, callback) {
		//console.log(this.queues.has(connection_id));
		var cmd = {
			id: connection_id,
			name: command
		};
		if(params != undefined && Array.isArray(params)) {
			cmd.params = params;
		}
		//console.log(arguments);
		let handler = this.getHandlerArgument(arguments);
		//console.log('Handler: ' + handler);
		if(handler != null) {
			cmd.callback = handler;
		}
		//console.log('Command pushed: ');
		//console.log(cmd);
		this.queues.get(connection_id).push(cmd);
	};

	this.initQueue = function(connection_id) {
		let queue = new Queue();
		queue.on('push', () => {
			//console.log('Exec queue commands');
			this.exec(connection_id);
		});
		//console.log('New queue inited, id ' + connection_id);
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
			//console.log('Command: ');
			//console.log(command);
			if(db_client[command.name] && typeof db_client[command.name] === 'function') {
				//console.log('Execute command', command);
				let result = await db_client[command.name].apply(db_client, command.params);
				this.query_logger.add(db_client.last_query);
				//console.log('CALLBACK: ');
				//console.log(result);
				if(command.hasOwnProperty('callback')) {
					command.callback(result);
				}
			}
			else {
				console.log('Command ' + command.name + ' is not a function or doesnt exist');
			}
		}

	};

	/**
	 * Returns callback if the last arg is function or null if not
	 * @param args
	 * @returns {Function|null}
	 */
	this.getHandlerArgument = function (args) {
		if(args == undefined || !(typeof args === 'object')) {
			return null;
		}
		let handler = args[Object.keys(args).length - 1];
		return (typeof handler === 'function') ? handler : null;
	};
};

export default AppServer;
