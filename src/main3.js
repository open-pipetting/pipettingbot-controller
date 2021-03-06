#!/usr/bin/env node

var yaspm = require('yaspm')
	,	machines = new yaspm.Machines();

machines.search(function (err, device) {
	if (err) throw err;

	device.connect(function () {
		device.registerToData(function (err, d) {
			if (!err) {
				console.log(d);
			}
		});

		setInterval(function () {
			device.write('?\n', function (err) {
				if (err) throw err;
			});
		}, 300);
	});
});

