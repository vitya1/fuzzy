var Vue = require('vue');
var ipc = electron.ipcRenderer;

var Events = new Vue({});

let connectionForm = {
	template: '#connection-form-template',
	ready: function () {

		Events.$on('fillProperty', (data) => {
			this.fillProperty(data);
		});
	},
	data: () => {
		return {
			//properties that will be send to core
			t_props: ['type', 'port', 'title', 'host', 'user', 'password', 'ssh_host',
				'ssh_user', 'ssh_password', 'ssh_port', 'ssh_port_local']
		}
	},
	props: {
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
			for(let prop in conObj) {
				if(this.hasOwnProperty(prop)) {
					this[prop] = conObj[prop];
				}
			}
		},
		saveAndConnect: function () {
			let data = {};
			for(let prop_id in this.t_props) {
				let property = this.t_props[prop_id];
				data[property] = this[property];
			}
			//console.log(data);
			ipc.send('connect', data);
		}
	},
	components: {
		'connections-list': {
			template: '#connections-list-template',
			data: function() {
				return {
					items: [],
					active_item: 0
				}
			},
			ready: function() {
				ipc.on('set-connections', (event, data) => {
					this.items = data;
				});
				ipc.send('get-connections');
			},
			methods: {
				createNewCon: function () {
					this.items.push({title: (new Date()).getSeconds()});
					Events.$emit('fillProperty', this.items[this.items.length]);
				},
				removeCon: function () {
					this.items.splice(this.active_item, 1);
				},
				chooseCon: function (index, event) {
					event.preventDefault();
					this.active_item = index;
					Events.$emit('fillProperty', this.items[index]);
				},
			},
		}
	}
};

let app = new Vue({
	el: '#app',
	components: {
		'connection-form': connectionForm
	}
});

Vue.config.debug = true;