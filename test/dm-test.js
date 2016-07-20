import DM from '../database-manager';

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
	var manager = new DM();
	try {
		var c = await manager.connect(mysql_config, ssh_config);
	}
	catch(e) {
		console.log('bad job');
	}

	console.log(c);
	console.log(manager.get(c + '1111'));


}());
