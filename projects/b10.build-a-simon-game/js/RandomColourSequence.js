define(
  function () {
    /**
      * @constructor
      * @throws {Error}
      */
    function Class(num_colours) {
      if (!Number.isFinite(num_colours) || num_colours < 1 ||
        num_colours !== Math.floor(num_colours))
      {
        throw new Error('invalid value for number of colours');
      }

      this._num_colours = num_colours;
      this._cached = [];
    };

    Class.prototype.generate = function () {
      this._cached = [];
    };

    /**
      * @return {number}
      * @throws {Error}
      */
    Class.prototype.item = function (position) {
      if (!Number.isFinite(position) || position < 0 ||
        position !== Math.floor(position))
      {
        throw new Error('invalid position');
      }

      if (position >= this._cached.length) {
        for (var i = this._cached.length; i <= position; i++) {
          this._cached[i] =
            Math.floor(Math.random() * this._num_colours);
        }
      }

      return this._cached[position];
    };

    return Class;
  }
);
