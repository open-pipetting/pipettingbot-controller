var spm = require('serialport-manager');
var split = require('split');
if (!$q)
  var $q = require('q');

/**
 * Represents the conjunction of machines that we might have to search
 */
function Machines () {}

Machines.prototype.search = function (onValidDeviceFound) {
  var scope = this;

  spm(function (err, manager) {
    if (err) throw err;

    manager.on('device', function (device) {
      if (scope.isValidDevice(device))
        onValidDeviceFound(device);
    });
  });
};

Machines.prototype.isValidDevice = function (device) {
  if (!device.info ||
      !~device.info.signature.toLowerCase().indexOf('grbl'))
    return false;
  return true;
};

/**
 * Represents a device.
 * @param {function} dFun callback function for disconnect event
 */
function Device (device, dFun) {
  this.device = device;
  this.stream = null;
  this.dFun = dFun;
}

Device.prototype.connect = function (onData) {
  var dfd = $q.defer();
  var scope = this;

  this.device.connect(function (err, stream) {
    if (err) dfd.reject(err);

    stream.setEncoding('utf8');
    stream.on('end', function () {
      dFun('disconnected');
    });

    scope.stream = stream;
    dfd.resolve(scope);
  });

  return dfd.promise;
};

Device.prototype.write = function (data) {
  this.stream.write(data);
};

Device.prototype.registerToData = function(fn) {
  this.stream.pipe(split()).on('data', function (d) {
    fn(d);
  });
};

module.exports = {
  Device: Device,
  Machines: Machines
};
