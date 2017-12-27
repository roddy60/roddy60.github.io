/*
  Design:

    It would probably have been better to use the URLSearchParams class from
    the WHATWG URL standard.  See this snapshot:

      https://url.spec.whatwg.org/commit-snapshots/c00b0e6f7677f7fd439ab87590f2dad5c4a79020/#interface-urlsearchparams

    For old browsers that lack URLSearchParams, url.js from the "polyfill"
    library seems to be a good implementation.  See details for release
    0.1.41 (the latest release at time of writing):

      https://github.com/inexorabletash/polyfill/tree/v0.1.41#url-api
*/
define(
  function () {
    /**
      * @class
      * @classdesc This class models a query string, or part of a query
      * string, in a URL.  It is an ordered map with keys that are strings
      * and values that are strings, numbers, or null.
      *
      * The order of the keys corresponds to the order in which they were
      * added with setParameter or setParameters.  An inserted key, if
      * already in the map, uses the existing position of the key; otherwise
      * it goes to the end of the map.
      *
      * A key-value pair in which the value is null corresponds
      * to a parameter in the query string with no value and no equals
      * sign; for example, 'b' in "a=1&b&c=3".
      *
      * The reason for having this class, instead of just using
      * a plain object, is to produce URLs that are as readable
      * as possible, by controlling the order of parameters in
      * the query string.
      */
    function Class() {
      /** @member {Object<string, Object>} */
      this._parameters = {};
      this._index = 0;
    }

    /**
      * @param {string} key
      * @param {(null|number|string)} value
      * @return {this}
      */
    Class.prototype.setParameter = function (key, value) {
      if (!this._parameters.hasOwnProperty(key)) {
        this._index++;
        this._parameters[key] = {
          value: value,
          index: this._index,
        };
      } else {
        this._parameters[key].value = value;
      }
      return this;
    };

    /**
      * @param {...Object<string, (null|number|string)>} _ - a single-property object
      * @return {this}
      */
    Class.prototype.setParameters = function (_) {
      for (var i = 0; i < arguments.length; i++) {
        var obj = arguments[i];
        var keys = Object.keys(obj);
        if (keys.length) {
          var key = keys[0];
          var value = obj[key];
          this.setParameter(key, value);
        }
      }
      return this;
    };

    /** @return {string} */
    Class.prototype.toQueryStringSegment = function () {
      return this._toList().map(
        function (array) {
          return array.map(encodeURIComponent).join('=');
        }
      ).join('&');
    };

    /** @return Array<Array<(number|string)>> */
    Class.prototype._toList = function () {
      var list = to_list_of_sortable_objects(this._parameters);
      list.sort(compare_indices);
      return list.map(object_to_array);

      function compare_indices(a, b) {
        return a.index - b.index;
      }

      function to_list_of_sortable_objects(params) {
        var result = [];
        for (var k in params) {
          if (params.hasOwnProperty(k)) {
            result.push(
              {
                key: k,
                value: params[k].value,
                index: params[k].index,
              }
            );
          }
        }
        return result;
      }

      function object_to_array(obj) {
        var result = [obj.key];
        if (obj.value !== null) {
          result.push(obj.value);
        }
        return result;
      }
    };

    return Class;
  }
);
