define(
  [
    'config',
    'mout',
    'classes/Dom',
    'classes/Geolocator',
    'classes/WeatherFetcher',
  ],
  function (config, mout, Dom, Geolocator, WeatherFetcher) {
    var Class = function () {
      this._DOM = new Dom;
      this._weather = null;
      this._celsius_wanted = true;
    };

    Class.prototype.start = function () {
      this._DOM.setTemperatureUnitChangeAction(
        $.proxy(this, '_changeTemperatureUnit')
      );
      this._DOM.setAppStatus('fetching');
      (new Geolocator).locate(
        $.proxy(this, '_getWeatherAtLocation'),
        $.proxy(this, '_reportError')
      );
    };

    Class.prototype._changeTemperatureUnit = function () {
      this._celsius_wanted = !this._celsius_wanted;
      if (this._weather) {
        this._showWeather();
      }
    };

    Class.prototype._getWeatherAtLocation = function (latitude, longitude) {
      (new WeatherFetcher).fetch(
        latitude,
        longitude, 
        $.proxy(
          function (weather) {
            this._weather = weather;
            if (config.showWeather()) {
              this._showWeather();
            }
          },
          this
        ),
        $.proxy(this, '_reportError')
      );
    };

    /**
      * @param {Array.<string>} error_messages
      */
    Class.prototype._reportError = function (error_messages) {
      this._DOM.setAppStatus('error');
      this._DOM.setErrorMessages(error_messages);
    };

    /**
      * @param {Weather} weather
      */
    Class.prototype._showWeather = function () {
      this._DOM.setAppStatus('complete');

      var args = [this._weather];
      var fmt_num = function (num) {
        return mout.number.enforcePrecision(num, 2);
      };
      if (this._celsius_wanted) {
        args.push(fmt_num(this._weather.temperature), 'C');
      } else {
        args.push(
          fmt_num(celsius_to_fahrenheit(this._weather.temperature)),
          'F'
        );
      }
      this._DOM.showWeather.apply(this._DOM, args);
    };

    return Class;

    function celsius_to_fahrenheit(celsius_temperature) {
      return celsius_temperature * 9 / 5 + 32;
    }
  }
);
