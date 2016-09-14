const electron = require('electron');
const storage  = require('electron-json-storage');

const ConfigProvider = require('./config-provider.js');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let mainWindow;

var Application = function() {
	var main_window_template = `file://${__dirname}/index.html`;

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

	this.sqlClientInit = function() {
		let settings_filename = 'sessions.json';
		let cp = new ConfigProvider('jsql', settings_filename);
		ipc.on('get-connections', (event) => {
			cp.get().then(function() {
				event.sender.send('set-connections', cp.sessions);
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