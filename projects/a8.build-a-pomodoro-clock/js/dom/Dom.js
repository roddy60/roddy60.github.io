define(
  function (require) {
    var $ = require('jquery-private');
    var Finder = require('dom/Finder');
    var Triangle = require('dom/Triangle');

    var finder = new Finder;

    function Class() {
      this._triangle = new Triangle(
        finder.triangleTimeElapsedIndicatorElement()
      );

      this._length_change_action = $.noop;
      this._reset_action = $.noop;
      this._toggle_action = $.noop;

      this._attachHandlers();
    }

    Class.prototype.reveal = function () {
      finder.blockElement().removeClass('pomodoro--loading');
    };

    Class.prototype.setLengthChangeAction = function (action) {
      this._length_change_action = action;
    };

    Class.prototype.setResetAction = function (action) {
      this._reset_action = action;
    };

    Class.prototype.setToggleAction = function (action) {
      this._toggle_action = action;
    };

    /**
      * @param {Object} properties
      */
    Class.prototype.updateDisplay = function (properties) {
      finder.pomodoroLengthElement().text(properties.pomodoro_length);

      finder.breakLengthElement().text(properties.break_length);

      finder.lengthAfterResetElement().text(properties.length_after_reset);

      finder.triangleContainerElement().removeClass(
        'pomodoro__triangle-container--initial \
        pomodoro__triangle-container--pomodoro \
        pomodoro__triangle-container--break'
      ).
      addClass(
        'pomodoro__triangle-container--' + properties.mode
      );

      finder.modeElement().text(properties.display_mode);

      finder.timeElapsedElement().text(properties.time_elapsed);

      finder.timeRemainingElement().text(properties.time_remaining);

      this._setTriangleBottomArea(properties.time_fraction_elapsed);

      finder.resetButtonElement().prop(
        'disabled',
        properties.resettable? false: 'disabled'
      );
    };

    Class.prototype._attachHandlers = function () {
      finder.pomodoroLengthButtonElements().on(
        'click',
        $.proxy(
          function (event) {
            this._length_change_action.call(
              null,
              'pomodoro_length',
              extract_length($(event.target))
            );
          },
          this
        )
      );

      finder.breakLengthButtonElements().on(
        'click',
        $.proxy(
          function (event) {
            this._length_change_action.call(
              null,
              'break_length',
              extract_length($(event.target))
            );
          },
          this
        )
      );

      finder.lengthAfterResetButtonElements().on(
        'click',
        $.proxy(
          function (event) {
            this._length_change_action.call(
              null,
              'length_after_reset',
              extract_length($(event.target))
            );
          },
          this
        )
      );

      finder.toggleButtonElement().on(
        'click',
        (function () { this._toggle_action.call(); }).bind(this)
      );

      finder.resetButtonElement().on(
        'click',
        (function () { this._reset_action.call(); }).bind(this)
      );
    };

    Class.prototype._setTriangleBottomArea = function (fraction) {
      this._triangle.setBottomArea(fraction);
    };

    return Class;

    /**
      * @param {jQuery} jq
      * @return {number}
      */
    function extract_length(jq) {
      return parseInt(jq.text(), 10);
    }
  }
);
