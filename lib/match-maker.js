/**
 * MatchMaker - create a matching function to see if a given string matches
 * against any of the following:
 *  - another string (exactly)
 *  - a pattern
 *  - an array of strings or patterns
 **/
// fid-umd {"name":"MatchMaker","jslint":1}
/*global define, YUI*/
(function (n, r, f) {
	"use strict";
	try { module.exports = f(); return; } catch (a) {}
	try { exports[n] = f(); return; } catch (b) {}
	try { return define.amd && define(n, [], f); } catch (c) {}
	try { return YUI.add(n, function (Y) { Y[n] = f(); }); } catch (d) {}
	try { r[n] = f(); return; } catch (e) {}
	throw new Error("Unable to export " + n);
}("MatchMaker", this, function () {
	"use strict";
	// fid-umd end


	/**
	 * Create an object that, when you call its 'test' method, will return
	 * true or false.
	 */
	function MatchMaker(matchMe) {
		var matchMeString;

		if (Array.isArray(matchMe)) {
			this.test = MatchMaker.parseArray(matchMe);
			return;
		}

		matchMeString = matchMe.toString();

		if (MatchMaker.isPattern(matchMeString)) {
			this.test = MatchMaker.parsePattern(matchMeString);
			return;
		}

		this.test = MatchMaker.parseString(matchMeString);
	}


	/**
	 * Return true if the string looks like it could be a regular
	 * expression in the disguise of a humble string
	 *
	 * @param string str
	 * @return boolean True if it looks like a pattern
	 */
	MatchMaker.isPattern = function (str) {
		if (str.indexOf('/') !== 0 || str.lastIndexOf('/') === 0) {
			return false;
		}

		return true;
	};


	/**
	 * Return a function that will return true if any of the elements
	 * in the array match an input string.
	 *
	 * @param Array arr Array of things to match against
	 * @return function match(against) returns boolean
	 */
	MatchMaker.parseArray = function (arr) {
		var testers;

		testers = [];
		arr.forEach(function (element) {
			testers.push(new MatchMaker(element));
		});

		return function (against) {
			return testers.some(function (matcher) {
				return matcher.test(against);
			});
		};
	};


	/**
	 * Return a function that will return true when passed in a string
	 * that matches the input to this method.
	 *
	 * @param string str
	 * @return function match(against) returns boolean
	 */
	MatchMaker.parsePattern = function (str) {
		var flags, lastIndex, patternString, re;

		lastIndex = str.lastIndexOf('/');
		flags = str.substr(lastIndex + 1);
		patternString = str.substr(1, lastIndex - 1);
		re = new RegExp(patternString, flags);

		return function (against) {
			return re.test(against);
		};
	};


	/**
	 * Return a function that will return true when passed in a string
	 * that matches the input to this method.
	 *
	 * @param string str
	 * @return function match(against) returns boolean
	 */
	MatchMaker.parseString = function (str) {
		return function (against) {
			return against === str;
		};
	};


	return MatchMaker;


	// fid-umd post
}));
// fid-umd post-end
