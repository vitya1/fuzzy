var ipc = require('electron').ipcRenderer;

var closeEl = document.querySelector('#open_session');
closeEl.addEventListener('click', function () {
	var data = {
		session_network_type: document.querySelector('#session_network_type').value,
		session_host_ip: document.querySelector('#session_host_ip').value,
		session_port: document.querySelector('#session_port').value,
		session_user: document.querySelector('#session_user').value,
		session_password: document.querySelector('#session_password').value,
		session_comment: document.querySelector('#session_comment').value,

		session_ssh_host: document.querySelector('#session_ssh_host').value,
		session_ssh_user: document.querySelector('#session_ssh_user').value,
		session_ssh_port: document.querySelector('#session_ssh_port').value,
		session_ssh_password: document.querySelector('#session_ssh_password').value,
		session_ssh_port_local: document.querySelector('#session_ssh_port_local').value
	};

	data = { session_comment: '',
		session_host_ip: '127.0.0.1',
		session_network_type: '1',
		session_password: '',
		session_port: '3306',
		session_ssh_host: '192.168.33.12',
		session_ssh_password: 'vagrant',
		session_ssh_port: '22',
		session_ssh_port_local: '3306',
		session_ssh_user: 'vagrant',
		session_user: 'root' };

	ipc.send('open-session', data);
	//ipc.send('close-main-window');
});