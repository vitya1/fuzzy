import Tunnel from '../tunnel'

'use strict';



var ssh_config = {
	//privateKey: require('fs').readFileSync('/here/is/my/key')
	host: '192.168.33.12',
	port: 22,
	username: 'vagrant',
	password: 'vagrant'
};

let tunnel = (new Tunnel()).createTunnel(ssh_config, 3307, 3306).then(function() {
	console.log('probably success');
});