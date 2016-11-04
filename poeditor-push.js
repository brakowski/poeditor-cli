var program  		= require('commander'),
	CLI		 		= require('clui'),
	configure		= require('./configure'),
	api				= require('./api'),
	clc				= require('cli-color'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Upload newly added/staged translations to POEditor");

configure(program).then(function(config){
	var poeditorStaging = new POEditorStaging();
	var stagingData = poeditorStaging.getStagingData();
	
	var termData = [];
	var langData = [];

	Object.keys(stagingData).forEach(term => {
		if (stagingData.hasOwnProperty(term)) {
			var entry = stagingData[term];
			termData.push({
				term: entry.term,
				tags: entry.tags,
				context: entry.context,
				reference: '',
				plural: '',
				comment: ''
			});
			langData.push({
				term: {
					term: entry.term,
					context: entry.context
				},
				definition: {
					forms: [entry.defaultTranslation],
					fuzzy: 0
				}
			});
		}
	});

	var spinner = new CLI.Spinner('Please wait, pushing ' + termData.length + ' terms to POEditor.');
	spinner.start();

	api.apiRequest(config.apiToken, 'add_terms', {
		data: JSON.stringify(termData),
		id: config.projectId
	}).then(function(res) {
		api.apiRequest(config.apiToken, 'update_language', {
			language: config.defaultLanguage,
			data: JSON.stringify(langData),
			id: config.projectId
		}).then(function(res) {
			var response = res[0], details = res[1];

			spinner.stop();

			console.log("[ " + clc.green("OK") + " ] " + details.parsed + " terms were parsed, " + details.added + " terms were added and " + details.updated + " term updated.");
			poeditorStaging.clearStaging();
		}, function(){
			console.log("[ " + clc.red("FAIL") + " ] Could not push terms to POEditor.");
		});
	}, function(){
		spinner.stop();
		console.log("[ " + clc.red("FAIL") + " ] Could not push terms to POEditor.");
	});
});
