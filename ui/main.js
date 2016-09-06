var Vue = require('vue');

var Events = new Vue({});

var connectionForm = Vue.component('connection-form', {
	template: '#connection-form-template',
	ready: function () {
		var self = this;
		Events.$on('fillProperty', function(data) {
			self.fillProperty(data);
		});
	},
	props: {
		title: {
			type: 'String',
			default: 'initial title'
		},
		types: {
			default: function() {
				return [
					{value: 10, text: 'mysql'},
					{value: 20, text: 'sqlite'}
				]
			}
		},
		host: 'String',
		port: {
			type: 'Number',
			default: 3306
		},

	},
	methods: {
		fillProperty: function(msg) {
			this.title = msg;
		}
	}
});

var connections = new Vue({
	el: '#connections-list',
	data: {
		items: [
			{title: 'test1'},
			{title: 'test2'},
			{title: 'test3'}
		],
		active_item: 0
	},
	methods: {
		createNewCon: function () {
			this.items.push({title: (new Date()).getSeconds()});
		},
		removeCon: function () {
			this.items.splice(this.active_item, 1);
		},
		chooseCon: function (index, event) {
			event.preventDefault();
			this.active_item = index;
			Events.$emit('fillProperty', this.items[index].title);
		},
	},
});

var app = new Vue({
	el: '#app'
});