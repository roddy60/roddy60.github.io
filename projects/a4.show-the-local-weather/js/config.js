/*
  This module sets the application's configuration.

  Currently, the only reason for having a configuration is to make testing
  easier.

  Every configuration setting has a default, specified in this module, but
  this default can be overridden using the query string of the URL.

  For example, to override the value for the 'showWeather' and
  'useHardCodedPosition' methods:

    * Determine the short names that corresponds to these two methods.

    The short name for 'useHardCodedPosition' is 'hcp' and the short name
    for 'showWeather' is 'sw'.

    * If the URL lacks a query string, add one.

    * Add a 'cfg' parameter to the query string.

    * Set the value of this parameter to "hcp=1,sw=0" (which
    overrides the default values of these two settings).

  In this example, we might end up with the following query string:

    ?cfg=hcp=1,sw=0

  The purpose of the 'show_weather' setting is to ensure that we get a good
  look at the message that is shown when the app is in the 'fetching' state.
*/
define(
  [],
  function () {
    /*>
      Each configuration setting has an entry in this array.  Each entry is
      composed of the following members:

        * the long name for the setting;
        * the short name;
        * the default value.
    */
    var spec = [
      ['show_weather', 'sw', true],
      ['use_hard_coded_position', 'hcp', false],
      ['use_problem_weather_URL', 'pwu', false],
    ];

    var config = spec_to_config(spec);

    update_config(config, location.search);

    if (0) {
      console.dir(config);
    }

    return {
      showWeather: function () {
        return config.show_weather;
      },

      useHardCodedPosition: function () {
        return config.use_hard_coded_position;
      },

      useProblemWeatherUrl: function () {
        return config.use_problem_weather_URL;
      },
    };

    function generate_short_to_long(spec) {
      var result = {};
      spec.forEach(
        function (triple) {
          var long_name = triple[0];
          var short_name = triple[1];
          result[short_name] = long_name;
        }
      );
      return result;
    }

    function settings_regex(spec) {
      var short_names = spec.map(function (a) { return a[1]; });
      var regex_string = '^(' + short_names.join('|') + ')=([01])$';
      return new RegExp(regex_string);
    }

    /**
      * @param {Array<Array>} spec
      * @return {Object}
      */
    function spec_to_config(spec) {
      var result = {};
      spec.forEach(
        function (triple) {
          var long_name = triple[0];
          var default_val = triple[2];
          result[long_name] = default_val;
        }
      );
      return result;
    }

    function update_config(config, query_string) {
      var matches = /(^\?|&)cfg=([^&]*)/.exec(query_string);
      if (matches) {
        var string_config = matches[2];
        var parts = string_config.split(',');
        var regex = settings_regex(spec);
        var short_to_long = generate_short_to_long(spec);
        parts.forEach(
          function (part) {
            var matches = regex.exec(part);
            if (matches) {
              var short_name = matches[1];
              var value = matches[2];
              var long_name = short_to_long[short_name];
              config[long_name] = parseInt(value, 10);
            }
          }
        );
      }
    }
  }
);
