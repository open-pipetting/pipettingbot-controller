#!/usr/bin/env node

var models = require('./models')
	,	machines = new models.Machines()
	,	Device = models.Device
	,	currDevice
	,	searchInterval;


function doSearch () {
	var searchFun = function () {
		console.log('searching...');

		machines.search(function (device) {
			currDevice = new Device(device);

			currDevice.connect().then(function () {

				clearInterval(searchInterval);

				console.log(currDevice);

				setInterval(function () {
					currDevice.write('?\n');
				}, 300);

				currDevice.registerToData(function (d) {
					console.log(d);
				});

			}, function (err) {
				console.error(err);
			});
		});
	};

	searchFun();
	searchInterval = setInterval(searchFun, 6000);
}


doSearch();
