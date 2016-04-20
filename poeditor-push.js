var program  		= require('commander'),
	CLI		 		= require('clui'),
	configure		= require('./configure'),
	api				= require('./api'),
	clc				= require('cli-color'),
	POEditorStaging = require('./staging');

program.version("1.0.0")
	.description("Add new translation term with a key and the default translation");

configure(program).then(function(config){
	var poeditorStaging = new POEditorStaging();
	var stagingData = poeditorStaging.getStagingData();
	var data = [];
	var langData = [];

	Object.keys(stagingData).forEach(function(tag){
		Object.keys(stagingData[tag]).forEach(function(lang){
			Object.keys(stagingData[tag][lang]).forEach(function(key){
				var value = stagingData[tag][lang][key];

				data.push({
					term: key,
					tags: tag,
					context: tag,
					reference: "",
					plural: "",
					comment: ""
				});

				langData.push({
					term: {
						term: key,
						context: tag
					},

					definition: {
						forms: [
							value
						],
						fuzzy: 0
					}
				});
			});
		});
	});

	var spinner = new CLI.Spinner('Please wait, pushing ' + data.length + ' terms to POEditor.');
	spinner.start();

	api.apiRequest(config.apiToken, 'add_terms', {
		data: JSON.stringify(data),
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
