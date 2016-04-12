var fs  = require('fs'),
	clc = require('cli-color');

module.exports = function(config, files, callback){
	if(config.exportSingleFileTarget){
		console.log(clc.red("[ERROR] Can't export all translations into a single properties file. Please choose a different export method."));
		if(callback) callback(false);
	} else {
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

		if(callback) callback();
	}
};