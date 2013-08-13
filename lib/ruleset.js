/**
 * Ruleset - Parse a set of rules and later allow matching.
 */
// fid-umd {"name":"Ruleset","depends":[{"name":"MatchMaker","commonjs":"./match-maker"}],"jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(require("./match-maker")); return; } catch (a) {}
	try { exports[n] = f(require("./match-maker")); return; } catch (b) {}
	try { return define.amd && define(n, ["MatchMaker"], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(Y.MatchMaker); }, "", { requires: ["MatchMaker"] }); } catch (d) {}
	try { r[n] = f(r.MatchMaker); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("Ruleset", this, function (MatchMaker) {
	"use strict";
	// fid-umd end


	function Ruleset(rules) {
		var myself;
		myself = this;
		this.rules = rules;
		this.rules.forEach(function (rule) {
			rule.match = myself.makeRuleMatcher(rule);
		});
		this.debug = rules.debug;
	}


	/**
	 * Convert a rule config into a function that will return true or false
	 * depending on the array of job status objects that's passed in.
	 *
	 * @param object rule
	 * @return function match(jobStatus) returns boolean
	 */
	Ruleset.prototype.makeRuleMatcher = function (rule) {
		var colorMatcher, ruleMatcher;

		if (rule.color !== undefined) {
			colorMatcher = new MatchMaker(rule.color);
		}

		return function (jobStatus) {
			if (rule.building !== undefined && rule.building !== jobStatus.building) {
				return false;
			}

			if (rule.success !== undefined && rule.success !== jobStatus.success) {
				return false;
			}

			if (colorMatcher && !colorMatcher.test(jobStatus.color)) {
				return false;
			}

			return true;
		};
	};


	Ruleset.prototype.receiveUpdate = function (jobStatusArray, matchCallback) {
		// Stop on the first rule that matches any job status object
		return this.rules.some(function (rule) {
			if (jobStatusArray.some(function (jobStatus) {
					return rule.match(jobStatus);
				})) {
				// A job status triggered a rule
				matchCallback(rule.send);
				return true;
			}

			return false;
		});
	};


	return Ruleset;


	// fid-umd post
}));
// fid-umd post-end
