var mysql = require('mysql');

//@todo extend DbClient?
class MysqlClient {
	//@todo make current database variable. It should check database on client and "current db" at each query
	//this.current_database = null;

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
		return this.execRawQuery(query_str, this.extractValues);
	}

	showDatabases() {
		let query_str = `SHOW DATABASES;`;
		return this.execRawQuery(query_str, this.extractValues);
	}

	/**
	 * Extract values array from the query result array
	 * @param data
	 * @returns {Array}
	 */
	extractValues(data) {
		let res = [];
		for(let item in data) {
			if(!data.hasOwnProperty(item)) {
				continue;
			}
			for(let key in data[item]) {
				if(!data[item].hasOwnProperty(key)) {
					continue;
				}
				res.push(data[item][key]);
				break;
			}
		}
		return res;
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