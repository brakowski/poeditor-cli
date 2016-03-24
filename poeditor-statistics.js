var fs			= require('fs'),
	clc			= require('cli-color'),
	program  	= require('commander'),
	Table 		= require('cli-table'),
	CLI		 	= require('clui'),
	configure	= require('./configure'),
	utils 		= require('./utils'),
	api			= require('./api');

program.version("1.0.0")
	.description("Displays the current projects completition statistics");

configure(program).then(function(config) {
	api.getProjectLanguages(config.apiToken, config.projectId)
		.then(function(res){
			var list = res[1];

			var table = new Table({
				head: ['Language', 'Code', 'Percentage', 'Updated'],
				colWidths: [30, 20, 20, 30]
			});

			for(var i=0; i<list.length; i++){
				var item = list[i];

				table.push([item.name, item.code, item.percentage, item.updated]);
			}

			console.log(table.toString());
		}, function(){
			console.log("[ " + clc.red("FAIL") + " ] Could not retrieve any data from POEditor");
		})
});