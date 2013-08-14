/**
 * Build monitor - pull from the CI server's API repeatedly, process
 * the job list, then pass back the current job status.
 */
// fid-umd {"name":"BuildMonitor","depends":[{"name":"RequestPromise","commonjs":"./request-promise"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("./request-promise")); return; } catch (a) {}
	try { exports[n] = f(require("./request-promise")); return; } catch (b) {}
	try { return define.amd && define(n, ["RequestPromise"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.RequestPromise); }, "", { requires: ["RequestPromise"] }); } catch (d) {}
	try { r[n] = f(r.RequestPromise); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("BuildMonitor", this, function (RequestPromise) {
	"use strict";
	// fid-umd end


	function BuildMonitor(config) {
		this.requestConfig = config.requestConfig;
		this.delay = config.delay;
		this.debug = config.debug;
		this.outputList = [];
	}


	BuildMonitor.prototype.addOutput = function (output) {
		this.outputList.push(output);
	};


	BuildMonitor.prototype.handleError = function (error) {
		if (error.code === 'ETIMEDOUT') {
			console.log('Ignoring timeout error');
		} else if (error.code === 'ECONNRESET') {
			console.log('Ignoring connection reset error');
		} else {
			console.log('Error encountered:', error);
			throw error;
		}
	};


	BuildMonitor.prototype.handleResponse = function (response) {
		var processedData;

		if (this.debug) {
			console.log('Response body', response.body);
		}

		processedData = this.processResponse(response.body);

		if (this.debug) {
			console.log('Processed data', processedData);
		}

		try {
			this.outputList.forEach(function (output) {
				output.receiveUpdate(processedData);
			});
		} catch (e) {
			console.log(e);
		}
	};


	BuildMonitor.prototype.makeRequest = function () {
		var myself, promise;

		myself = this;
		promise = new RequestPromise(this.requestConfig);
		promise.then(function (response) {
			myself.handleResponse(response);
		}, function (error) {
			myself.handleError(error);
		}).then(function () {
			if (myself.debug) {
				console.log('Queueing another call to makeRequest');
			}

			setTimeout(myself.makeRequest.bind(myself), myself.delay);
		}, function (error) {
			console.log('Unhandled error', error);
			throw error;
		});
	};


	BuildMonitor.prototype.processResponse = function (jsonText) {
		var result, jobs;

		try {
			result = JSON.parse(jsonText);
		} catch (e) {
			this.handleError(e);
			return;
		}

		if (!Array.isArray(result.jobs)) {
			this.handleError(new Error('jobs property is not an array in the response'));
			return;
		}

		jobs = [];

		result.jobs.forEach(function (job) {
			var jobDef = {
				name: job.name,
				color: job.color,
				building: false,
				success: false
			};

			if (job.color.match(/_anime/)) {
				jobDef.color = jobDef.color.replace(/_anime/, '');
				jobDef.building = true;
			}

			if (job.color === 'blue') {
				jobDef.success = true;
			}

			jobs.push(jobDef);
		});

		return jobs;
	};


	return BuildMonitor;


	// fid-umd post
}));
// fid-umd post-end
