#!/usr/bin/env node

var serialport = require('serialport');
var sp = require('./serialport');

serialport.list(function (err, ports) {
	ports.forEach(function (port) {

		sp(port.comName, function (e, sp, sig) {
			if (e) throw e;

			console.log(sig);
		});
	});
});
