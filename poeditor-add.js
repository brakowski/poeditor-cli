var clc				= require('cli-color'),
	program  		= require('commander'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Upload newly added/staged translations to POEditor");

configure(program).then(function(config) {
	var destination = program.args[0],
		key			= program.args[1],
		translation = program.args[2];

	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	poeditorStaging.addTerm(destination, key, translation);

	console.log("[ " + clc.green("OK") + " ] Added '" + key + "' to staging area");
});