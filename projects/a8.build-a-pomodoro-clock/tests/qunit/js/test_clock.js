define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var Clock = require('Clock');
    /*< This class is the SUT (System Under Test) */
    var TestClock = require('test/Clock');

    return function () {
      QUnit.module("'Clock' class");

      QUnit.test(
        'Change of rate',
        function (assert) {
          //> Given

          var test_clock = new TestClock;
          var clock = new Clock(test_clock);

          //> When

          test_clock.setTime(1000);
          clock.setRate(2);
          test_clock.setTime(2000);
          var time = clock.getTime();

          //> Then

          assert.strictEqual(time, 3000);
        }
      );
    }
  }
);
