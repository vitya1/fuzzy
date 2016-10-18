const ipc = electron.ipcRenderer;
export default {
	data: () => {
		return {
			id: null,
			active_db: null,
			databases: []
		}
	},
	ready: function() {
		this.id = this.$route.params.id;
		ipc.send('show-databases', this.id);
		ipc.on('set-databases', (event, data) => {
			for(let item in data) {
				let db_name = data[item];
				this.databases.push({
					name: db_name,
					tables: []
				});
			}
		});
		ipc.on('set-tables', (event, data, db_name) => {
			for(let item in this.databases) {
				if(this.databases[item].name == db_name) {
					this.databases[item].tables = data;
					break;
				}
			}
		});
	},
	methods: {
		useDb: function(index, event) {
			this.active_db = index;
			ipc.send('show-tables', this.id, [index]);
		}
	}
};