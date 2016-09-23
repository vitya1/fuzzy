//var Vue = require('vue');
import Vue from 'vue';
import ConnectionWindow from './components/connection-window.vue';
import Router from 'vue-router';

/*

let app = new Vue({
	el: '#app',
	components: {
		'connection-form': connectionForm
	}
});
*/

Vue.config.debug = true;
Vue.use(Router);

var router = new Router();
router.map({
	'/connection': {
		component: {}
	}
});
router.start(ConnectionWindow, '#app');