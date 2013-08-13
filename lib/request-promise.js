/**
 * Wrap Request in a FidPromise
 */
// fid-umd {"name":"RequestPromise","depends":["request",{"name":"FidPromise","commonjs":"fid-promise"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("request"), require("fid-promise")); return; } catch (a) {}
	try { exports[n] = f(require("request"), require("fid-promise")); return; } catch (b) {}
	try { return define.amd && define(n, ["request", "FidPromise"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.request, Y.FidPromise); }, "", { requires: ["request", "FidPromise"] }); } catch (d) {}
	try { r[n] = f(r.request, r.FidPromise); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("RequestPromise", this, function (request, FidPromise) {
	"use strict";
	// fid-umd end


	function RequestPromise(config) {
		var promise;

		promise = new FidPromise();
		request(config, function (error, response, body) {
			if (error) {
				promise.reject(error);
				return;
			}

			promise.resolve({
				response: response,
				body: body
			});
		});

		return promise;
	}


	return RequestPromise;


	// fid-umd post
}));
// fid-umd post-end
