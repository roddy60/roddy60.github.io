/*
  The specification doesn't require perfect play, or even good play, so this
  class makes no attempt at either.
*/
define(
  function (require) {
    var Square = require('Square');

    Class.NO_PLAYER = '';

    /**
      * @constructor
      * @param {string} first_player
      * @param {string} second_player
      * @throws {Error}
      */
    function Class(first_player, second_player) {
      if (!valid_player(first_player) || !valid_player(second_player) ||
        first_player === second_player)
      {
        throw new Error('invalid parameters to constructor');
      }

      this._first_player = first_player;
      this._second_player = second_player;
      this._board = [
        [Class.NO_PLAYER, Class.NO_PLAYER, Class.NO_PLAYER],
        [Class.NO_PLAYER, Class.NO_PLAYER, Class.NO_PLAYER],
        [Class.NO_PLAYER, Class.NO_PLAYER, Class.NO_PLAYER],
      ];
      this._num_moves = 0;
      this._last_square_changed = null;

      function valid_player(player) {
        return typeof player === 'string' && player !== Class.NO_PLAYER;
      }
    }

    /**
      * @return Array<Array<string>>
      */
    Class.prototype.board = function () {
      return this._board.map(
        function (a) { return a.slice(); }
      );
    };

    /**
      * @param {string} player
      * @return {boolean}
      */
    Class.prototype.canOccupy = function (row, col, player) {
      var problem = this._occupationProblem(row, col, player);
      return problem === '';
    };

    /**
      * @return {boolean}
      */
    Class.prototype.gameOver = function () {
      return this._boardFull() || this.winner() !== Class.NO_PLAYER;
    };

    /** @return {Square|null} */
    Class.prototype.lastSquareChanged = function () {
      return this._last_square_changed;
    };

    /**
      * @return {void}
      * @throws {Error}
      */
    Class.prototype.makeLegalMove = function () {
      if (this._boardFull()) {
        throw new Error('no move possible, board is full');
      }

      if (this.winner() !== Class.NO_PLAYER) {
        throw new Error('no move possible, game is won');
      }

      loop_over_board:
      for (var row = 0; row < this._board.length; row++) {
        for (var col = 0; col < this._board[row].length; col++) {
          if (!this.occupied(row, col)) {
            this.occupy(row, col, this._playerToMove());
            break loop_over_board;
          }
        }
      }
    };

    /**
      * @param {number} row
      * @param {number} col
      * @return {boolean}
      */
    Class.prototype.occupied = function (row, col) {
      if (!this._validRow(row)) {
        throw new Error('invalid row');
      }

      if (!this._validCol(col)) {
        throw new Error('invalid column');
      }

      return this._board[row][col] !== Class.NO_PLAYER;
    };

    /**
      * @param {string} player
      * @param {number} row
      * @param {number} col
      * @return {void}
      * @throws {Error}
      */
    Class.prototype.occupy = function (row, col, player) {
      var problem = this._occupationProblem(row, col, player);
      if (problem !== '') {
        throw new Error(problem);
      }

      this._occupyNoCheck(row, col, player);
    };

    /**
      * @return string - the class constant NO_PLAYER if there is no winner
      */
    Class.prototype.winner = function () {
      var lines_of_squares = generate_lines_of_squares(this._board);
      var lines_of_players = [
        this._first_player.repeat(3),
        this._second_player.repeat(3),
      ];

      for (var i = 0; i < lines_of_squares.length; i++) {
        for (var j = 0; j < lines_of_players.length; j++) {
          if (lines_of_squares[i] === lines_of_players[j]) {
            return lines_of_players[j][0];
          }
        }
      }

      return Class.NO_PLAYER;

      function generate_lines_of_squares(board) {
        //> Get rows

        var lines_as_array = board.concat();

        //> Get columns

        for (var col = 0; col < board[0].length; col++) {
          var a = [];
          for (var row = 0; row < board.length; row++) {
            a.push(board[row][col]);
          }
          lines_as_array.push(a);
        }

        //> Get diagonals

        lines_as_array.push(
          [board[0][0], board[1][1], board[2][2]],
          [board[0][2], board[1][1], board[2][0]]
        );

        return lines_as_array.map(function (a) { return a.join(''); });
      }
    };

    /*
      Is it possible for the board to become full?  Yes.
      <https://en.wikipedia.org/w/index.php?title=Tic-tac-toe&oldid=828528218>
      says:

        If played properly, the game will end in a draw
    */
    Class.prototype._boardFull = function () {
      var num_squares = this._board.length * this._board[0].length;
      return this._num_moves === num_squares;
    };

    Class.prototype._occupationProblem = function (row, col, player) {
      if (!this._validRow(row)) {
        return 'invalid row';
      }

      if (!this._validCol(col)) {
        return 'invalid column';
      }

      if (!this._validPlayer(player)) {
        return 'invalid player';
      }

      if (player !== this._playerToMove()) {
        return (
          'attempt to occupy square by player who ' +
          "doesn't have the move: " + player
        );
      }

      if (this.occupied(row, col)) {
        var coords = '<' + row + ', ' + col + '>';
        return 'square ' + coords + ' already occupied';
      }

      if (this.winner() !== Class.NO_PLAYER) {
        return 'attempt to occupy square when game is already won';
      }

      return '';
    }

    Class.prototype._occupyNoCheck = function (row, col, player) {
      this._board[row][col] = player;

      this._last_square_changed = new Square(row, col, player);

      this._num_moves++;
    };

    Class.prototype._playerToMove = function () {
      return (
        this._num_moves % 2 == 0?
        this._first_player:
        this._second_player
      );
    };

    Class.prototype._validCol = function (col) {
      return (
        Number.isFinite(col) &&
        col === Math.floor(col) &&
        col >= 0 &&
        col < this._board[0].length
      );
    };

    Class.prototype._validPlayer = function (player) {
      return (
        player === this._first_player ||
        player === this._second_player
      );
    };

    Class.prototype._validRow = function (row) {
      return (
        Number.isFinite(row) &&
        row === Math.floor(row) &&
        row >= 0 &&
        row < this._board.length
      );
    };

    return Class;
  }
);
