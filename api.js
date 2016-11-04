var util   		= require('util'),
	CLI		 	= require('clui'),
	Promise		= require('promise'),
	https    	= require('https'),
	querystring = require('querystring'),
	extend 		= util._extend;

var API_TIMEOUT = 2000; // 2 seconds

function apiRequest(apiToken, action, params) {
	return new Promise(function (resolve, reject) {
		var parameters = {
			api_token: apiToken,
			action: action
		};

		extend(parameters, params || {});

		var postData = querystring.stringify(parameters);

		var req = https.request({
			hostname: 'poeditor.com',
			path: '/api/',
			port: 443,
			method: 'POST',
			timeout: API_TIMEOUT,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		}, function(res){
			var data = "";
			res.on('data', function(d){
				data += d;
			});

			res.on('end', function(){
				var parsed = JSON.parse(data);
				var success = (parsed.response.status === "success");

				if(success){
					resolve([parsed.response, parsed.item || parsed.list || parsed.details || null]);
				} else {
					reject({
						code: parsed.response.code,
						message: parsed.response.message
					});
				}
			});

		});

		req.on('error', function (e) {
			reject(e);
		});

		req.write(postData);
		req.end();

	});
}

module.exports = {
	apiRequest: apiRequest,
	getProjects: function(apiToken){
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Please wait, retrieving projects...');
			spinner.start();

			apiRequest(apiToken, 'list_projects')
				.then(function(res){
					spinner.stop();
					resolve(res);
				}, function(data){
					spinner.stop();
					reject(data);
				});
		});
	},
	getProjectLanguages: function(apiToken, projectId){
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Please wait...');
			spinner.start();

			apiRequest(apiToken, 'list_languages', {
				id: projectId
			}).then(function(res){
				spinner.stop();
				resolve(res);
			}, function(data){
				spinner.stop();
				reject(data);
			})
		});
	}
};