var fs			= require('fs'),
	ConfigStore = require('configstore'),
	util   		= require('util'),
	inquirer 	= require('inquirer'),
	api 		= require('./api'),
	extend 		= util._extend,
	aWrite 		= require('atomic-write');

var config = {
	targetDir: null,
	apiToken: null,
	projectId: null,
	projectLanguages: null,
	defaultLanguage: null
};

const GLOBAL_CONFIG = 'poeditor-config';
const LOCAL_CONFIG  = './.poeditor-config';

module.exports = {
	getGlobalConfiguration: function(){
		var globalConfig = new ConfigStore(GLOBAL_CONFIG);
		return extend(config, globalConfig.all);
	},

	getLocalConfiguration: function(){
		var localConfig = {};

		try {
			fs.accessSync(LOCAL_CONFIG, fs.F_OK | fs.R_OK | fs.W_OK);
			var data = fs.readFileSync(LOCAL_CONFIG, "utf8");
			localConfig = JSON.parse(data);
		} catch(e) {}

		return extend(config, localConfig);
	},

	setGlobalConfiguration: function(key, val){
		var cfg = new ConfigStore(GLOBAL_CONFIG);

		if(val === undefined){
			cfg.del(key);
		} else {
			cfg.set(key, val);
		}
	},

	setLocalConfiguration: function(key, val){
		var cfg = this.getLocalConfiguration();

		if(val === undefined){
			delete cfg[key];
		} else {
			cfg[key] = val;
		}

		var out = fs.createWriteStream(LOCAL_CONFIG);
		out.write(JSON.stringify(cfg));
		out.end();

		/*aWrite.writeFile(LOCAL_CONFIG, JSON.stringify(cfg), function(err, result){
			if(err){
				return console.log(err);
			}
		});*/
	},

	chooseTargetDir: function(){
		return new Promise(function(resolve, reject){
			inquirer.prompt([
				{
					type: "input",
					name: "target",
					message: "Target directory for translation files"
				}
			], function(answers){
				resolve(answers.target);
			});
		})
	},

	chooseProject: function(apiToken){
		return new Promise(function(resolve, reject){
			api.getProjects(apiToken).then(function(res){
				var list = res[1];

				var choices = list.map(function(item){
					return item.name
				});

				inquirer.prompt([{
					type: 'list',
					name: 'project',
					message: 'Which project should be used?',
					choices: choices
				}], function(answers){
					var index = choices.indexOf(answers.project);
					var id = list[index].id;

					/*project = list[index];
					conf.set('api_project', list[index]);*/

					api.getProjectLanguages(apiToken, id).then(function(res){
						var l = res[1];

						var languages = l.map(function(item){
							return item.code;
						});

						resolve([id, languages]);
					}, reject);
				});
			}, reject);
		});
	}
};