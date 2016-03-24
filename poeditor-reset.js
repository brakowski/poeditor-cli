var clc				= require('cli-color'),
	program  		= require('commander'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Clears POEditor staging area");

configure(program).then(function(config) {
	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	poeditorStaging.clearStaging();

	console.log("[ " + clc.green("OK") + " ] Staging area was cleared.");
});