#!/usr/bin/env node

process.argv = process.argv.map(function(item){
	return item.replace(/i18n(\.js)?$/g, 'poeditor$1');
});

console.log(process.argv);

require('./poeditor');