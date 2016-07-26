var mysql = require('mysql');

//@todo extend DbClient?
class MysqlClient {

	createDbConnection(config) {
		this.connection = mysql.createConnection(config);
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

	execRawQuery(query) {
		this.last_query = query;
		//@todo add query checker
		return new Promise(async (resolve, reject) => {
			this.connection.query(this.last_query, (err, data) => {
				if(err) {
					console.log(err);
					return reject(err);
				}
				resolve(data);
			});
		});
	}

}

export default MysqlClient;