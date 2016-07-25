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

		return new Promise(async (resolve, reject) => {
			this.connection.query(query_str, function(err, data) {
				if(err) {
					console.log(err);
					return reject(err);
				}
				console.log('Data received from Db:' + data);
				resolve(data);
			});
		});
	}

	showTables() {
		//@todo query logging
		let query_str = `SHOW TABLES;`;

		return new Promise(async (resolve, reject) => {
			this.connection.query(query_str, function(err, data) {
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