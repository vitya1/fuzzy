import Tunnel from './tunnel'
import MysqlClient from './mysql-client';

var uuid = require('node-uuid');

'use strict';

var DB_CLIENTS = {
	MYSQL: 0,
	SQL_LITE: 1
};

var DM = function() {
	this.connections = new Map();

	this.validateConfig = function() {
		//@todo
	};

	this.connect = async function(db_config, ssh_config) {
		if(ssh_config != undefined) {
			let tunnel = new Tunnel();
			await tunnel.createTunnel(ssh_config);
		}
		let client = this.getDbClient(db_config);
		if(!client) {
			throw new Error('Couldn\'t get client');
		}

		let connection_id = uuid.v1();
		this.connections.set(connection_id, {
			id: connection_id,
			client: client,
			tunnel: ssh_config,
			db_config: db_config
		});

		return connection_id;
	};

	this.disconnect = function(id) {
		//@todo
		return this.connections.delete(id);
	};

	this.getDbClient = function(db_config) {
		if(!db_config || db_config.type) {
			throw new Error("Error parsing database config");
		}

		var client = null;
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

export default DM;