'use strict';

var net = require('net');
var Client = require('ssh2').Client;


const LOCALHOST = '127.0.0.1';

let tunnels_container = [];
//@todo maybe class?
function Tunnel() {

	this.createTunnel = function (ssh_config, local_port, host_port) {
		return new Promise(async (resolve, reject) => {
			//@todo collect servers in server container
			this.server = net.createServer((conn) => {
				//@todo install debug module
				console.log('Create server');

				let ssh_connection = new Client();
				ssh_connection.on('ready', () => {
					ssh_connection.forwardOut(LOCALHOST, local_port, ssh_config.host, host_port,
						function(err, stream) {
							if(err) {
								console.log(err);
							}
							conn.pipe(stream).pipe(conn);
							resolve();
							stream.on('close', () => {
								ssh_connection.end();
								reject();
							});
						}
					);
				}).on('error', (err) => {
					console.log(err);
					reject();
				}).connect(ssh_config);
			});

			this.server.listen(local_port, LOCALHOST, (err) => {
				console.log('server listening');
				resolve();
				//@todo need beautiful error handling
				if(err) {
					console.log(err);
				}
			});
		});
	};

	this.close = function() {
		if(!this.server) {
			console.log('server not found');
			return false;
		}

		this.server.close();
		this.server = null;
		return true;
	};
}

export default Tunnel;
