define(
  function () {
    /** @param {number} time - units are milliseconds */
    function Class(time) {
      if (arguments.length && !valid_time(time)) {
        throw new Error(
          "argument to constructor is not a valid time"
        );
      }

      /** @member {(null|number)} */
      this._time = arguments.length? time: 0;
    }

    /** @param {number} time_increment - units are milliseconds */
    Class.prototype.addTime = function (time_increment) {
      if (!Number.isFinite(time_increment)) {
        throw new Error(
          "argument to 'addTime' method is not a finite number"
        );
      }

      var new_time = this._time + time_increment;

      if (!valid_time(new_time)) {
        throw new Error(
          "argument to 'addTime' method would produce an invalid time"
        );
      }

      this._time = new_time;
    };

    Class.prototype.getTime = function () {
      return this._time;
    };

    /** @param {number} time - units are milliseconds */
    Class.prototype.setTime = function (new_time) {
      if (!valid_time(new_time)) {
        throw new Error(
          "argument to 'setTime' method is not a valid time"
        );
      }

      this._time = new_time;
    };

    return Class;

    function valid_time(time) {
      if (!Number.isFinite(time)) {
        return false;
      }

      var tmp = (new Date(time)).valueOf();
      return tmp === tmp;
      /*<
        True iff tmp is not NaN.

        For the circumstances in which tmp will be NaN, see ECMA-262
        Standard, 5.1 edition, sections
        {@link https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.3.2 15.9.3.2}
        and
        {@link https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.14 15.9.1.14}.
      */
    }
  }
);
