var fs = require('fs');

module.exports = function(config, files, callback){
	if(config.exportSingleFileTarget){
		var out = fs.createWriteStream(config.targetDir + config.exportSingleFileTarget);
		out.write(JSON.stringify(files, null, 4));
		out.end();

		if(callback) callback();
	} else {
		Object.keys(files).forEach(function (f) {
			Object.keys(files[f]).forEach(function (l) {
				// construct the file name
				var fileName = config.targetDir + f;
				if (l !== '') {
					fileName += '_' + l;
				}
				fileName += '.json';

				var out = fs.createWriteStream(fileName);
				out.write(JSON.stringify(files[f][l], null, 4));
				out.end();
			});
		});

		if(callback) callback();
	}
};