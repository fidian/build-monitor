#!/usr/bin/env node

'use strict';

var config, outputList, yaml;


function showHelpAndExit(parser) {
	console.log('Monitor the build status and update "information radiators" to provide');
	console.log('real-time feedback regarding your software\'s health.');
	console.log('');
	console.log('Usage:');
	console.log('\t' + parser.programName() + ' [options] config_file.yml');
	console.log('');
	console.log('Available options:');
	console.log(parser.help());
	process.exit(0);
}

function makeOptionParser() {
	var optionParserLib, parser;

	optionParserLib = require('OptionParser');
	parser = new optionParserLib.OptionParser();
	parser.addOption('h', 'help', 'Display this help message').action(showHelpAndExit);

	return parser;
}

function makeOutputs(outputConfigList) {
	var result, Output;

	Output = require('../lib/output-devices');
	result = [];
	outputConfigList.forEach(function (outputConfig) {
		result.push(new Output(outputConfig));
	});

	return result;
}


function makeMonitor(config, outputList) {
	var Monitor, monitor;

	Monitor = require('../lib/build-monitor');
	monitor = new Monitor(config);
	outputList.forEach(function (output) {
		monitor.addOutput(output);
	});
	monitor.makeRequest();
}


function findConfigFile() {
	var filename, leftOverArguments, parser;
	parser = makeOptionParser();
	leftOverArguments = parser.parse();

	if (leftOverArguments.length !== 1) {
		console.error('You must specify a filename.');
		console.error('For a list of options, use --help');
		process.exit(0);
	}

	filename = leftOverArguments[0];

	if (!filename.match(/^\.{0,2}\//)) {
		filename = './' + filename;
	}

	return filename;
}


// Load YAML before the configuration file
yaml = require('yamljs');


config = require(findConfigFile());
outputList = makeOutputs(config.output);
makeMonitor(config.input, outputList);
