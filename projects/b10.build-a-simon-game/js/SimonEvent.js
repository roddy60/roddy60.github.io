define(
  function () {
    /**
      * @param {string} type
      * @param {Object<string, *>} [options]
      */
    function Class(type, options) {
      this.type = type;

      if (options !== undefined) {
        for (var i in options) {
          this[i] = options[i];
        }
      }
    }

    return Class;
  }
);
