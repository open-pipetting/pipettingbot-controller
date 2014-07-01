#!/usr/bin/env node

var serialport = require('serialport');
var grbl = require('grbl');
var spm = require('serialport-manager');
var split = require('split');

// serialport.list(function (err, ports) {
//  if (err) throw err;

//  ports.forEach(function (port) {
//    console.log(port);
//  });
// });

// grbl(function(machine) {
//   process.stdin.pipe(machine);
//   process.stdin.resume();
//   machine.on('line', function(line) {
//     process.stdout.write('line:' + line + '\n');
//   });
// });

spm(function (err, manager) {
  if (err) throw err;

  manager.on('device', function (device) {
    var buf = '';

    if (device.info && device.info.signature.toLowerCase().indexOf('grbl') > -1) {
      device.connect(function (err, stream) {
        if (err) throw err;

        console.log("connected!");

        var statusTimer = setInterval(function () {
          stream.write('?');
        }, 500);

        // stream.pipe(process.stdout);

        stream.setEncoding('utf8');
        stream.pipe(split()).on('data', function (d) {
          console.log(d);
        });

        setTimeout(function () {
          stream.write('G1 X10\n');
          setTimeout(function () {
            stream.write('G1 X0\n');
          }, 200)
        }, 2000);

        stream.on('end', function () {
          console.log("disconnected :(");
          clearInterval(statusTimer);
        });
      });
    }

    console.log(device);
  });
});
