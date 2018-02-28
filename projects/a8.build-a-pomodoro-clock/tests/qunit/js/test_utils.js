define(
  function (require) {
    var format_time = require('utils').format_time;
    var from_HMS = require('test/utils').from_HMS;

    return function () {
      QUnit.module('Pomodoro utility functions (pomodoro_utils)');

      [
        [[], '0:00'],
        [[1, 0], '1:00'],
        [[1, 59], '1:59'],
        [[30, 1], '30:01'],
        [[1, 0, 1], '1:00:01'],
        [[137, 53, 1], '137:53:01'],
      ].forEach(
        function (pair) {
          var input = pair[0];
          var milliseconds = from_HMS.apply(null, input);
          var expected_output = pair[1];

          var test_title =
            '<' + input.join(', ') + '> is formatted as ' +
            expected_output;

          QUnit.test(
            test_title,
            function (assert) {
              assert.strictEqual(
                format_time(milliseconds),
                expected_output
              );
            }
          );
        }
      );
    };
  }
);
