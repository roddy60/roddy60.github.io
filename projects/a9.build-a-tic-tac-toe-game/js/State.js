define(
  function (require) {
    var Engine = require('Engine');
    var Square = require('Square');

    /**
      * @constructor
      * @param {function (string, string): Engine} create_engine
      */
    function Class(create_engine) {
      this._initProperties(create_engine);
    }

    Class.prototype.chooseO = function () {
      this._choose('O');
      this._engine.makeLegalMove();
      this._getBoardChange();
      this._status_message = 'YOUR MOVE';
    };

    Class.prototype.chooseX = function () {
      this._choose('X');
      this._status_message = 'YOUR MOVE';
    };

    Class.prototype.click = function (row, col) {
      this._clearBoardChanges();

      if (this._engine.canOccupy(row, col, this._user_player)) {
        this._engine.occupy(row, col, this._user_player);

        this._getBoardChange();

        if (this._engine.gameOver()) {
          this._handleGameOver();
        } else {
          this._engine.makeLegalMove();
          this._getBoardChange();
          if (this._engine.gameOver()) {
            this._handleGameOver();
          } else {
            this._status_message = 'YOUR MOVE';
          }
        }
      }
    };

    /**
      * @return {Object} - the 'board_changes' property is
      * not guaranteed to be minimal.  In other words, it may
      * reference squares that haven't actually changed.
      */
    Class.prototype.getProperties = function () {
      return (
        this._screen === 1?
        {
          screen: this._screen
        }:
        {
          screen: this._screen,
          board_changes: this._board_changes,
          status_message: this._status_message,
          wait_at_end_of_game: this._wait_at_end_of_game,
        }
      );
    };

    Class.prototype.startNewGame = function () {
      this._initProperties();

      this._board_changes = [
        new Square(0, 0, Engine.NO_PLAYER),
        new Square(0, 1, Engine.NO_PLAYER),
        new Square(0, 2, Engine.NO_PLAYER),

        new Square(1, 0, Engine.NO_PLAYER),
        new Square(1, 1, Engine.NO_PLAYER),
        new Square(1, 2, Engine.NO_PLAYER),

        new Square(2, 0, Engine.NO_PLAYER),
        new Square(2, 1, Engine.NO_PLAYER),
        new Square(2, 2, Engine.NO_PLAYER),
      ];
    };

    Class.prototype.waitAtEndOfGame = function (wait_at_end_of_game) {
      var start_new_game =
        this._wait_at_end_of_game &&
        !wait_at_end_of_game &&
        this._engine &&
        this._engine.gameOver();

      this._wait_at_end_of_game = wait_at_end_of_game;

      if (start_new_game) {
        this.startNewGame();
      }
    };

    Class.prototype._choose = function (user_player) {
      this._screen = 2;
      this._engine = this._create_engine.call(null, 'X', 'O');
      this._user_player = user_player;
    };

    Class.prototype._clearBoardChanges = function () {
      this._board_changes = [];
    };

    Class.prototype._getBoardChange = function () {
      var square = this._engine.lastSquareChanged();
      if (square === null) {
        throw new Error("Engine has no changed square");
      }
      this._board_changes.push(square);
    };

    Class.prototype._handleGameOver = function () {
      if (!this._wait_at_end_of_game) {
        this.startNewGame();
      } else {
        var winner = this._engine.winner();
        this._status_message =
          winner === Engine.NO_PLAYER?
          'DRAW':
          (winner === this._user_player?
          'YOU WON!':
          'YOU LOST!');
      }
    };

    /**
      * @param {function (string, string): Engine} [create_engine]
      */
    Class.prototype._initProperties = function (create_engine) {
      this._screen = 1;
      this._status_message = '';
      this._engine = null;
      this._user_player = null;
      this._board_changes = [];
      if (!this.hasOwnProperty('_wait_at_end_of_game')) {
        this._wait_at_end_of_game = false;
      }
      if (create_engine) {
        this._create_engine = create_engine;
      }
    }

    return Class;
  }
);
