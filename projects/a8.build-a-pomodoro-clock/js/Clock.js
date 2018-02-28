define(
  function () {
    /**
      * @param {Object} [clock] - defaults to a clock that returns the
      * system time.
      * @param {function(): number} clock.getTime
      */
    function Class(clock) {
      this._clock =
        arguments.length?
        clock:
        {
          getTime: function () {
            return (new Date).getTime();
          },
        };

      this._rate = 1;
      var now = this._clock.getTime();
      this._true_time_at_last_rate_setting = now;
      this._time_at_last_rate_setting = now;
    }

    Class.prototype.getTime = function () {
      return this._getTimes().cooked;
    };

    /**
      * @param {number} rate
      * @return {this}
      */
    Class.prototype.setRate = function (new_rate) {
      if (!Number.isFinite(new_rate) || new_rate <= 0) {
        throw new Error('invalid rate: ' + new_rate);
      }

      var times = this._getTimes();

      this._true_time_at_last_rate_setting = times.true;
      this._time_at_last_rate_setting = times.cooked;

      this._rate = new_rate;

      return this;
    };

    Class.prototype._getTimes = function () {
      var true_time = this._clock.getTime();
      var true_diff = true_time - this._true_time_at_last_rate_setting;

      var cooked_diff = true_diff * this._rate;
      var cooked_time = this._time_at_last_rate_setting + cooked_diff;

      return {
        true: true_time,
        cooked: cooked_time,
      };
    };

    return Class;
  }
);
