import Tunnel from '../tunnel'

'use strict';



var ssh_config = {
	//privateKey: require('fs').readFileSync('/here/is/my/key')
	host: '192.168.33.12',
	port: 22,
	username: 'vagrant',
	password: 'vagrant'
};

let tun = new Tunnel();

setInterval(async () => {
	await tun.createTunnel(ssh_config, 3307, 3306);
	tun.close();
	console.log(process.memoryUsage().heapUsed);
}, 50);
