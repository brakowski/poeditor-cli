var fs			= require('fs'),
	program  	= require('commander'),
	CLI		 	= require('clui'),
	clc			= require('cli-color'),
	configure	= require('./configure'),
	api			= require('./api');

program.version("1.0.0")
	   .description("Download translations from POEditor into the target directory");

configure(program).then(function(config){
	var files = {
		client: {},
		server: {},
		base: 	{}
	};

	var localesMap = {
		'en-us': ['', 'en'],
		de: ['de'],
		no: ['nb']
	},
	defaultLanguage = 'en-us';

	console.log("\nPulling newest translations...\n");
	var spinner = new CLI.Spinner('Please wait, retrieving translations for ' + config.projectLanguages[0] + '.');

	var tasks = config.projectLanguages.map(function(code){
		return function(){
			var languages = localesMap[code];

			spinner.message('Please wait, retrieving translations for ' + code + '.');
			spinner.start();

			api.apiRequest(config.apiToken, 'view_terms', {
				id: config.projectId,
				language: code
			}).then(function(res){
				var response = res[0],
						list = res[1];

				languages.forEach(function (lang) {
					list.forEach(function(item){
						var tags = item.tags;

						if(!Array.isArray(tags)){
							tags = [];
						}

						if(item.context){
							tags.push(item.context);
						}

						tags.forEach(function(file){
							if(!files.hasOwnProperty(file)) return true;
							if(!files[file].hasOwnProperty(lang)){
								files[file][lang] = {};
							}

							var value = item.definition.form;
							if(value){
								value = value.replace(/(?:\r\n|\r|\n)/g, '\\n');
							} else {
								value = '';
							}

							files[file][lang][item.term] = value;
						});
					});
				});

				spinner.stop();
				console.log("( " + clc.green("OK") + " ) Retrieved translations for " + code + ".");
				nextTask();
			});
		}
	});

	tasks.push(function writeTranslationsToFiles(){
		spinner.message('Please wait, writing translations to files...');
		spinner.start();

		if(!config.targetDir){
			config.targetDir = './';
			console.log(clc.yellow("\n[WARNING] Target directory for translation files is not set. Using current directory as target."));
		} else {
			if(config.targetDir.charAt(config.targetDir.length - 1) !== '/'){
				config.targetDir += '/';
			}
		}

		try {
			Object.keys(files).forEach(function (f) {
				Object.keys(files[f]).forEach(function (l) {
					// construct the file name
					var fileName = config.targetDir + f;
					if (l !== '') {
						fileName += '_' + l;
					}
					fileName += '.properties';

					var out = fs.createWriteStream(fileName);
					Object.keys(files[f][l]).forEach(function (k) {
						out.write(k + '=' + files[f][l][k] + '\r\n');
					});
					out.end();
				});
			});

			spinner.stop();
		} catch (ex) {
			console.log(ex);
			spinner.stop();
		}
	});

	var currentTaskIndex = -1;
	var nextTask = function(){
		currentTaskIndex++;
		if(currentTaskIndex >= 0 && currentTaskIndex < tasks.length){
			tasks[currentTaskIndex]();
		}
	};

	nextTask();
});
