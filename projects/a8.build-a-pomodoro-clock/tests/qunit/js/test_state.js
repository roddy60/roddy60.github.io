define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var State = require('State');
    var TestClock = require('test/Clock');
    var from_HMS = require('test/utils').from_HMS;

    var POMODORO_LENGTH = 25;
    var BREAK_LENGTH = 3;

    return function () {
      QUnit.module(
        "'State' class",
        {
          beforeEach: function () {
            this.clock = new TestClock;
            this.state = new State(
              this.clock,
              POMODORO_LENGTH,
              BREAK_LENGTH,
              POMODORO_LENGTH
            );
          },
        }
      );

      QUnit.test(
        'Initial properties',
        function (assert) {
          //> When

          var props = this.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'initial');
          assert.strictEqual(props.display_mode, '—');
          assert.strictEqual(props.time_elapsed, '—');
          assert.strictEqual(props.time_remaining, '—');
          assert.strictEqual(props.time_fraction_elapsed, 0);
        }
      );

      QUnit.test(
        'In first pomodoro',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.addTime(from_HMS(15, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_elapsed, '15:00');
          assert.strictEqual(props.time_remaining, '10:00');
        }
      );

      QUnit.test(
        'In first break',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.addTime(from_HMS(25 + 1, 20));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'break');
          assert.strictEqual(props.time_elapsed, '1:20');
          assert.strictEqual(props.time_remaining, '1:40');
        }
      );

      QUnit.test(
        'In second pomodoro',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.addTime(from_HMS(25 + 3 + 1, 13));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_elapsed, '1:13');
          assert.strictEqual(props.time_remaining, '23:47');
        }
      );

      QUnit.test(
        'Timer is off for a time',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(5, 0));
          test_objects.state.toggle();

          test_objects.clock.setTime(from_HMS(10, 0));
          test_objects.state.toggle();

          test_objects.clock.setTime(from_HMS(11, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_elapsed, '6:00');
        }
      );

      QUnit.test(
        'Reset works when in pomodoro',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 100);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(1, 0));
          test_objects.state.reset();

          test_objects.clock.addTime(from_HMS(99, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_elapsed, '1:39:00');
          assert.strictEqual(props.time_remaining, '1:00');
        }
      );

      QUnit.test(
        'Reset works when in break',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 15);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(25 + 1, 0));
          test_objects.state.reset();

          test_objects.clock.addTime(from_HMS(7, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'break');
          assert.strictEqual(props.time_elapsed, '7:00');
          assert.strictEqual(props.time_remaining, '8:00');
        }
      );

      QUnit.test(
        'Reset length doesn\'t "contaminate" length of next 2 periods',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 30);
          test_objects.state.toggle();

          //> When

          test_objects.clock.addTime(from_HMS(1, 0));
          test_objects.state.reset();

          test_objects.clock.addTime(from_HMS(30 + 1, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'break');
          assert.strictEqual(props.time_remaining, '2:00');

          //> When

          test_objects.clock.addTime(from_HMS(3, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_remaining, '24:00');
        }
      );

      QUnit.test(
        'Changing pomodoro length doesn\'t affect current pomodoro',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(24, 0));
          test_objects.state.addToPomodoroLength(5);

          test_objects.clock.setTime(from_HMS(26, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.pomodoro_length, 30);
          assert.strictEqual(props.mode, 'break');
          assert.strictEqual(props.time_remaining, '2:00');
        }
      );

      QUnit.test(
        'Changing break length doesn\'t affect current break',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(26, 0));
          test_objects.state.addToBreakLength(7);

          test_objects.clock.setTime(from_HMS(30, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.strictEqual(props.break_length, 10);
          assert.strictEqual(props.mode, 'pomodoro');
          assert.strictEqual(props.time_remaining, '23:00');
        }
      );

      QUnit.test(
        'Multiple simultaneous events with no exception thrown',
        function (assert) {
          assert.expect(0);

          var actions = [
            function (state) { state.toggle(); },
            function (state) { state.toggle(); },

            function (state) { state.reset(); },
            function (state) { state.toggle(); },
            function (state) { state.reset(); },
            function (state) { state.toggle(); },

            function (state) { state.addToBreakLength(1); },
            function (state) { state.toggle(); },
            function (state) { state.addToPomodoroLength(1); },
            function (state) { state.toggle(); },
            function (state) { state.addToLengthAfterReset(1); },
            function (state) { state.toggle(); },
          ];

          run_actions(this.state, actions);

          run_actions(this.state, actions.concat().reverse());

          function run_actions(state, actions) {
            actions.forEach(
              function (action) {
                action(state);
                state.getProperties();
              }
            );
          }
        }
      );

      QUnit.test(
        'Resettable: initially',
        function (assert) {
          assert.notOk(this.state.getProperties().resettable);
        }
      );

      QUnit.test(
        'Resettable: during first pomodoro',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(10, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.ok(props.resettable);
        }
      );

      QUnit.test(
        'Resettable: during first break',
        function (assert) {
          //> Given

          var test_objects = create_test_objects(25, 3, 25);
          test_objects.state.toggle();

          //> When

          test_objects.clock.setTime(from_HMS(26, 0));
          var props = test_objects.state.getProperties();

          //> Then

          assert.ok(props.resettable);
        }
      );
    }

    /**
      * @param {number} [length_after_reset] - defaults to pomodoro_length
      * @return {Object<string, Object>}
      */
    function create_test_objects
      (pomodoro_length, break_length, length_after_reset)
    {
      var clock = new TestClock;
      return {
        clock: clock,
        state: new State(
          clock,
          pomodoro_length,
          break_length,
          arguments.length >= 3? length_after_reset: pomodoro_length
        ),
      }
    }
  }
);
