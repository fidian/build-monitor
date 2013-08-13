/**
 * Output - Hooks up devices (of only one type) and the matching rules.
 */
// fid-umd {"name":"OutputDevices","depends":[{"name":"MatchMaker","commonjs":"./match-maker"},{"name":"Ruleset","commonjs":"./ruleset"},{"name":"OutputMochad","commonjs":"./output/mochad"},{"name":"OutputPhilipsHue","commonjs":"./output/philips-hue"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("./match-maker"), require("./ruleset"), require("./output/mochad"), require("./output/philips-hue")); return; } catch (a) {}
	try { exports[n] = f(require("./match-maker"), require("./ruleset"), require("./output/mochad"), require("./output/philips-hue")); return; } catch (b) {}
	try { return define.amd && define(n, ["MatchMaker", "Ruleset", "OutputMochad", "OutputPhilipsHue"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.MatchMaker, Y.Ruleset, Y.OutputMochad, Y.OutputPhilipsHue); }, "", { requires: ["MatchMaker", "Ruleset", "OutputMochad", "OutputPhilipsHue"] }); } catch (d) {}
	try { r[n] = f(r.MatchMaker, r.Ruleset, r.OutputMochad, r.OutputPhilipsHue); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("OutputDevices", this, function (MatchMaker, Ruleset, OutputMochad, OutputPhilipsHue) {
	"use strict";
	// fid-umd end


	var modulesByName;

	modulesByName = {
		Mochad: OutputMochad,
		PhilipsHue: OutputPhilipsHue
	};


	function OutputDevice(config) {
		var ModuleFunc, moduleName, myself;

		myself = this;
		moduleName = config.type;
		ModuleFunc = modulesByName[moduleName];
		this.name = config.name;
		this.debug = config.debug;
		this.moduleList = [];

		if (Array.isArray(config.moduleConfig)) {
			config.moduleConfig.forEach(function (singleModuleConfig) {
				myself.moduleList.push(new ModuleFunc(singleModuleConfig));
			});
		} else {
			this.moduleList.push(new ModuleFunc(config.moduleConfig));
		}

		this.projectMatch = new MatchMaker(config.project);
		this.ruleset = new Ruleset(config.rules);
		this.refresh = config.refresh;
		this.lastSend = null;
		this.lastSendString = '';
		this.refreshTimer = null;
	}


	OutputDevice.prototype.receiveUpdate = function (jobStatusArray) {
		var matchingStatusList, myself;

		myself = this;
		matchingStatusList = jobStatusArray.filter(function (jobStatus) {
			return myself.projectMatch.test(jobStatus.name);
		});

		if (this.debug) {
			console.log(this.name, 'matched project name with', matchingStatusList);
		}

		if (matchingStatusList.length === 0) {
			return;
		}

		this.ruleset.receiveUpdate(matchingStatusList, this.send.bind(this));
	};


	OutputDevice.prototype.refreshOutput = function () {
		var myself;

		myself = this;

		if (this.debug) {
			console.log('Refreshing', this.name);
		}

		this.moduleList.forEach(function (module) {
			module.update(myself.lastSend, true);
		});
	};


	OutputDevice.prototype.resetRefreshTimer = function (what) {
		this.lastSend = what;

		console.log('Refresh reset timer', this.name);

		if (this.refreshTimer) {
			clearInterval(this.refreshTimer);
			this.refreshTimer = null;
		}

		this.refreshTimer = setInterval(this.refreshOutput.bind(this), this.refresh);
	};


	OutputDevice.prototype.send = function (what) {
		var thisSend;

		thisSend = JSON.stringify(what);

		if (thisSend === this.lastSendString) {
			if (this.debug) {
				console.log(this.name, 'send-unchanged', what);
			}

			return;
		}

		if (this.debug) {
			console.log(this.name, 'send', what);
		}

		this.lastSend = what;
		this.lastSendString = thisSend;
		this.resetRefreshTimer(what);
		this.moduleList.forEach(function (module) {
			module.update(what);
		});
	};


	return OutputDevice;


	// fid-umd post
}));
// fid-umd post-end
