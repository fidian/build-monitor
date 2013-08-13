/**
 * Communication library to update a Philips Hue
 *
 * http://rsmck.co.uk/hue
 * http://developers.meethue.com/
 */
// fid-umd {"name":"OutputPhilipsHue","depends":[{"name":"RequestPromise","commonjs":"../request-promise"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("../request-promise")); return; } catch (a) {}
	try { exports[n] = f(require("../request-promise")); return; } catch (b) {}
	try { return define.amd && define(n, ["RequestPromise"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.RequestPromise); }, "", { requires: ["RequestPromise"] }); } catch (d) {}
	try { r[n] = f(r.RequestPromise); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("OutputPhilipsHue", this, function (RequestPromise) {
	"use strict";
	// fid-umd end


	function OutputPhilipsHue(config) {
		this.uri = config.uri;
		this.debug = config.debug;
	}


	OutputPhilipsHue.prototype.update = function (stateParams) {
		var promise;
		promise = new RequestPromise({
			uri: this.uri,
			method: 'PUT',
			json: stateParams
		});

		if (this.debug) {
			promise.then(function (response) {
				console.log('update response', response.body);
			}, function (error) {
				console.log('update error', error);
			});
		}

		return promise;
	};


	return OutputPhilipsHue;


	// fid-umd post
}));
// fid-umd post-end
