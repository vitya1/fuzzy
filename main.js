const electron = require('electron');
const storage  = require('electron-json-storage');
const mysql    = require('mysql');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

let mainWindow;

var Application = function() {
	var main_window_template = `file://${__dirname}/index.html`;

	this.createMainMenu = function() {
		const template = [
			{
				label: 'Edit',
				submenu: [
					{
						label: 'Undo',
						accelerator: 'CmdOrCtrl+Z',
						role: 'undo'
					}
				]
			}];

		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
	};

	this.createMainWindow = function() {
		mainWindow = new BrowserWindow({width: 800, height: 600});
		mainWindow.loadURL(main_window_template);
		//mainWindow.webContents.openDevTools()

		mainWindow.on('closed', function () {
			mainWindow = null;
		});
	};

	this.initHandlers = function() {
		var ipc = electron.ipcMain;
		var self = this;

		ipc.on('close-main-window', function () {
			app.quit();
		});
		ipc.on('open-session', function(e, data) {
			self.config.saveProfile(data);

			var mysql_config = {
				host: data.session_host_ip,
				user: data.session_user,
				password: data.session_password,
				port: data.session_port
			};
			if(data.session_network_type == 0) {
				var connection = mysql.createConnection(mysql_config);
				connection.connect(function(err) {
					if (err) {
						console.error('error connecting: ' + err.stack);
						return;
					}

					console.log('connected as id ' + connection.threadId);
				});
			}
			else {
				console.log('q1111');
				var config = {
					host: data.session_ssh_host,
					username: data.session_ssh_user,
					password: data.session_ssh_password,
					dstPort: data.session_ssh_port,
					localPort: data.session_ssh_port_local
				};
				//connect via ssh tunnel

				config = {
					host: '192.168.33.12',
					username: 'vagrant',
					password: 'vagrant',
					//dstPort: data.session_ssh_port,
					//localPort: data.session_ssh_port_local,
					port: 22
				};

			}


			//console.log(data);
		});
	};

	this.tunnelMysqlConnection = function() {
		var me = this;
		me.tunnel = new tunnel(this.tunnelConfig);
		me.tunnel.connect(function (error) {
			console.log('Tunnel connected', error);
			//
			// Connect to the db
			//
			me.connection = me.connect(callback);

		});
	};

	this.init = function() {
		var self = this;

		self.initHandlers();
		app.on('ready', function() {
			self.createMainWindow();
			self.createMainMenu();
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