define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var test_calculator = require('test/test_calculator');

    return function () {
      test_calculator();

      QUnit.start();
    };
  }
);
