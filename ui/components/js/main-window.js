const ipc = electron.ipcRenderer;
export default {
	name: 'Main',
	data: () => {
		return {
			id: null
		}
	},
	ready: function() {
		this.id = this.$route.params.id;

	}
};