define(
  function () {
    function Class() {}

    Class.prototype.generate = function () {};

    Class.prototype.item = function (position) {
      if (!Number.isFinite(position) || position < 0 ||
        position !== Math.floor(position))
      {
        throw new Error('invalid position');
      }

      return position % 4;
    };

    return Class;
  }
);
