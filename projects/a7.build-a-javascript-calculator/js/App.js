define(
  function (require) {
    var $ = require('jquery-private');
    var Calculator = require('Calculator');
    var Dom = require('dom/Dom');
    var dev = require('dev');

    function Class() {
      this._DOM = new Dom;
      this._calculator = new Calculator;
    }

    Class.prototype.start = function () {
      this._DOM.setButtonPressHandler($.proxy(this, '_handleButtonPress'));

      this._DOM.giveFeedbackOnPress(true);
      /*<
        Button presses are sometimes ignored (e.g. "+" after "+"), so it's
        important to give the user feedback on every button press, to assure
        him that that the press didn't "get lost".

        Design:

          We could remove the above call and remove the method from Dom.
          However, that would leave the App class without any say in whether
          feedback is given, which seems wrong.
      */

      this._DOM.reveal();

      if (browser_is_IE11()) {
        this._DOM.indicateIe11(true);
      }

      dev.console.timeEnd('loading');
    };

    Class.prototype._handleButtonPress = function (text) {
      this._calculator.press(text);
      this._DOM.setLine1(this._calculator.line1());
      this._DOM.setLine2(this._calculator.line2());
    };

    return Class;

    function browser_is_IE11() {
      var bowser = require('bowser');

      if (0) {
        console.log(
          bowser.name,
          typeof bowser.version,
          bowser.version,
          JSON.stringify(bowser.version),
          typeof bowser.msie
        );
      }

      return (
        bowser.msie &&
        bowser.version &&
        Math.ceil(bowser.version) === 11
      );
    }
  }
);
