var net = require('net');
var Client = require('ssh2').Client;

'use strict';

const LOCALHOST = '127.0.0.1';

let tunnels_container = [];
//@todo maybe class?
function Tunnel() {

	this.createTunnel = function (ssh_config, local_port, host_port) {
		return new Promise((resolve, reject) => {
			/**
			 * @todo collect servers in server container
			 */
			var server = net.createServer((conn) => {
				//@todo install debug module
				console.log('Create server');

				var ssh_connection = new Client();
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

			server.listen(local_port, LOCALHOST, (err) => {
				console.log('server listening');
				//@todo need beautiful error handling
				if(err) {
					console.log(err);
				}
			});
		});
	}
}

export default Tunnel;
