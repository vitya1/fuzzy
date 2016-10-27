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
			active_row: null,
			active_cell: null,
			is_editable: false,
			editing_row: null,
			editing_cell: null,
			databases: [],
			last_query: '',

			log_live_time: 1500,
			log_active: false,
			log_message: '',
			log_full_active: false,
			log_full_messages: [],
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
			this.is_editable = true;
		});
		ipc.on('custom-query-res', (event, data, db_name) => {
			this.active_table = {
				name: 'empty',
				data: data,
				structure: []
			};
			if(data.length > 0) {
				for(let i in data[0]) {
					this.active_table.structure.push({Field: i});
				}
			}
			this.is_editable = false;
		});
		ipc.on('log', (event, message) => {
			console.log('New log event ' + message.text);
			this.log_active = true;
			this.log_message = message.text;
			this.log_full_messages.push(message);
			setTimeout(() => {
				this.log_active = false;
			}, this.log_live_time);
		});
		ipc.on('set-full-log', (event, message) => {
			this.log_full_messages = message;
			//@todo hide spinner
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
		},
		openLog: function() {
			if(!this.log_full_active) {
				ipc.send('get-full-log');
				this.log_full_active = true;
				//@todo show spinner
			}
			else {
				this.log_full_active = false;
			}
		},
		editCell: function(index, row_number) {
			if(this.is_editable) {
 				this.editing_cell = index;
				this.editing_row = row_number;
			}
		},
		chooseCell: function(index, row_number) {
			this.active_cell = index;
			if(this.editing_row != row_number || this.editing_cell != index) {
				//@todo save edited data or save by button click?
				this.editing_cell = null;
				this.editing_row = null;
			}
		}
	}
};