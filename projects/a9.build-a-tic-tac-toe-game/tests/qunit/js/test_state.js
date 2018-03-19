define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var Engine = require('Engine');
    var Square = require('Square');
    var State = require('State');

    /*>
      The arrays begin with an ignored element, so that the first pair of
      coordinates is numbered 1, not 0.
    */
    var CLICK_COORDS = {
      'O loses': [
        null,
        [1, 0],
        [1, 1],
      ],
      'O plays and draws': [
        null,
        [0, 1],
        [1, 1],
        [2, 0],
        [2, 2],
      ],
      'O wins': [
        null,
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      'X plays and draws': [
        null,
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 2],
      ],
      'X wins': [
        null,
        [0, 2],
        [1, 2],
        [2, 2],
      ],
    };

    return function () {
      QUnit.module("'State' class");

      ['X', 'O'].forEach(
        function (player) {
          var title = 'User wins as ' + player;
          var click_sequence_name = player + ' wins';

          QUnit.test(
            title,
            function (assert) {
              //> Given

              var state = create_state(true);
              var messages = [];

              //> When

              state.chooseX();
              messages.push(state.getProperties().status_message);

              click(state, click_sequence_name, 1);
              messages.push(state.getProperties().status_message);

              click(state, click_sequence_name, 2);
              messages.push(state.getProperties().status_message);

              click(state, click_sequence_name, 3);
              messages.push(state.getProperties().status_message);

              //> Then

              assert.deepEqual(
                messages,
                [
                  'YOUR MOVE',
                  'YOUR MOVE',
                  'YOUR MOVE',
                  'YOU WON!',
                ]
              );
            }
          );
        }
      );

      QUnit.test(
        'User loses as O',
        function (assert) {
          //> Given

          var state = create_state(true);
          var messages = [];

          //> When

          state.chooseO();
          messages.push(state.getProperties().status_message);

          click(state, 'O loses', 1);
          messages.push(state.getProperties().status_message);

          click(state, 'O loses', 2);
          messages.push(state.getProperties().status_message);

          //> Then

          assert.deepEqual(
            messages,
            [
              'YOUR MOVE',
              'YOUR MOVE',
              'YOU LOST!',
            ]
          );
        }
      );

      ['X', 'O'].forEach(
        function (player) {
          var title = player + ' plays and draws';
          var choosing_method = 'choose' + player;
          var click_sequence_name = title;

          QUnit.test(
            title,
            function (assert) {
              //> Given

              var state = create_state(true);
              state[choosing_method].call(state);

              //> When

              var i = 1;
              do {
                click(state, click_sequence_name, i);
                i++;
                var status_message = state.getProperties().status_message;
              } while (status_message === 'YOUR MOVE');

              // Then

              assert.strictEqual(status_message, 'DRAW');
            }
          );
        }
      );

      ['X', 'O'].forEach(
        function (player) {
          var title = player + ' plays and draws, new game starts';
          var choosing_method = 'choose' + player;
          var click_sequence_name = player + ' plays and draws';

          QUnit.test(
            title,
            function (assert) {
              //> Given

              var state = create_state();
              var screens = [];

              //> When

              state[choosing_method].call(state);

              CLICK_COORDS[click_sequence_name].forEach(
                function (coords) {
                  state.click.apply(state, coords);
                  screens.push(state.getProperties().screen);
                }
              );

              //> Then

              assert.deepEqual(screens.slice(-2), [2, 1]);
            }
          );
        }
      );

      QUnit.test(
        'startNewGame',
        function (assert) {
          //> Given

          var state = create_state();
          var screens = [];

          //> When

          state.chooseO();
          screens.push(state.getProperties().screen);

          state.startNewGame();
          screens.push(state.getProperties().screen);

          state.chooseX();
          screens.push(state.getProperties().screen);

          //> Then

          assert.deepEqual(screens, [2, 1, 2]);
        }
      );

      QUnit.test(
        'At game end, turning off waiting starts new game',
        function (assert) {
          //> Given

          var state = create_state(true);
          state.chooseX();

          //> When

          click(state, 'X wins', 1);
          click(state, 'X wins', 2);
          click(state, 'X wins', 3);

          var screen1 = state.getProperties().screen;
          state.waitAtEndOfGame(false);
          var screen2 = state.getProperties().screen;

          //> Then

          assert.strictEqual(screen1, 2);
          assert.strictEqual(screen2, 1);
        }
      );

      [
        [undefined, 1, undefined],
        [false, 1, undefined],
        [true, 2, 'YOU WON!'],
      ].forEach(
        function () {
          var wait_at_end_of_game = arguments[0][0];
          var expected_screen = arguments[0][1];
          var expected_status_message = arguments[0][2];

          QUnit.test(
            'wait_at_end_of_game: ' + wait_at_end_of_game,
            function (assert) {
              //> Given

              var state = create_state();
              if (typeof wait_at_end_of_game === 'boolean') {
                state.waitAtEndOfGame(wait_at_end_of_game);
              }

              //> When

              state.chooseX();

              click(state, 'X wins', 1);
              click(state, 'X wins', 2);
              click(state, 'X wins', 3);

              var tmp = state.getProperties();
              var screen = tmp.screen;
              var status_message = tmp.status_message;

              //> Then

              assert.strictEqual(screen, expected_screen);
              assert.strictEqual(status_message, expected_status_message);
            }
          );
        }
      );

      [0, 1, 2].forEach(
        function (row) {
          [0, 1, 2].forEach(
            function (col) {
              var coords = '<' + row + ', ' + col + '>';
              QUnit.test(
                'board_changes: first X at ' + coords,
                function (assert) {
                  //> Given

                  var state = create_state(true);

                  //> When

                  state.chooseX();
                  state.click(row, col);
                  var board_changes1 = state.getProperties().board_changes;
                  state.click(row, col);
                  var board_changes2 = state.getProperties().board_changes;

                  //> Then

                  assert.strictEqual(board_changes1.length, 2);
                  assert.deepEqual(
                    board_changes1[0],
                    new Square(row, col, 'X')
                  );
                  assert.deepEqual(board_changes2, []);
                }
              );
            }
          )
        }
      );

      [['X', 0], ['O', 1]].forEach(
        function () {
          var player = arguments[0][0];
          var first_length = arguments[0][1];

          var title = 'board_changes: when ' + player + ' wins';
          var choosing_method = 'choose' + player;
          var click_sequence_name = player + ' wins';

          QUnit.test(
            title,
            function (assert) {
              /*
                It's too difficult to break this function into "Given",
                "When", and "Then" sections.
              */

              var state = create_state(true);

              var lengths = [];

              state[choosing_method].call(state);

              lengths.push(state.getProperties().board_changes.length);

              for (var i = 1; i <= 3; i++) {
                var coords = CLICK_COORDS[click_sequence_name][i];
                state.click.apply(state, coords);
                var board_changes = state.getProperties().board_changes;

                assert.deepEqual(
                  board_changes[0],
                  new Square(coords[0], coords[1], player)
                );

                lengths.push(board_changes.length);

                for (var j = 1; j <= i; j++) {
                  click(state, click_sequence_name, j);
                  assert.deepEqual(state.getProperties().board_changes, []);
                }
              }

              assert.deepEqual(lengths, [first_length, 2, 2, 1]);
            }
          );
        }
      );

      QUnit.test(
        'board_changes: when one game has just succeeded another',
        function (assert) {
          //> Given

          var state = create_state();
          state.chooseX();

          //> When

          state.startNewGame();
          state.chooseX();
          var board_changes = state.getProperties().board_changes;

          //> Then

          assert.strictEqual(board_changes.length, 9);
        }
      );
    };

    /**
      * name_of_sequence specifies a sequence.  index specifies an index
      * into that sequence.  Together they specify a <row, column> pair,
      * which is used to send a click to the State object.
      *
      * @param {State} state
      * @param {string} name_of_sequence
      * @param {number} index - starts at 1, not 0
      */
    function click(state, name_of_sequence, index) {
      if (!CLICK_COORDS.hasOwnProperty(name_of_sequence)) {
        throw new Error('invalid sequence');
      }

      var rows_and_cols = CLICK_COORDS[name_of_sequence];

      if (!Number.isFinite(index) ||
        index < 1 || index >= rows_and_cols.length)
      {
        throw new Error('invalid index');
      }

      state.click.apply(state, rows_and_cols[index]);
    }

    /**
      * @param {boolean} [wait_at_end_of_game]
      */
    function create_state(wait_at_end_of_game) {
      var state = new State(
        function (first_player, second_player) {
          return new Engine(first_player, second_player);
        }
      );
      if (arguments.length) {
        state.waitAtEndOfGame(wait_at_end_of_game);
      }
      return state;
    }
  }
);
