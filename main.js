require("babel-core/register");
require("babel-polyfill");//todo remove

const electron = require('electron');
const storage  = require('electron-json-storage');

import ConfigProvider from './build/config-provider.js';
import AppServer from './build/app-server';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let mainWindow;

var Application = function() {
	var main_window_template = `file://${__dirname}/index.html`;

	//@todo don't contain connection ids here
	this.connection_id = null;
	this.app_server = null;

	this.createMainWindow = function() {
		mainWindow = new BrowserWindow({width: 800, height: 600});
		mainWindow.loadURL(main_window_template);
		mainWindow.webContents.openDevTools();

		mainWindow.on('closed', function () {
			mainWindow = null;
		});
	};

	this.initHandlers = function() {
		ipc.on('close-main-window', function () {
			app.quit();
		});
	};

	this.sqlClientInit = async function() {
		let settings_filename = 'sessions.json';
		let cp = new ConfigProvider('jsql', settings_filename);
		ipc.on('get-connections', (event) => {
			cp.get().then(function() {
				event.sender.send('set-connections', cp.settings);
			});
		});
		ipc.on('delete-connection', (event, id) => {
			if(id != null) {
				cp.deleteRowById(id);
			}
		});
		ipc.on('connect', async (event, data) => {
			cp.saveSetting(data);
			this.app_server = new AppServer();
			var ssh_config = {};
			var mysql_config = {};
			//@todo refactor this. Looks pretty awful
			let redundant_params = ['id', 'title', 'ssh_port_local', 'ssh_port'];
			for(let i in data) {
				if(redundant_params.indexOf(i) != -1) {
					continue;
				}
				if(i.indexOf('ssh_') === 0) {
					ssh_config[i.replace('ssh_', '')] = data[i];
				}
				else {
					mysql_config[i] = data[i];
				}
			}
			//@todo pooooooorts!!
			//@todo error handling (for ex. empty ssh_username = FATAL)
			this.connection_id = await this.app_server.connect(mysql_config, ssh_config, [3307, 3306]);
			event.sender.send('init-connection', this.connection_id);
		});

		ipc.on('show-tables', async (event, connection, params) => {
			this.app_server.push(this.connection_id, 'useDatabase', params);
			this.app_server.push(this.connection_id, 'showTables', (res) => {
				event.sender.send('set-tables', res, params);
			});
		});

		ipc.on('choose-table', async (event, connection, params) => {
			this.app_server.push(this.connection_id, 'describeTable', params, (tableParams) => {
				let columns = tableParams.map(function(a) {
					return a.Field;
				}).join (', ');
				this.app_server.push(this.connection_id, 'selectTable', [params, columns], (tableData) => {
					event.sender.send('set-table', {structure: tableParams, data: tableData}, params);
				});
			});
		});

		ipc.on('show-databases', async (event, connection) => {
			this.app_server.push(connection, 'showDatabases', (res) => {
				event.sender.send('set-databases', res);
			});
		});
		ipc.on('custom-query', async (event, connection, params) => {
			this.app_server.push(connection, 'execRawQuery', params, (res) => {
				event.sender.send('custom-query-res', res);
			});
		});
	};

	this.init = function() {
		var self = this;

		self.sqlClientInit();
		self.initHandlers();
		app.on('ready', function() {
			self.createMainWindow();
		});

		app.on('window-all-closed', function () {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});

		app.on('activate', function () {
			if (mainWindow === null) {
				self.createMainWindow();
			}
		});
	};
};

(new Application()).init();