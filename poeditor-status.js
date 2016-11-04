var program  		= require('commander'),
	Table 			= require('cli-table'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Displays the current staging are, e.g. Terms that still have to be pushed to the POEditor server");

configure(program).then(function(config) {
	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	var stagingData = poeditorStaging.getStagingData();

	var table = new Table({
		head: ['context', 'term', 'defaultTranslation', 'tags'],
		colWidths: [20, 20, 40, 20]
	});

	Object.keys(stagingData).forEach(term => {
		if (stagingData.hasOwnProperty(term)) {
			var entry = stagingData[term];
			table.push([
				entry.context,
				entry.term,
				entry.defaultTranslation,
				entry.tags.join(', ')
			]);
		}
	});

	console.log("\n The following data is currently in the staging area:");
	console.log(table.toString());
});