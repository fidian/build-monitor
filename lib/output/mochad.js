/**
 * Communication library to update X10 controlled with mochad
 *
 * https://github.com/njh/mochad
 */

// fid-umd {"name":"OutputMochad","depends":[{"name":"RequestPromise","commonjs":"../request-promise"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("../request-promise")); return; } catch (a) {}
	try { exports[n] = f(require("../request-promise")); return; } catch (b) {}
	try { return define.amd && define(n, ["RequestPromise"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.RequestPromise); }, "", { requires: ["RequestPromise"] }); } catch (d) {}
	try { r[n] = f(r.RequestPromise); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("OutputMochad", this, function (RequestPromise) {
	"use strict";
	// fid-umd end


	var connectionList;

	connectionList = [];


	function Mochad(config) {
		if (!config.host) {
			this.host = '127.0.0.1';
		} else {
			this.host = config.host;
		}

		if (!config.port) {
			this.port = 1099;
		} else {
			this.port = config.port;
		}

		this.device = config.device;
		this.debug = config.debug;
		this.connection = this.connect(this.host, this.port);
	}


	Mochad.prototype.connect = function (host, port) {
		var key;

		key = host + ':' + port;

		if (!connectionList[key]) {
			connectionList[key] = {
				send: function (message) {
					//console.log('Should be sending', message, 'to', key);
				}
			};
		}

		return connectionList[key];
	};


	Mochad.prototype.update = function (state) {
		this.connection.send(this.device + ' ' + state);
	};


	return Mochad;


	// fid-umd post
}));
// fid-umd post-end
