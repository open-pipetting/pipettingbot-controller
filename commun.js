
var spm = require('serialport-manager');
var split = require('split');

spm(function (err, manager) {
  console.log("dashiudhas");

  if (err) throw err;

  manager.on('device', function (device) {
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
  });
});
