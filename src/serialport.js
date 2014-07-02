#!/usr/bin/env node

var SerialPort = require('serialport').SerialPort;

/**
 * Gets the signature from a serialport openning
 * @param  {object}   sp serialport object
 * @param  {Function} fn callback function to be released with (ERRROR
 *                       | SERIALPORT | SIGNATURE)
 */
var signature = function(sp, fn) {
  // collect the device signature
  var start = null
  	, sig = ''
  	, timer;

  var handleSignature = function(data) {
    if (data) {
      sig += data.toString() || '';
    }

    clearTimeout(timer);

    if (start === null && data) {
      start = Date.now();
    } else if (Date.now() - start > 100) {
      sp.removeListener('data', handleSignature);
      return fn(null, sig.trim());
    }
    timer = setTimeout(handleSignature, 100);
  };

  sp.on('data', handleSignature);
};

/**
 * Main function to be exported. It exposes a better serialport.
 * @param  {[type]}   comName the comName returned from the port
 *                            listing
 * @param  {Function} fn      callback function to be called with
 *                            (err|sp|signature)
 */
module.exports = function(comName, fn) {
  var sp = new SerialPort(comName)
  	,	open = false;

  sp.writable = true;

  sp.on('open', function() {
    open = true;
    signature(sp, function(e, sig) {
      fn(e, sp, sig);
    });
  });

  sp.once('error', function(e) {
    console.log('ERROR', e, comName);
    if (!open)
      fn(e);
  });
};
