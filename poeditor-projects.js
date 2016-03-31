var fs			= require('fs'),
	clc			= require('cli-color'),
	program  	= require('commander'),
	CLI		 	= require('clui'),
	configure	= require('./configure'),
	utils 		= require('./utils'),
	api			= require('./api'),
	Table		= require('cli-table'),
	POEditorStaging = require('./staging');

program.version("1.0.1")
	.description("Displays the available projects for the given API-Token");

configure(program).then(function(config) {
	api.getProjects(config.apiToken).then(function(response, list){
		var table = new Table({
			head: ['ID', 'Name', 'Public', 'Open', 'Created'],
			colWidths: [15, 50, 10, 10, 40]
		});

		for(var i=0; i<list.length; i++){
			var item = list[i];

			table.push([item.id, item.name, item.public, item.open, item.created]);
		}

		console.log("\n The following projects where retrieved from POEditor:");
		console.log(table.toString());
	}, function(){
		console.log(clc.red("[ERROR] No projects could be retrieved."));
	});
});