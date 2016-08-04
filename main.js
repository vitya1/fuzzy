import electron  from 'electron';
const storage  = require('electron-json-storage');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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
		var ipc = electron.ipcMain;

		ipc.on('close-main-window', function () {
			app.quit();
		});
		ipc.on('open-session', function(e, data) {
			//console.log(data);
		});
	};

	this.init = function() {
		var self = this;

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