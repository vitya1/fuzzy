var mysql = require('mysql');

//@todo extend DbClient?
class MysqlClient {

	createDbConnection(config) {
		this.config = config;
		this.connection = mysql.createConnection(config);
		this.connection.connect((err) => {
			if(err) {
				console.error('error connecting: ' + err.stack);
				return;
			}
			console.log('connected as id ' + this.connection.threadId);
		});
		return this;
	}

	end() {
		if(this.connection) {
			this.connection.end(() => {
				this.connection = null;
			});
		}
	}

	useDatabase(db_name) {
		//@todo query logging
		let query_str = `USE ${db_name};`;
		return this.execRawQuery(query_str);
	}

	showTables() {
		let query_str = `SHOW TABLES;`;
		return this.execRawQuery(query_str);
	}

	showDatabases() {
		let query_str = `SHOW DATABASES;`;
		return this.execRawQuery(query_str, function(data) {
			let res = [];
			for(var item in data) {
				res.push(data[item].Database);
			}
			return res;
		});
	}

	/**
	 * Execute raw query and return Promise
	 * @param query Sql query string
	 * @param handler Prepare data to custom format by user function
	 * @returns {Promise}
	 */
	execRawQuery(query, handler) {
		this.last_query = query;
		//@todo add query checker
		return new Promise(async (resolve, reject) => {
			this.connection.query(this.last_query, (err, data) => {
				if(err) {
					console.log(err);
					return reject(err);
				}
				if(handler != undefined && typeof handler === 'function') {
					data = handler(data);
				}
				resolve(data);
			});
		});
	}

}

export default MysqlClient;