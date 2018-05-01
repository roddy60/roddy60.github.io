define(
  function (require) {
    var RandomColourSequence = require('RandomColourSequence');
    var Dom = require('dom/Dom');
    var Simon = require('Simon');
    var SystemClock = require('SystemClock');
    var Ui = require('Ui');
    var location = require('location');

    function Class() {
      var clock = new SystemClock;

      this._DOM = new Dom(clock);

      this._simon = new Simon(
        clock,
        new RandomColourSequence(4),
        new Ui(this._DOM),
        simon_options()
      );

      this._DOM.uncheckCheckbox();
      /*<
        Because Firefox has been observed to preserve the state of
        checkboxes across a page refresh.
      */

      this._DOM.reveal();

      console.timeEnd('loading');
    }

    Class.prototype.start = function () {
      this._DOM.setColourClickAction(
        this._simon.handleColourClick.bind(this._simon)
      );

      this._DOM.setCheckboxClickAction(
        this._simon.handleCheckboxClick.bind(this._simon)
      );

      this._DOM.setButtonClickAction(
        this._simon.handleButtonClick.bind(this._simon)
      );

      this._DOM.setAudioStopAction(
        this._simon.handleAudioStop.bind(this._simon)
      );

      this._DOM.setCssTransitionEndAction(
        this._simon.handleCssTransitionEnd.bind(this._simon)
      );
    };

    return Class;

    function simon_options() {
      var result = {};

      /*>
        This is to ease manual testing of the app.
      */
      var matches =
        location.search.match(/(^\?|&)(total_steps_final)=(\d+)/);
      if (matches) {
        result[matches[2]] = parseInt(matches[3]);
      }

      return result;
    }
  }
);
