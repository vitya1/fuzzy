import DatabaseManager from '../database-manager';
import AppServer from '../app-server';

var ssh_config = {
	//privateKey: require('fs').readFileSync('/here/is/my/key')
	host: '192.168.33.12',
	port: 22,
	username: 'vagrant',
	password: 'vagrant'
};

var mysql_config = {
	type: 0,
	host: '127.0.0.1',
	user: 'root',
	password: '',
	port: 3307
};

(async function () {
	var manager = new DatabaseManager();
	try {
		var c = await manager.connect(mysql_config, ssh_config, [3307, 3306]);
	}
	catch(e) {
		console.log('bad job');
	}
	console.log(c);
}());

(async function () {
	let app = new AppServer();
	let id = await app.connect(mysql_config, ssh_config, [3307, 3306]);
	app.push(id, 'useDatabase', ['bingo']);
	app.push(id, 'showTables');
})();
