import Tunnel from 'tunnel';
import MysqlClient from 'mysql-client';

let tunnel = new Tunnel();
let mysql = new MysqlClient();

var DB_CLIENTS = {
	MYSQL: 0,
	SQL_LITE: 1
};

var DM = function() {

	this.connect = function(db_config, ssh_config) {
		if(ssh_config != undefined) {
			tunnel.createTunnel(ssh_config).then(() => {
				this.getDbConnection(db_config);
			});
		}
		else {
			this.getDbConnection(db_config);
		}
	};

	this.getDbConnection = function(db_config) {
		//choose client by type and return client object and maybe save object into container
	}

};

