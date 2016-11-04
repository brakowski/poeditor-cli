var fs = require('fs'),
	program = require('commander'),
	CLI = require('clui'),
	clc = require('cli-color'),
	mkdirp = require('mkdirp'),
	configure = require('./configure'),
	api = require('./api'),
	exporters = require('./exporters');

program.version("1.0.1")
	   .description("Download translations from POEditor into the target directory");

configure(program).then(function (config) {
	
	// one per language
	var files = [];

	// map locale identifier
	var defaultLanguage = 'en-us';

	console.log("\nPulling newest translations...\n");
	var spinner = new CLI.Spinner('Please wait, retrieving translations for ' + config.projectLanguages[0] + '.');

	var tasks = config.projectLanguages.map(function (code) {
		return function () {

			spinner.message('Please wait, retrieving translations for ' + code + '.');
			spinner.start();

			api.apiRequest(config.apiToken, 'view_terms', {
				id: config.projectId,
				language: code
			}).then(function (res) {

				var response = res[0],
					list = res[1];

				files.push({
					lang: code,
					terms: list
				});

				spinner.stop();
				console.log("( " + clc.green("OK") + " ) Retrieved translations for " + code + ".");
				nextTask();
			}).catch(function (error) {
				spinner.stop();
				console.log(clc.red("[ERROR] Could not pull translations: " + error.message || "no details available"));
			});
		}
	});

	tasks.push(function writeTranslationsToFiles() {
		spinner.message('Please wait, writing translations to files...');
		spinner.start();

		if (!config.targetDir) {
			config.targetDir = './';
			console.log(clc.yellow("\n[WARNING] Target directory for translation files is not set. Using current directory as target."));
		} else {
			if (config.targetDir.charAt(config.targetDir.length - 1) !== '/') {
				config.targetDir += '/';
			}
		}

		// create targetDir (if not existing)
		mkdirp(config.targetDir);

		try {
			if (config.exportType.match(/[^\.]*\.js/ig)) {
				var customExporter = require(process.cwd() + '/' + config.exportType);
				customExporter(config, files, function () {
					spinner.stop();
				});
			} else if (exporters[config.exportType]) {
				exporters[config.exportType](config, files, function () {
					spinner.stop();
				});
			} else {
				spinner.stop();
				console.log(clc.red('[ERROR] The required exporter could not be located.'));
			}
		} catch (ex) {
			console.log(ex);
			spinner.stop();
		}
	});

	var currentTaskIndex = -1;
	var nextTask = function () {
		currentTaskIndex++;
		if (currentTaskIndex >= 0 && currentTaskIndex < tasks.length) {
			tasks[currentTaskIndex]();
		}
	};

	nextTask();
});
