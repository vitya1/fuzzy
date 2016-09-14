var Vue = require('vue');
var ipc = electron.ipcRenderer;

var Events = new Vue({});

var connectionForm = Vue.component('connection-form', {
	template: '#connection-form-template',
	ready: function () {

		Events.$on('fillProperty', (data) => {
			this.fillProperty(data);
		});
	},
	props: {
		types: {
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
			for(var prop in conObj) {
				if(this.hasOwnProperty(prop)) {
					this[prop] = conObj[prop];
				}
			}
		}
	}
});

var connections = new Vue({
	el: '#connections-list',
	data: {
		items: [],
		active_item: 0
	},
	ready: function() {
		var self = this;
		ipc.on('set-connections', function(event, data) {
			self.items = data;
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
});

var app = new Vue({
	el: '#app',
	methods: {
		saveAndConnect: function() {
		}
	}
});