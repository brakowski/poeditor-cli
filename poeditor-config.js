var program  	= require('commander'),
	utils		= require('./utils'),
	clc			= require('cli-color');

program.version("1.0.0")
	.description("Perform some configurations")
		.option("-g, --global", "Get or set global configuration");

program.command('set [key] [value]')
		.description('Set a configuration')
		.action(setConfiguration);

program.command('unset [key]')
		.description('Unset a configuration')
		.action(unsetConfiguration);

program.command('get [key]')
		.description('Get a configuration')
		.action(getConfiguration);

program.parse(process.argv);

function setConfiguration(key, value){
	if(program.global){
		utils.setGlobalConfiguration(key, value);
	} else {
		utils.setLocalConfiguration(key, value);
	}

	console.log(clc.green("[OK] Successfully set " + (program.global ? 'global' : 'local') + " configuration."));
}

function unsetConfiguration(key){
	setConfiguration(key, undefined);
}

function getConfiguration(key){
	var config = program.global ? utils.getGlobalConfiguration() : utils.getLocalConfiguration();

	if(!config[key]){
		console.log(clc.red("[ERROR] Configuration not found."));
		process.exit(0);
	}

	console.log("\n " + key + " => " + config[key]);
}
