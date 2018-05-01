define(
  function (require) {
    var ne = require('js-utils').nonempty;

    function Class() {}

    /** @return {Array<Element>} */
    Class.prototype.allAudioElements = function () {
      var e = ne(this.blockElement());
      return [].slice.call(ne(e.getElementsByTagName('audio')));
    };

    Class.prototype.blockElement = function () {
      return ne(document.querySelector('.simon'));
    };

    Class.prototype.buttonElement = function () {
      return ne(document.querySelector('.simon__button'));
    };

    Class.prototype.checkboxElement = function () {
      return ne(document.querySelector('.simon__checkbox'));
    };

    /** @return {Array<Element>} */
    Class.prototype.colourSquareAudioElements = function () {
      return (
        [].slice.call(
          ne(document.querySelectorAll('.simon__colour-square audio'))
        )
      );
    };

    /** @return {Array<Element>} */
    Class.prototype.colourSquareElements = function () {
      return (
        [].slice.call(
          ne(document.getElementsByClassName('simon__colour-square'))
        )
      );
    };

    Class.prototype.errorBeepElement = function () {
      return ne(document.querySelector('.simon__error-beep'));
    };

    Class.prototype.errorMessageElement = function () {
      return ne(document.querySelector('.simon__error-message'));
    };

    Class.prototype.numStepsElement = function () {
      return ne(document.querySelector('.simon__steps'));
    };

    Class.prototype.outOfTimeSoundElement = function () {
      return ne(document.querySelector('.simon__out-of-time-sound'));
    };

    Class.prototype.victoryMessageElement = function () {
      return ne(document.querySelector('.simon__victory-message'));
    };

    return Class;
  }
);
