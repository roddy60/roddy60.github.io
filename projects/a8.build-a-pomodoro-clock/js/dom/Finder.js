define(
  function (require) {
    var $ = require('jquery-private');

    function Class() {}

    Class.prototype.blockElement = function () {
      return ne($('.pomodoro'));
    };

    Class.prototype.breakLengthButtonElements = function () {
      return ne(
        $(
          '.pomodoro__length-change-buttons--break-length \
          button'
        )
      );
    };

    Class.prototype.breakLengthElement = function () {
      return ne($('.pomodoro__break-length'));
    };

    Class.prototype.lengthAfterResetButtonElements = function () {
      return ne(
        $(
          '.pomodoro__length-change-buttons--length-after-reset \
          button'
        )
      );
    };

    Class.prototype.lengthAfterResetElement = function () {
      return ne($('.pomodoro__length-after-reset'));
    };

    Class.prototype.modeElement = function () {
      return ne($('.pomodoro__mode'));
    };

    Class.prototype.pomodoroLengthButtonElements = function () {
      return ne(
        $(
          '.pomodoro__length-change-buttons--pomodoro-length \
          button'
        )
      );
    };

    Class.prototype.pomodoroLengthElement = function () {
      return ne($('.pomodoro__pomodoro-length'));
    };

    Class.prototype.resetButtonElement = function () {
      return ne($('.pomodoro__reset-button'));
    };

    Class.prototype.timeElapsedElement = function () {
      return ne($('.pomodoro__time-elapsed'));
    };

    Class.prototype.timeRemainingElement = function () {
      return ne($('.pomodoro__time-remaining'));
    };

    Class.prototype.toggleButtonElement = function () {
      return ne($('.pomodoro__toggle-button'));
    };

    Class.prototype.triangleContainerElement = function () {
      return ne($('.pomodoro__triangle-container'));
    };

    Class.prototype.triangleTimeElapsedIndicatorElement = function () {
      return ne($('.pomodoro__triangle-time-elapsed-indicator'));
    };

    return Class;

    /**
      * "ne" is short for "non-empty".
      * @param {jQuery} jq
      * @return {jQuery} - same as the 'jq' parameter
      * @throws {Error}
      */
    function ne(jq) {
      if (!jq.length) {
        var msg = 'Failed to find expected element or elements';
        dev.console.error(msg);
        dev.console.trace();
        throw new Error(msg);
      }

      return jq;
    }
  }
);
