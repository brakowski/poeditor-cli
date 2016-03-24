var program  		= require('commander'),
	Table 			= require('cli-table'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Displays the current staging are, e.g. Terms that still have to be pushed to the POEditor server");

configure(program).then(function(config) {
	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	var data = poeditorStaging.getStagingData();

	var table = new Table({
		head: ['key', 'destination', 'translation'],
		colWidths: [30, 20, 50]
	});

	Object.keys(data).forEach(function(tag){
		Object.keys(data[tag]).forEach(function(lang){
			Object.keys(data[tag][lang]).forEach(function(key){
				table.push([key, tag, data[tag][lang][key]]);
			});
		});
	});

	console.log("\n The following data is currently in the staging area:");
	console.log(table.toString());
});