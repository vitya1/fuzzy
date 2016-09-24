const ipc = electron.ipcRenderer;
export default {
	name: 'Main',
	ready: function() {
		console.log('hi main');
	}
};