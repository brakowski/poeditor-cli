#!/usr/bin/env node

var fs			= require('fs'),
	program  	= require('commander'),
	CLI		 	= require('clui'),
	Table 		= require('cli-table'),
	clc			= require('cli-color'),
	inquirer 	= require('inquirer'),
	https    	= require('https'),
	ConfigStore = require('configstore'),
	util   		= require('util'),
	querystring = require('querystring'),
	pkg 		= require('./package.json'),
	extend 		= util._extend;

program.version(pkg.version)
	.command('pull', 'Download translations from POEditor')
	.command('push', 'Upload newly added/staged translations to POEditor')
	.command('config', 'Perform some configurations')
	.command('add <term> <defaultTranslation>', 'Add new translation term with the default translation')
	.command('reset', 'Clears POEditor staging area')
	.command('projects', 'Displays the available projects for the given API-Token')
	.command('status', 'Displays the current staging are, e.g. Terms that still have to be pushed to the POEditor server')
	.command('statistics', 'Displays the current projects completition statistics');

program.parse(process.argv);