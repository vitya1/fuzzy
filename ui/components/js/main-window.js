const ipc = electron.ipcRenderer;
export default {
	data: () => {
		return {
			id: null,
			active_db: null,
			active_table: {
				name: null,
				structure: [],
				data: []
			},
			databases: [],
			last_query: ''
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
		ipc.on('set-table', (event, data, db_name) => {
			console.log(data);
			this.active_table.data = data.data;
			this.active_table.structure = data.structure;
		});
		ipc.on('custom-query-res', (event, data, db_name) => {
			this.active_table.data = data;
			this.active_table.structure = [];
			if(data.length > 0) {
				for(let i in data[0]) {
					this.active_table.structure.push({Field: i});
				}
			}
		});
	},
	methods: {
		chooseDb: function(index, event) {
			this.active_db = index;
			ipc.send('show-tables', this.id, [index]);
		},
		chooseTable: function(index, event) {
			this.active_table.name = index;
			ipc.send('choose-table', this.id, [index]);
		},
		customQuery: function(event) {
			ipc.send('custom-query', this.id, [this.last_query]);
		}
	}
};