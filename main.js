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
			let ssh_config = {};
			let mysql_config = {};
			for(let i in data) {
				if(i.indexOf('ssh_') === 0) {
					ssh_config[i.replace('ssh_', '')] = data[i];
				}
				else {
					mysql_config[i] = data[i];
				}
			}
			this.connection_id = await this.app_server.connect(mysql_config, ssh_config, [3307, 3306]);
			event.sender.send('init-connection', this.connection_id);
		});

		ipc.on('show-tables', () => {
			//this.app_server.push(this.connection_id, 'useDatabase', ['test_database']);
			//this.app_server.push(this.connection_id, 'showTables');
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