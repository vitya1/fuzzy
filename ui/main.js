import Vue from 'vue';
import Router from 'vue-router';
import ConnectionWindow from './components/connection-window.vue';
import Main from './components/main.vue';

Vue.use(Router);

let app = Vue.extend({
	el: function () {
		return '#app'
	}
});

const router = new Router();

router.map({
	'/main': {component: Main},
	'/connection': {component: ConnectionWindow}
});

router.start(app, '#app');

router.redirect({'*': 'bar'});