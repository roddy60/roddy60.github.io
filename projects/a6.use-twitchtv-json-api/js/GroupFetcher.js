define(
  function (require) {
    var $ = require('jquery-private');
    var ld = require('vendor/lodash');

    /**
      * @class
      * @param Object<string, string> URLs
      */
    function Class(URLs) {
      this._URLs = $.extend(true, {}, URLs);
    }

    /**
      * @return {Promise<Object>} - keys are same as keys of object passed to constructor
      */
    Class.prototype.fetch = function () {
      if (ld.isEmpty(this._URLs)) {
        return $.Deferred().resolve({});
      } else {
        var key_list = Object.keys(this._URLs);
        var URL_list = ld.values(this._URLs);
        var eventual_result = {};

        return ajax_promise(0);

        function ajax_promise(current_position) {
          return (
            $.ajax(URL_list[current_position]).
            then(
              handle_success.bind(null, current_position),
              function () {
                throw {
                  label: key_list[current_position],
                  URL: URL_list[current_position],
                };
              }
            ).
            promise()
          );
        }

        /**
          * @param {number} current_position
          * @return {(Object|Promise<Object>)}
          */
        function handle_success(current_position, data) {
          var key = key_list[current_position];
          eventual_result[key] = data;
          var next_position = current_position + 1;
          if (next_position >= key_list.length) {
            return eventual_result;
          } else {
            return ajax_promise(next_position);
          }
        }
      };
    };

    return Class;
  }
);
