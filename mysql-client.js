var mysql = require('mysql');

//@todo extend DbClient?
class MysqlClient {
	useDatabase(db_name) {
		//@todo query logging
		let query_str = `USE ${db_name};`;

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

	showTables() {

	}

}

export default MysqlClient;