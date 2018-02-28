define(
  function (require) {
    var dev = require('dev');
    var format_time = require('utils').format_time;
    var sprintf = require('vendor/sprintf-js').sprintf;

    if (!Number.isFinite) {
      throw new Error('class requires Number.isFinite');
    }
    //< IE11 needs a polyfill for Number.isFinite

    /**
      * @param {Object} clock
      * @param {function(): number} clock.getTime - We assume that every
      * call returns a value that is greater than or equal to the previous
      * value.  If that assumption is wrong, the behaviour of this class is
      * undefined.
      */
    function Class
      (clock, pomodoro_length, break_length, length_after_reset)
    {
      this._clock = clock;

      this._pomodoro_length = minutes_to_millis(pomodoro_length);
      this._break_length = minutes_to_millis(break_length);
      this._length_after_reset = minutes_to_millis(length_after_reset);

      this._mode = 'initial';
      //< One of "initial", "pomodoro", or "break"

      this._running = false;
      /** @member {(null|number)} */
      this._time_elapsed = null;
      /** @member {(null|number)} */
      this._time_remaining = null;

      this._time = clock.getTime();
    }

    /** @param {number} minutes */
    Class.prototype.addToBreakLength = function (minutes) {
      this._addToLength('_break_length', minutes);
    };

    /** @param {number} minutes */
    Class.prototype.addToLengthAfterReset = function (minutes) {
      this._addToLength('_length_after_reset', minutes);
    };

    /** @param {number} minutes */
    Class.prototype.addToPomodoroLength = function (minutes) {
      this._addToLength('_pomodoro_length', minutes);
    };

    /** @return {Object} */
    Class.prototype.getProperties = function () {
      this._update();
      return this._getProperties2();
    };

    Class.prototype.isRunning = function () {
      return this._running;
    };

    /** @return {void} */
    Class.prototype.reset = function () {
      if (this._mode === 'initial') {
        throw new Error("invalid mode when 'reset' method called: initial");
      }

      this._update();
      this._time_elapsed = 0;
      this._time_remaining = this._length_after_reset;
      this._time = this._clock.getTime();
    };

    /** @return {void} */
    Class.prototype.toggle = function () {
      if (this._mode === 'initial') {
        this._mode = 'pomodoro';
        this._running = true;
        this._time_elapsed = 0;
        this._time_remaining = this._pomodoro_length;
        this._time = this._clock.getTime();
      } else {
        this._update();
        this._running = !this._running;
      }
    };

    Class.prototype._addToLength = function (length_name, minutes) {
      if (!Number.isFinite(minutes)) {
        throw new Error('not a finite number: ' + minutes);
      }

      this._update();

      this[length_name] = Math.max(
        minutes_to_millis(1),
        this[length_name] + minutes_to_millis(minutes)
      );
    };

    /**
      * Given that the current time is new_time, set the state of
      * this object appropriately.
      */
    Class.prototype._advance = function (new_time) {
      if (!this._running) {
        this._time = new_time;
      } else {
        var diff1 = new_time - this._time;

        if (diff1 < this._time_remaining) {
          this._time_remaining -= diff1;
          this._time_elapsed += diff1;
          this._time = new_time;
        } else {
          this._endCurrentPeriod();

          var cycle_len =
            this._pomodoro_length + this._break_length;
          var diff2_mod = (new_time - this._time) % cycle_len;
          if (diff2_mod < this._time_remaining) {
            this._time_elapsed = diff2_mod;
            this._time_remaining -= diff2_mod;
            this._time = new_time;
          } else {
            var new_mode = this._mode === 'pomodoro'? 'break': 'pomodoro';
            var new_time_elapsed = diff2_mod - this._time_remaining;
            var new_time_remaining = cycle_len - diff2_mod;

            this._mode = new_mode;
            this._time_elapsed = new_time_elapsed;
            this._time_remaining = new_time_remaining;
            this._time = new_time;
          }
        }
      }

      dev.console.assert(this._time === new_time);
    };

    /**
      * @return {void}
      */
    Class.prototype._endCurrentPeriod = function () {
      this._time += this._time_remaining;

      this._time_elapsed = 0;

      switch (this._mode) {
        case 'pomodoro':
          this._mode = 'break';
          this._time_remaining = this._break_length;
        break;

        case 'break':
          this._mode = 'pomodoro';
          this._time_remaining = this._pomodoro_length;
        break;

        default:
          throw new Error('unexpected mode: ' + this._mode);
      }
    };

    Class.prototype._getProperties2 = function () {
      var PLACEHOLDER = '—';

      return {
        pomodoro_length: millis_to_minutes(this._pomodoro_length),
        break_length: millis_to_minutes(this._break_length),
        display_mode:
          this._mode === 'initial'?
          PLACEHOLDER:
          this._mode.toUpperCase(),
        length_after_reset:
          millis_to_minutes(this._length_after_reset),
        mode: this._mode,
        resettable: this._mode !== 'initial',
        running: this._running,
        time_elapsed:
          this._mode === 'initial'?
          PLACEHOLDER:
          format_time(this._time_elapsed),
        time_remaining:
          this._mode === 'initial'?
          PLACEHOLDER:
          format_time(this._time_remaining),
        time_fraction_elapsed:
          this._mode === 'initial'?
          0:
          this._time_elapsed / (this._time_elapsed + this._time_remaining),
      };
    };

    Class.prototype._update = function () {
      this._advance(this._clock.getTime());
    };

    return Class;

    function millis_to_minutes(milliseconds) {
      return milliseconds / 60e3;
    }

    function minutes_to_millis(minutes) {
      return minutes * 60e3;
    }
  }
);
