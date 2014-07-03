#!/usr/bin/env node

var spm = require('./spm');
var serialport = require('serialport');
var split = require('split');

serialport.list(function (err, ports) {
	ports.forEach(function (port) {

		console.log(port);

		spm(port.comName, function (e, sp, sig) {
			if (e) throw e;

			console.log(sig.toLowerCase());

			var sp = new serialport.SerialPort(port.comName);
			sp.on('open', function () {
				console.log("open!");

				setInterval(function () {
					sp.write('?\n', function (err, results) {
						if (err) console.error("err:", err);
					});
				}, 300);

				sp.pipe(split()).on('data', function (data) {
					console.log('data:', data.toString());
				});
			});
		});
	});
});

