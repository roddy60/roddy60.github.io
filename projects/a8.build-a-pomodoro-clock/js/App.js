define(
  function (require) {
    var $ = require('jquery-private');
    var Clock = require('Clock');
    var Dom = require('dom/Dom');
    var State = require('State');
    var dev = require('dev');
    var global = require('global');

    var DEFAULT_POMODORO_LENGTH = 25;
    var DEFAULT_BREAK_LENGTH = 3;
    var DEFAULT_LENGTH_AFTER_RESET = 25;
    var UPDATE_INTERVAL = 0.2e3   // milliseconds

    function Class() {
      var clock = new Clock;

      this._state = new State(
        clock,
        DEFAULT_POMODORO_LENGTH,
        DEFAULT_BREAK_LENGTH,
        DEFAULT_LENGTH_AFTER_RESET
      );

      this._scheduling_id = null;

      this._DOM = new Dom;

      if (1) {
        global.pomodoro = {
          clock: clock,
        };
      }
    }

    Class.prototype.start = function () {
      this._DOM.setLengthChangeAction($.proxy(this, '_handleLengthChange'));
      this._DOM.setToggleAction($.proxy(this, '_handleToggle'));
      this._DOM.setResetAction($.proxy(this, '_handleReset'));
      this._updateDisplay();
      this._DOM.reveal();
      dev.console.timeEnd('loading');
    };

    Class.prototype._afterChange = function () {
      this._updateDisplay();
      this._manageTask();
    };

    Class.prototype._handleLengthChange = function (subject, length) {
      var method =
        subject === 'pomodoro_length'?
        'addToPomodoroLength':
        (subject === 'break_length'?
        'addToBreakLength':
        (subject === 'length_after_reset'?
        'addToLengthAfterReset':
        null));
      this._state[method].call(this._state, length);
      this._afterChange();
    };

    Class.prototype._handleReset = function () {
      this._state.reset();
      this._afterChange();
    };

    Class.prototype._handleToggle = function () {
      this._state.toggle();
      this._afterChange();
    };

    Class.prototype._manageTask = function () {
      if (this._state.isRunning()) {
        if (!this._scheduling_id) {
          this._scheduling_id = setInterval(
            $.proxy(this, '_updateDisplay'),
            UPDATE_INTERVAL
          );
        }
      } else {
        if (this._scheduling_id) {
          clearTimeout(this._scheduling_id);
          this._scheduling_id = null;
        }
      }
    };

    Class.prototype._updateDisplay = function () {
      this._DOM.updateDisplay(this._state.getProperties());
    };

    return Class;
  }
);
