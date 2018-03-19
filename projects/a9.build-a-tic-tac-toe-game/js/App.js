define(
  function (require) {
    var Dom = require('dom/Dom');
    var Engine = require('Engine');
    var State = require('State');
    var dev = require('dev');

    function Class() {
      this._state = new State(
        function (first_player, second_player) {
          return new Engine(first_player, second_player);
        }
      );

      this._DOM = new Dom;
    }

    Class.prototype.start = function () {
      this._DOM.setChooseXButtonAction(
        this._handleClickOnChooseXButton.bind(this)
      );
      this._DOM.setChooseOButtonAction(
        this._handleClickOnChooseOButton.bind(this)
      );
      this._DOM.setClickOnSquareAction(
        this._handleClickOnSquare.bind(this)
      );
      this._DOM.setClickOnCheckboxAction(
        this._handleClickOnCheckbox.bind(this)
      );
      this._DOM.setNewGameButtonAction(
        this._handleClickOnNewGameButton.bind(this)
      );

      this._updatePage();

      this._DOM.showScreen('choose-player');

      dev.console.timeEnd('loading');
    };

    Class.prototype._handleClickOnCheckbox = function (checked) {
      this._state.waitAtEndOfGame(!checked);
      this._updatePage();
    };

    Class.prototype._handleClickOnChooseOButton = function () {
      this._state.chooseO();
      this._updatePage();
    };

    Class.prototype._handleClickOnChooseXButton = function () {
      this._state.chooseX();
      this._updatePage();
    };

    Class.prototype._handleClickOnNewGameButton = function () {
      this._state.startNewGame();
      this._updatePage();
    };

    Class.prototype._handleClickOnSquare = function (row, col) {
      this._state.click(row, col);
      this._updatePage();
    };

    Class.prototype._updatePage = function () {
      if (0) {
        try {
          dev.dumpBoard(this._state._engine._board);
        } catch(_) {}
      }
      this._DOM.updatePage(this._state.getProperties());
    };

    return Class;
  }
);
