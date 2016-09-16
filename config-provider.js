const fs = require('fs');
const path = require('path');
const path_extra = require('path-extra');

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
		const default_settings = '{}';
		let config_dir = path_extra.datadir(this.app_name);
		if (!fs.existsSync(config_dir)) {
			fs.mkdirSync(config_dir);
		}
		if(!fs.existsSync(this.settings_full_path)) {
			//@todo error handling
			fs.writeFile(this.settings_full_path, default_settings, function(err) {
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

	/**
	 * Replace exist setting with data
	 * @param data
	 */
	this.saveSetting = function(data) {
		//for(let prop in this.settings) {
		//
		//}
		//console.log(data);
	};
};

