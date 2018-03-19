define(
  function (require) {
    var finder = (function (C) { return new C; })(require('dom/Finder'));

    function Class() {
      this._choose_x_button_action = noop;
      this._choose_o_button_action = noop;
      this._click_on_square_action = noop;
      this._click_on_checkbox_action = noop;
      this._new_game_button_action = noop;

      this._attachHandlers();

      function noop() {}
    }

    /**
      * @param {Function} action
      * return {void}
      */
    Class.prototype.setChooseOButtonAction = function (action) {
      this._choose_o_button_action = action;
    };

    /**
      * @param {Function} action
      * return {void}
      */
    Class.prototype.setChooseXButtonAction = function (action) {
      this._choose_x_button_action = action;
    };

    /**
      * @param {Function} action
      * return {void}
      */
    Class.prototype.setClickOnCheckboxAction = function (action) {
      this._click_on_checkbox_action = action;
    };

    /**
      * @param {Function} action
      * return {void}
      */
    Class.prototype.setClickOnSquareAction = function (action) {
      this._click_on_square_action = action;
    };

    Class.prototype.setLengthChangeAction = function (action) {
      this._length_change_action = action;
    };

    /**
      * @param {Function} action
      * return {void}
      */
    Class.prototype.setNewGameButtonAction = function (action) {
      this._new_game_button_action = action;
    };

    Class.prototype.showScreen = function (screen) {
      var e = finder.blockElement();

      ['loading', 'choose-player', 'play'].forEach(
        function (klass) {
          e.classList.remove('tic-tac-toe--' + klass);
        }
      );

      e.classList.add('tic-tac-toe--' + screen);
    };

    /**
      * @param {Object} properties
      */
    Class.prototype.updatePage = function (properties) {
      this.showScreen(
        properties.screen === 1? 'choose-player': 'play'
      );

      if (properties.screen === 2) {
        properties.board_changes.forEach(this._populateSquare.bind(this));
        finder.statusMessageElement().textContent =
          properties.status_message;
        finder.checkboxElement().checked = !properties.wait_at_end_of_game;
      }
    }

    Class.prototype._attachHandlers = function () {
      var that = this;

      finder.chooseXButtonElement().addEventListener(
        'click',
        function () {
          that._choose_x_button_action.call();
        }
      );

      finder.chooseOButtonElement().addEventListener(
        'click',
        function () {
          that._choose_o_button_action.call();
        }
      );

      finder.squareObjects().forEach(
        function (square) {
          var row = square.row;
          var col = square.col;
          var element = square.element;

          element.addEventListener(
            'click',
            function () {
              that._click_on_square_action.call(null, row, col);
            }
          );
        }
      );

      finder.checkboxElement().addEventListener(
        'change',
        function (event) {
          that._click_on_checkbox_action.call(null, event.target.checked);
        }
      );

      finder.newGameButtonElement().addEventListener(
        'click',
        function () {
          that._new_game_button_action.call();
        }
      );
    };

    /**
      * @param {Square} square
      */
    Class.prototype._populateSquare = function (square) {
      var e = finder.squareContents(square.row, square.col);
      e.classList.remove('fa');
      e.classList.remove('fa-times');
      e.classList.remove('fa-circle-o');
      switch (square.occupant) {
        case 'O':
          e.classList.add('fa');
          e.classList.add('fa-circle-o');
        break;

        case 'X':
          e.classList.add('fa');
          e.classList.add('fa-times');
        break;
      }
    };

    return Class;
  }
);
