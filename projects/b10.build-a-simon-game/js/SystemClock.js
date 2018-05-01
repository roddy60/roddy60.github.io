define(
  function () {
    function Class() {}

    Class.prototype.clearTimeout = clearTimeout.bind(null);

    Class.prototype.setTimeout = setTimeout.bind(null);

    return Class;
  }
);
