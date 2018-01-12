define(
  [],
  function () {
    return {
      /** @return Array<string> - may contain duplicates */
      jquery_ajax_error_messages: function () {
        /*
          The jQuery docs are unclear about the meaning of the 2nd and 3rd
          arguments to the error callback.

          The source code is no help.  The key code seems to be:

            https://github.com/jquery/jquery/blob/3.2.1/src/ajax.js#L747-L797

          (If reading that, you can skip the first 'isSuccess' branch.)

          The best thing seems to be to produce an array of error messages
          and let downstream code use those messages as it will.
        */

        var result = [];

        for (var i = 1; i < arguments.length && i < 3; i++) {
          if (arguments[i] != null) {
            var s = arguments[i].toString();
            if (s != '' && !s.match(/^\[object .+\]$/)) {
              result.push(s);
            }
          }
        }

        return result;
      },

      /**
        * @param {Object} object
        * @return Array<string>
        */
      object_values: function (object) {
        var result = [];
        for (var i in object) {
          if (object.hasOwnProperty(i)) {
            result.push(object[i]);
          }
        }
        return result;
      },
    };
  }
);
