define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var test_clock = require('test/test_clock');
    var test_pomodoro_utils = require('test/test_utils');
    var test_state = require('test/test_state');

    return function () {
      test_clock();
      test_pomodoro_utils();
      test_state();

      QUnit.start();
    };
  }
);
