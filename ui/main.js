import Vue from 'vue';
import Router from 'vue-router';
import ConnectionWindow from './components/connection-window.vue';
import MainWindow from './components/main-window.vue';

Vue.use(Router);

let app = Vue.extend({
	el: function () {
		return '#app'
	}
});

const router = new Router();

router.map({
	'/main/:id': {component: MainWindow},
	'/connection': {component: ConnectionWindow}
});

router.start(app, '#app');

router.redirect({'*': 'connection'});