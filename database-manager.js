'use strict';

import Tunnel from './tunnel'
import MysqlClient from './mysql-client';

const uuid = require('node-uuid');


const DB_CLIENTS = {
	MYSQL: 0,
	SQL_LITE: 1
};

var DatabaseManager = function() {
	//todo move to app_server?
	this.connections = new Map();

	this.validateConfig = function() {
		//@todo
	};

	//@todo now we have to set local port two times (to db_config and to port_config) - refactor
	this.connect = async function(db_config, ssh_config, port_config) {
		let tunnel = null;
		if(!!ssh_config && !!port_config) {
			console.log('Trying to create tunnel');
			tunnel = new Tunnel();
			await tunnel.createTunnel(ssh_config, port_config[0], port_config[1]);
		}
		let client = this.createDbClient(db_config);
		if(!client) {
			throw new Error('Couldn\'t get client');
		}

		let connection_id = uuid.v1();
		this.connections.set(connection_id, {
			id: connection_id,
			client: client,
			tunnel: tunnel,
			tunnel_config: ssh_config,
			db_config: db_config
		});

		return connection_id;
	};

	this.close = function(id) {
		let connection = this.connections.get(id);
		if(!connection) {
			console.log('nothing to close');
			return false;
		}
		//@todo maybe these actions below are redundant
		connection.client.end();
		if(connection.tunnel) {
			connection.tunnel.close();
		}
		return this.connections.delete(id);
	};

	this.createDbClient = function(db_config) {
		if(!db_config || db_config.type) {
			throw new Error("Error parsing database config");
		}

		let client = null;
		switch(db_config.type) {
			case DB_CLIENTS.MYSQL:
				let mysql = new MysqlClient();
				client = mysql.createDbConnection(db_config);
				break;
			case DB_CLIENTS.SQL_LITE:
				client = {name: 'I am mr sqlite connection. Look at me.'};
				break;
			default:
				throw new Error('Unknown database type');
		}

		return client;
	};

	this.get = function(id) {
		if(!this.connections.has(id)) {
			console.log('Connection have not been found by id: ' + id);
			return undefined;
		}
		return this.connections.get(id).client;
	}

};

export {DB_CLIENTS};
export default DatabaseManager;