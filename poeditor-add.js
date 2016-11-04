var clc				= require('cli-color'),
	program  		= require('commander'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Add new translation term with a key and the default translation");

configure(program).then(function(config) {
	var destination = program.args[0],
		key			= program.args[1],
		translation = program.args[2];

	if (!destination) {
		return console.log(clc.red('[ERROR] destination is required'));
	}

	if (!key) {
		return console.log(clc.red('[ERROR] key is required'));
	}

	if (!translation) {
		return console.log(clc.red('[ERROR] translation is required'));
	}

	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	poeditorStaging.addTerm(destination, key, translation);

	console.log("[ " + clc.green("OK") + " ] Added '" + key + "' to staging area");
});