define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var test_simon = require('test/test_simon');

    return function () {
      test_simon();

      QUnit.start();
    };
  }
);
