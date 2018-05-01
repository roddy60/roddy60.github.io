define(
  function (require) {
    var RealUi = require('Ui');

    function Class() {
      this._calls = [];
    }

    /**
      * @return Array<Array<*>> - details of calls that have been made to
      * methods of this object since object creation or the last call to
      * takeBatch, whichever is more recent.  Calls to takeBatch are not in
      * the array.
      */
    Class.prototype.takeBatch = function () {
      var result = this._calls;
      this._calls = [];
      return result;
    };

    Object.getOwnPropertyNames(RealUi.prototype).forEach(
      function (method_name) {
        Class.prototype[method_name] = function () {
          this._calls.push(
            [method_name].concat([].slice.call(arguments))
          );
        };
      }
    );

    return Class;
  }
);
