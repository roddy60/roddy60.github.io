define(
  [
    'config',
    'globals/jquery',
    'classes/Weather',
  ],
  function (config, $, Weather) {
    var WEATHER_URL = 'https://fcc-weather-api.glitch.me/api/current';

    var Class = function () {};

    Class.prototype.fetch = function
      (latitude, longitude, success_callback, error_callback)
    {
      var URL =
        config.useProblemWeatherUrl()?
        'data:application/json,{':   // JSON is intentionally invalid
        WEATHER_URL;

      $.ajax(
        {
          url: URL,
          data: {
            lat: latitude,
            lon: longitude,
          }
        }
      ).
      done($.proxy(this, '_handleSuccess', success_callback)).
      fail($.proxy(this, '_handleFailure', error_callback));
    };

    Class.prototype._handleFailure = function (error_callback) {
      /*
        The jQuery docs are unclear about the meaning of the 2nd and 3rd
        arguments to the error callback.

        The source code is no help.  The key code seems to be:

          https://github.com/jquery/jquery/blob/3.2.1/src/ajax.js#L747-L797

        (If reading that, you can skip the first 'isSuccess' branch.)

        The best thing seems to be to pass an array of error messages and
        let error_callback decide what to do.
      */

      var error_messages = [];

      for (var i = 1; i < arguments.length && i < 3; i++) {
        if (arguments[i] != null) {
          var s = arguments[i].toString();
          if (s != '' && !s.match(/^\[object .+\]$/)) {
            error_messages.push(s);
          }
        }
      }

      error_callback(error_messages);
    };

    Class.prototype._handleSuccess =
      function (success_callback, weather_data)
    {
      var fields = {};

      if (weather_data.hasOwnProperty('sys')) {
        fields.country_code = weather_data.sys.country;
      }

      fields.place = weather_data.name;

      if (weather_data.hasOwnProperty('weather') &&
        weather_data.weather.length >= 1)
      {
        fields.short_description = weather_data.weather[0].main;
        fields.icon_URL = weather_data.weather[0].icon;
      }

      if (weather_data.hasOwnProperty('main')) {
        fields.temperature = weather_data.main.temp;
      }

      success_callback(new Weather(fields));
    };

    return Class;
  }
);
