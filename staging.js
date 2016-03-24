var fs 	   = require('fs'),
	util   = require('util'),
	extend = util._extend;

function POEditorStaging(defaultLanguage){
	this.stagingFile = "./.poeditor-staging";
	this.stagingData = {};
	this.defaultLanguage = defaultLanguage || 'en-us';

	this.readStagingCache();
}

extend(POEditorStaging.prototype, {
	readStagingCache: function(){
		try {
			fs.accessSync(this.stagingFile, fs.F_OK | fs.R_OK | fs.W_OK);

			var rawStagingData = fs.readFileSync(this.stagingFile, "utf8");
			this.stagingData = JSON.parse(rawStagingData);
		} catch(e) {}
	},

	writeStagingCache: function(){
		var out = fs.createWriteStream(this.stagingFile);
		out.write(JSON.stringify(this.stagingData));
		out.end();
	},

	clearStaging: function(){
		this.stagingData = {};
		this.writeStagingCache();
	},

	addTerm: function(tag, key, translation){
		if(!this.stagingData.hasOwnProperty(tag)){
			this.stagingData[tag] = {};
		}

		if(!this.stagingData[tag].hasOwnProperty(this.defaultLanguage)){
			this.stagingData[tag][this.defaultLanguage] = {};
		}

		this.stagingData[tag][this.defaultLanguage][key] = translation;

		this.writeStagingCache();
	},

	getStagingData: function(){
		return this.stagingData;
	}
});

module.exports = POEditorStaging;