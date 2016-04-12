var clc			= require('cli-color'),
	inquirer 	= require('inquirer'),
	Promise		= require('promise'),
	util   		= require('util'),
	extend 		= util._extend,
	utils 		= require('./utils');

var localConfig = utils.getLocalConfiguration();
var globalConfig = utils.getGlobalConfiguration();
var config = extend(globalConfig, localConfig);

module.exports = function(program){
	program
		.option('-p, --project <project_id>', 'The project ID to use for POEditor translation management')
		.option('-a, --apitoken <api_token>', 'The API-Token to use for POEdtior translation management')
		.option('-t, --target <target_dir>', 'The target directory the translations should be saved to')
		.option('-e, --exporttype <export_type>', 'The filetype the pulled files should be saved as. Currently "json" and "properties" are supported. Default is "properties".')
		.option('-s, --single <target_filename>', 'Set this option to export into one single file given and not into multiple')
		.option('-l, --languages <languages>', 'The languages that should be pulled', function(val){
			return val.split(',');
		});

	program.parse(process.argv);

	var cfg = {};
	cfg.targetDir = program.target || config.targetDir || './';
	cfg.apiToken = program.apitoken || config.apiToken;
	cfg.projectId = program.project || config.projectId;
	cfg.projectLanguages = program.languages || config.projectLanguages;
	cfg.defaultLanguage = config.defaultLanguage || 'en-us';
	cfg.exportType = program.exporttype || config.exportType || 'properties';
	cfg.exportSingleFileTarget = program.single || config.exportSingleFileTarget;

	return new Promise(function(resolve, reject) {
		if (!cfg.apiToken || !cfg.projectId) {
			console.log(clc.red("\n>>  No API token or project id found for POEditor. Please provide the necessary information in the following steps. <<\n"));

			inquirer.prompt([
				{
					type: "input",
					name: "token",
					message: "API token"
				}
			], function (answers) {
				cfg.apiToken = answers.token;
				utils.setLocalConfiguration("apiToken", cfg.apiToken);

				utils.chooseProject(cfg.apiToken).then(function(res){
					var projectId = res[0],
						languages = res[1];

					cfg.projectLanguages = languages;
					cfg.projectId = projectId;

					utils.setLocalConfiguration("projectId", projectId);
					utils.setLocalConfiguration("projectLanguages", languages);

					utils.chooseTargetDir().then(function(targetDir){
						cfg.targetDir = targetDir;
						utils.setLocalConfiguration("targetDir", targetDir);

						resolve(cfg);
					}, reject);
				}, reject);
			});
		} else {
			resolve(cfg);
		}
	});
};