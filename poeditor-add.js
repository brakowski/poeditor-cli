var clc				= require('cli-color'),
	program  		= require('commander'),
	configure		= require('./configure'),
	POEditorStaging = require('./staging');

function collect(val, list) {
	list.push(val);
	return list;
}

var args = {};

program.version("1.0.0")
	.description("Add new translation term with the default translation, tags and an optional context")
	.arguments('<term> <defaultTranslation>')
	.option('-c, --context [text]', 'An optional context for this term')
	.option('--tag [text]', 'One or more tags for this term, one option per tag', collect, [])
	.option('-u, --update', 'Update an already staged term')
	.action(function (term, defaultTranslation) {
		args.term = term;
		args.defaultTranslation = defaultTranslation;
	});

configure(program).then(function(config) {

	var term				= args.term,
	    defaultTranslation 	= args.defaultTranslation;

	if (!term) {
		return console.log(clc.red('[ERROR] term is required'));
	}

	if (!defaultTranslation) {
		return console.log(clc.red('[ERROR] translation is required'));
	}

	var poeditorStaging = new POEditorStaging(config.defaultLanguage);
	try {
		poeditorStaging.addTerm(term, defaultTranslation, program.context || '', program.tag || [], !!program.update);
		console.log("[ " + clc.green("OK") + " ] Added '" + term + "' to staging area");
	} catch (e) {
		if (e.code === 2) {
			console.log(clc.yellow('[WARN]: term is already defined in staging area, use -u to update'))
		} else {
			console.log(clc.red('[ERROR]: could not stage "' + term + '": ' + e.message));
		}
	}
	
});
