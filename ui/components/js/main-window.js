const ipc = electron.ipcRenderer;
export default {
	name: 'Main',
	data: () => {
		return {
			id: null,
			databases: []
		}
	},
	ready: function() {
		this.id = this.$route.params.id;
		ipc.send('show-databases', this.id);
		ipc.on('set-databases', (event, data) => {
			this.databases = data;
		});
	}
};