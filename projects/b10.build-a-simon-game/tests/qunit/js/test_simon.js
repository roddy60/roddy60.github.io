/*
  These are not particularly good tests: because of their reliance on spies,
  and their low-level nature, the only way to verify their correctness is to
  carefully read the source code of the SUT.

  Moreover, if the SUT is changed, then one may have to carefully check all
  these tests again against the source code of the SUT.
*/

define(
  function (require) {
    var Blister = require('vendor/Blister');
    var QUnit = require('vendor/QUnit');
    var RepeatingSequence = require('test/RepeatingSequence');
    var Simon = require('Simon');
    var Ui = require('test/Ui');
    var lolex = require('vendor/lolex');
    var testdouble = require('vendor/testdouble');

    return function () {
      QUnit.module("'Simon' class");

      [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 2],
        [1, 3],
        [2, 0],
        [2, 1],
        [2, 3],
        [3, 0],
        [3, 1],
        [3, 2],
      ].forEach(
        function (colours) {
          var test_title =
            'One cycle (from game start to game start), ' +
            'with colour indices ' + colours.join(', ');

          QUnit.test(
            test_title,
            function (assert) {
              var ctr = DI_container();

              var colour_sequence = testdouble.object(['generate', 'item']);
              testdouble.
                when(colour_sequence.item(0)).
                thenReturn(colours[0]);
              testdouble.
                when(colour_sequence.item(1)).
                thenReturn(colours[1]);
              ctr.value('colour_sequence', colour_sequence);

              var simon = ctr.get('simon');
              var clock = ctr.get('clock');
              var ui = ctr.get('ui');

              simon.handleButtonClick();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['setButtonText', 'NEW GAME'],
                  ['unhighlightColourAll'],
                  ['clearMessage'],
                  ['pauseTrack'],
                  ['showNumSteps', 1],
                  ['highlightColour', colours[0]],
                  ['playColourSound', colours[0], 'show'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[0]],
                ]
              );

              simon.handleColourClick(colours[0]);
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['highlightColour', colours[0]],
                  ['playColourSound', colours[0], 'accept'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[0]],
                ]
              );

              clock.next();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['showNumSteps', 2],
                  ['highlightColour', colours[0]],
                  ['playColourSound', colours[0], 'show'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[0]],
                ]
              );

              clock.next();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['highlightColour', colours[1]],
                  ['playColourSound', colours[1], 'show'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[1]],
                ]
              );

              simon.handleColourClick(colours[0]);
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['highlightColour', colours[0]],
                  ['playColourSound', colours[0], 'accept'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[0]],
                ]
              );

              simon.handleColourClick(colours[1]);
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['highlightColour', colours[1]],
                  ['playColourSound', colours[1], 'accept'],
                ]
              );

              simon.handleAudioStop();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['unhighlightColour', colours[1]],
                  ['showVictoryMessage', 'YOU WON!'],
                ]
              );

              simon.handleCssTransitionEnd();
              assert.deepEqual(
                ui.takeBatch(),
                [
                  ['clearMessage'],
                  ['unhighlightColourAll'],
                  ['clearMessage'],
                  ['pauseTrack'],
                  ['showNumSteps', 1],
                  ['highlightColour', colours[0]],
                  ['playColourSound', colours[0], 'show'],
                ]
              );
            }
          ); // End of call to QUnit#test
        }
      ); // End of call to Array#forEach

      QUnit.test(
        'Click wrong button',
        function (assert) {
          var ctr = DI_container();

          var simon = ctr.get('simon');
          var ui = ctr.get('ui');

          simon.handleButtonClick();
          simon.handleAudioStop();
          ui.takeBatch();

          simon.handleColourClick(1);
          assert.deepEqual(
            ui.takeBatch(),
            [
              ['showErrorMessage', 'WRONG BUTTON!'],
              ['highlightColour', 1],
              ['playColourSound', 1, 'reject'],
            ]
          );

          simon.handleAudioStop();
          simon.handleCssTransitionEnd();
          assert.deepEqual(
            ui.takeBatch(),
            [
              ['unhighlightColour', 1],
              ['clearMessage'],
              ['highlightColour', 0],
              ['playColourSound', 0, 'show'],
            ]
          );
        }
      );

      QUnit.test(
        "Click wrong button when 'strict' is in effect",
        function (assert) {
          var ctr = DI_container();

          var simon = ctr.get('simon');
          var clock = ctr.get('clock');
          var ui = ctr.get('ui');

          simon.handleCheckboxClick(true);

          simon.handleButtonClick();

          simon.handleAudioStop();

          simon.handleColourClick(0);
          simon.handleAudioStop();

          clock.next();

          simon.handleAudioStop();
          clock.next();
          simon.handleAudioStop();

          ui.takeBatch();

          simon.handleColourClick(1);
          assert.deepEqual(
            ui.takeBatch(),
            [
              [
                'showErrorMessage',
                'WRONG BUTTON!  NEW GAME WILL START.'
              ],
              ['highlightColour', 1],
              ['playColourSound', 1, 'reject'],
            ]
          );

          simon.handleAudioStop();
          simon.handleCssTransitionEnd();
          assert.deepEqual(
            ui.takeBatch(),
            [
              ['unhighlightColour', 1],
              ['showNumSteps', 1],
              ['clearMessage'],
              ['highlightColour', 0],
              ['playColourSound', 0, 'show'],
            ]
          );
        }
      );

      QUnit.test(
        'Timeout',
        function (assert) {
          //> Given

          var ctr = DI_container();

          var simon = ctr.get('simon');
          var clock = ctr.get('clock');
          var ui = ctr.get('ui');

          //> When

          simon.handleButtonClick();
          simon.handleAudioStop();
          ui.takeBatch();

          clock.next();
          var batch = ui.takeBatch();

          //> Then

          assert.deepEqual(
            batch,
            [
              [
                'showErrorMessage',
                'YOU WAITED TOO LONG\u00A0— SEQUENCE WILL BE SHOWN AGAIN'
              ],
              ['playSound', 'out_of_time'],
            ]
          );
        }
      );

      QUnit.test(
        "Clicks aren't buffered",
        function (assert) {
          //> Given

          var ctr = DI_container();

          var simon = ctr.get('simon');
          var clock = ctr.get('clock');
          var ui = ctr.get('ui');

          //> When

          simon.handleButtonClick();

          clock.tick(50);
          simon.handleColourClick(0);
          clock.tick(50);
          /*<
            What we are testing with this test is that the click we just
            sent is ignored.

            The calls to clock.tick should be unnecessary, but help to add
            realism.  The argument to clock.tick is pretty arbitrary.
          */

          simon.handleAudioStop();
          ui.takeBatch();

          clock.next();
          var batch = ui.takeBatch();

          //> Then

          assert.deepEqual(
            batch,
            [
              [
                'showErrorMessage',
                'YOU WAITED TOO LONG\u00A0— SEQUENCE WILL BE SHOWN AGAIN'
              ],
              ['playSound', 'out_of_time'],
            ]
          );
        }
      );

      QUnit.test(
        'Start new game',
        function (assert) {
          //> Given

          var ctr = DI_container();

          var colour_sequence = testdouble.object(['generate', 'item']);
          var second_colour_index = 3;
          testdouble.
            when(colour_sequence.item(0)).
            thenReturn(0, second_colour_index);
          ctr.value('colour_sequence', colour_sequence);

          var simon = ctr.get('simon');
          var ui = ctr.get('ui');

          //> When

          simon.handleButtonClick();
          ui.takeBatch();

          simon.handleButtonClick();
          var batch = ui.takeBatch();

          //> Then

          testdouble.verify(colour_sequence.generate(), { times: 2 });

          assert.deepEqual(
            batch,
            [
              ['unhighlightColourAll'],
              ['clearMessage'],
              ['pauseTrack'],
              ['showNumSteps', 1],
              ['highlightColour', second_colour_index],
              ['playColourSound', second_colour_index, 'show'],
            ]
          );
        }
      );
    };

    function DI_container() {
      var container = new Blister;

      container.value('clock', lolex.createClock());
      container.value('colour_sequence', new RepeatingSequence);
      container.value('ui', new Ui);
      container.value('total_steps_final', 2);
      container.service(
        'simon',
        function (c) {
          var options = {};

          if (c.get('total_steps_final') != null) {
            options.total_steps_final = c.get('total_steps_final');
          }

          return new Simon(
            c.get('clock'),
            c.get('colour_sequence'),
            c.get('ui'),
            options
          );
        }
      );

      return container;
    }
  }
);
