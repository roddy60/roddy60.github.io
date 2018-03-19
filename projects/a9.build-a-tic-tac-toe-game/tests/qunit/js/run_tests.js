define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var test_engine = require('test/test_engine');
    var test_state = require('test/test_state');

    return function () {
      test_engine();
      test_state();

      QUnit.start();
    };
  }
);
