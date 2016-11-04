var fs  = require('fs'),
	clc = require('cli-color');

module.exports = function(config, files, callback){
	if(config.exportSingleFileTarget){
		console.log(clc.red("[ERROR] Can't export all translations into a single properties file. Please choose a different export method."));
		if(callback) callback(false);
	} else {

		files.forEach(function (f) {
            var fileName = config.targetDir + f.lang + '.properties';

            var out = fs.createWriteStream(fileName);
			f.terms.forEach(function (t) {
				out.write(t.term + '=' + t.definition.form);
			});
			
            out.end();
        });

		if(callback) callback();
	}
};
