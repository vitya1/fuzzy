require('./ui/main.js');
var ipc = electron.ipcRenderer;

var closeEl = document.querySelector('#open_session');
closeEl.addEventListener('click', function () {

	ipc.send('open-session', data);
	//ipc.send('close-main-window');
});