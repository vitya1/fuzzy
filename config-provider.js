const fs = require('fs');
const path = require('path');
const path_extra = require('path-extra');

const ConfigProvider = function(app_name) {
	if(!app_name) {
		throw new Error('Application name is required');
	}

	const sessions_file = 'sessions.json';
	const settings_file = 'settings.json';
	this.app_name = app_name;

	this.sessions_full_path = path.resolve(path_extra.datadir(this.app_name), sessions_file);
	this.settings_full_path = path.resolve(path_extra.datadir(this.app_name), settings_file);

	this.sessions = {};
	this.settings = {};

	this.init = function() {
		const default_settings = '{}';
		let config_dir = path_extra.datadir(this.app_name);
		if (!fs.existsSync(config_dir)) {
			fs.mkdirSync(config_dir);
		}
		if(!fs.existsSync(this.sessions_full_path)) {
			//@todo error handling
			fs.writeFile(this.sessions_full_path, default_settings, function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
		if(!fs.existsSync(this.settings_full_path)) {
			fs.writeFile(this.settings_full_path, default_settings, function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
	};
	this.init();

	this.get = function() {
		fs.readFile(this.sessions_full_path, 'utf-8', (err, data) => {
			if(err) {
				console.log(err);
			}
			this.sessions = JSON.parse(data);
		});
		fs.readFile(this.settings_full_path, 'utf-8', (err, data) => {
			if(err) {
				console.log(err);
			}
			this.settings_full_path = JSON.parse(data);
		});
	};
};

(new ConfigProvider('myapp')).get();
