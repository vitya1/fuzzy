const fs = require('fs');
const path = require('path');
const path_extra = require('path-extra');
const node_uuid = require('node-uuid');

module.exports = function(app_name, settings_filename) {
	if(!app_name) {
		throw new Error('Application name is required');
	}
	if(!settings_filename) {
		throw new Error('Config file name is required');
	}

	const settings_file = settings_filename;
	this.app_name = app_name;

	this.settings_full_path = path.resolve(path_extra.datadir(this.app_name), settings_file);

	this.settings = {};

	this.init = function() {
		const settings = '{}';
		let config_dir = path_extra.datadir(this.app_name);
		if (!fs.existsSync(config_dir)) {
			fs.mkdirSync(config_dir);
		}
		if(!fs.existsSync(this.settings_full_path)) {
			//@todo error handling
			fs.writeFile(this.settings_full_path, settings, function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
	};
	this.init();

	this.get = function() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.settings_full_path, 'utf-8', (err, data) => {
				if(err) {
					reject(err);
					console.log(err);
				}
				this.settings = JSON.parse(data);
				resolve();
			});
		});
	};

	this.updateSetting = function(settings) {
		//@todo file structure dynamic creation
		let config_dir = path_extra.datadir(this.app_name);
		if (!fs.existsSync(config_dir)) {
			fs.mkdirSync(config_dir);
		}
		if(!fs.existsSync(this.settings_full_path)) {
			//@todo error handling
			fs.writeFile(this.settings_full_path, settings, function(err) {
				if(err) {
					console.log(err);
				}
			});
		}
		else {
			fs.truncate(this.settings_full_path, 0, () => {
				fs.writeFile(this.settings_full_path, JSON.stringify(settings), function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
		}
	};

	/**
	 * Replace exist setting with data
	 * @param data
	 */
	this.saveSetting = function(data) {
		if(!data.id) {
			data.id = node_uuid.v1();
			this.settings.push(data);
			this.updateSetting(this.settings);
		}
		else {
			this.settings.forEach((item, index) => {
				if(item.hasOwnProperty('id') && item.id == data.id) {
					this.settings[index] = data;
					this.updateSetting(this.settings);
				}
			});
		}
	};
};

