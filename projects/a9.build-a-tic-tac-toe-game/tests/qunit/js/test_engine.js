define(
  function (require) {
    var QUnit = require('vendor/QUnit');
    var Engine = require('Engine');
    var Square = require('Square');
    var interleave = require('js-utils').interleave;

    return function () {
      QUnit.module(
        "'Engine' class",
        {
          beforeEach: function () {
            this.engine = new Engine('X', 'O');
          },
        }
      );

      [0, 1, 2].forEach(
        function (row, _, indices) {
          indices.forEach(
            function (col) {
              var coords = '<' + row + ', ' + col + '>';
              QUnit.test(
                'Occupying ' + coords,
                function (assert) {
                  //> Given

                  var engine = new Engine('X', 'O');

                  //> When

                  engine.occupy(row, col, 'X');
                  var occupied = engine.occupied(row, col);

                  var error = null;
                  try {
                    engine.occupy(row, col, 'X');
                  } catch (e) {
                    error = e;
                  }

                  //> Then

                  assert.ok(occupied);
                  assert.notStrictEqual(error, null);
                }
              );
            }
          );
        }
      );

      QUnit.test(
        "Method 'makeLegalMove'",
        function (assert) {
          //> Given

          var engine = engine_with_board(
            '.OO',
            'XXO',
            'XX.'
          );

          //> When

          var winner1 = engine.winner();
          engine.makeLegalMove();
          var winner2 = engine.winner();

          //> Then

          assert.strictEqual(Engine.NO_PLAYER, winner1);
          assert.strictEqual('O', winner2);
        }
      );

      QUnit.test(
        'Invalid row',
        function (assert) {
          assert.throws(
            function () {
              this.engine.occupy(100, 0, 'X');
            },
            Error
          );
        }
      );

      QUnit.test(
        'Invalid column',
        function (assert) {
          assert.throws(
            function () {
              this.engine.occupy(0, 100, 'X');
            },
            Error
          );
        }
      );

      QUnit.test(
        'Invalid player',
        function (assert) {
          assert.throws(
            function () {
              this.engine.occupy(0, 0, 'Not a player');
            },
            Error
          );
        }
      );

      QUnit.test(
        'Move out of turn',
        function (assert) {
          assert.throws(
            function () {
              this.engine.occupy(0, 0, 'O');
            },
            /\bplayer who doesn't have the move\b/
          );
        }
      );

      QUnit.test(
        'Attempt at occupying occupied square',
        function (assert) {
          this.engine.occupy(0, 0, 'X');
          assert.throws(
            function () {
              this.engine.occupy(0, 0, 'O');
            },
            Error
          );
        }
      );

      QUnit.test(
        'Attempt to move when game is already won',
        function (assert) {
          var engine = engine_with_board(
            'XXX',
            'OO.',
            '...'
          );
          assert.throws(
            function () {
              engine.occupy(2, 2, 'O');
            },
            Error
          );
        }
      );

      test_each_winning_line();

      test_winner2(
        {
          title: "SUT recognises a win by O",
          board: [
            'XO.',
            'XO.',
            '.OX',
          ],
          winner: 'O',
        }
      );

      test_winner2(
        {
          title: "No winner, board full",
          board: [
            'XXO',
            'OOX',
            'XXO',
          ],
          winner: Engine.NO_PLAYER,
        }
      );

      test_winner2(
        {
          title: "No winner, board not full",
          board: [
            'XX.',
            'OO.',
            '...',
          ],
          winner: Engine.NO_PLAYER,
        }
      );
    };

    /**
      * @param {string} row0
      * @param {string} row1
      * @param {string} row2
      * @return {Engine}
      */
    function engine_with_board(row0, row1, row2) {
      var board =
        [row0, row1, row2].map(function (s) { return s.split(''); });

      var engine = new Engine('X', 'O');

      var squares_for_x = [];
      var squares_for_o = [];

      for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[row].length; col++) {
          var occupant = board[row][col];
          if (occupant !== '.') {
            var square = new Square(row, col, occupant);
            (occupant === 'X'? squares_for_x: squares_for_o).push(square);
          }
        }
      }

      var len_diff = squares_for_x.length - squares_for_o.length;

      if (len_diff !== 0 && len_diff !== 1) {
        throw new Error(
          "mismatch between number of X's and number of O's"
        );
      }

      interleave(squares_for_x, squares_for_o).forEach(
        function (square) {
          engine.occupy(square.row, square.col, square.occupant);
        }
      );

      return engine;
    }

    function test_each_winning_line() {
      /*
        There are 8 possible "lines" that win: 3 rows, 3 columns, and 2
        diagonals.  This function sets up each, then verifies that the SUT
        recognises it as a win.
      */

      test_winner(
        'XXX',
        'OO.',
        '...',
        'X'
      );

      test_winner(
        'OO.',
        'XXX',
        '...',
        'X'
      );

      test_winner(
        'OO.',
        '...',
        'XXX',
        'X'
      );

      test_winner(
        'XOO',
        'X..',
        'X..',
        'X'
      );

      test_winner(
        '.XO',
        '.XO',
        '.X.',
        'X'
      );

      test_winner(
        'O.X',
        'O.X',
        '..X',
        'X'
      );

      test_winner(
        'XO.',
        'OX.',
        '..X',
        'X'
      );

      test_winner(
        '.OX',
        'OX.',
        'X..',
        'X'
      );
    }

    function test_winner(row0, row1, row2, expected_winner) {
      if (!test_winner.count) {
        test_winner.count = 0;
      }
      test_winner.count++;
      var title = "'winner' method: " + test_winner.count;

      test_winner2(
        {
          title: title,
          board: [row0, row1, row2],
          winner: expected_winner,
        }
      );
    }

    /**
      * @param {object} options
      */
    function test_winner2(test_params) {
      QUnit.test(
        test_params.title,
        function (assert) {
          //> Given

          var engine = engine_with_board(
            test_params.board[0],
            test_params.board[1],
            test_params.board[2]
          );

          //> When

          var winner = engine.winner();

          //> Then

          assert.strictEqual(winner, test_params.winner);
        }
      );
    }
  }
);
