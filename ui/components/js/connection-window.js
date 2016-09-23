import Vue from 'vue';
const ipc = electron.ipcRenderer;

//@todo remove
const Events = new Vue({});

export default {
	name: 'connectionForm',
	ready: function() {
		ipc.on('set-connections', (event, data) => {
			this.items = data;
			this.chooseCon(0);
		});
		ipc.send('get-connections');
		Events.$on('fillProperty', (data) => {
			this.fillProperty(data);
		});
	},
	data: () => {
		return {
			//properties that will be send to core
			t_props: ['type', 'port', 'title', 'host', 'user', 'password', 'ssh_host',
				'ssh_user', 'ssh_password', 'ssh_port', 'ssh_port_local', 'id'],
			items: [],
			active_item: 0
		}
	},
	props: {
		id: String,
		type: {type: 'Integer', default: 10},
		type_options: {
			default: () => {
				return [
					{value: 10, text: 'mysql'},
					{value: 20, text: 'sqlite'}
				]
			}
		},
		port: {
			type: 'Number',
			default: 3306
		},
		title: {type: 'String', default: ''},
		host: {type: 'String', default: ''},
		user: {type: 'String', default: ''},
		password: {type: 'String', default: ''},
		ssh_host: {type: 'String', default: ''},
		ssh_user: {type: 'String', default: ''},
		ssh_password: {type: 'String', default: ''},
		ssh_port: {type: 'String', default: ''},
		ssh_port_local: {type: 'String', default: ''},
	},
	methods: {
		fillProperty: function(conObj) {
			conObj = conObj || {};
			for(let prop_id in this.t_props) {
				let prop = this.t_props[prop_id];
				this[prop] = conObj.hasOwnProperty(prop) ? conObj[prop] : '';
			}
		},
		saveAndConnect: function () {
			let data = {};
			for(let prop_id in this.t_props) {
				let property = this.t_props[prop_id];
				data[property] = this[property];
			}
			ipc.send('connect', data);
		},
		createNewCon: function () {
			this.items.push({title: (new Date()).getSeconds()});
			this.chooseCon(this.items.length - 1);
		},
		removeCon: function () {
			if(this.items[this.active_item] == undefined) {
				return;
			}
			ipc.send('delete-connection', this.items[this.active_item].id);
			this.items.splice(this.active_item, 1);
			if(this.items.length == 0) {
				this.createNewCon();
			}
			else {
				let item_id = this.items[this.active_item] != undefined ? this.active_item : this.active_item - 1;
				this.chooseCon(item_id);
			}
		},
		chooseCon: function (index, event) {
			event && event.preventDefault();
			this.active_item = index;
			Events.$emit('fillProperty', this.items[index]);
		},
	}
}
