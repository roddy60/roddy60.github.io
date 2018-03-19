define(
  function (require) {
    var ne = require('js-utils').nonempty;

    function Class() {}

    Class.prototype.blockElement = function () {
      return ne(document.querySelector('.tic-tac-toe'));
    };

    Class.prototype.checkboxElement = function () {
      var selector = '.tic-tac-toe__automatically-start-new-game';
      return ne(document.querySelector(selector));
    };

    Class.prototype.chooseOButtonElement = function () {
      return ne(document.querySelector('.tic-tac-toe__play-as-o'));
    };

    Class.prototype.chooseXButtonElement = function () {
      return ne(document.querySelector('.tic-tac-toe__play-as-x'));
    };

    Class.prototype.newGameButtonElement = function () {
      return ne(document.querySelector('.tic-tac-toe__new-game-button'));
    };

    /**
      * @param {number} row
      * @param {number} column
      * @return {Element}
      */
    Class.prototype.squareContents = function (row, column) {
      var selector =
        'div.tic-tac-toe__board-row:nth-of-type(' + (row + 1) + ') > ' +
        '.tic-tac-toe__square:nth-child(' + (column + 1) + ') ' +
        'span';
      return ne(document.querySelector(selector));
    };

    /**
      * @return Array<Object>
      * @throws {Error}
      */
    Class.prototype.squareObjects = function () {
      var row_selector = '.tic-tac-toe__board-row';
      var column_selector = '.tic-tac-toe__inner-square';
      /*<
        If we used "tic-tac-toe__square" instead of
        "tic-tac-toe__inner-square", the click event would fire when the
        border of a square is clicked, which is not something we want.
      */

      var result = [];

      var row_list = ne(document.querySelectorAll(row_selector));
      for (var row = 0; row < row_list.length; row++) {
        var column_list =
          ne(row_list[row].querySelectorAll(column_selector));
        for (var col = 0; col < column_list.length; col++) {
          result.push(
            {
              row: row,
              col: col,
              element: column_list[col],
            }
          );
        }
      }

      return result;
    };

    Class.prototype.statusMessageElement = function () {
      var selector = '.tic-tac-toe__status-message';
      return ne(document.querySelector(selector));
    };

    return Class;
  }
);
