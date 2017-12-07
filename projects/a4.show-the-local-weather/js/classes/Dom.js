define(
  [
    'globals/jquery'
  ],
  function ($) {
    /**
      * This constructor assumes that DOMContentLoaded has already fired.
      * @class
      */
    var Class = function () {
      this._temperature_unit_change_action = $.noop;

      this._temperatureUnitChangeButton().on(
        'click',
        $.proxy(this, '_performTemperatureUnitChangeAction')
      );
    };

    /**
      * @param {string} status - "fetching", "complete", or "error"
      */
    Class.prototype.setAppStatus = function (new_status) {
      var method = {
        'fetching': '_fetchingIndicatorElement',
        'complete': '_infoElement',
        'error': '_errorElement',
      };

      for (var status in method) {
        var jQuery_object = this[method[status]].call(this);
        var action = status === new_status? 'show': 'hide';
        jQuery_object[action].call(jQuery_object);
      }

      this._weatherElement().removeClass('weather--initializing');
    };

    /**
      * @param {Array.<string>} error_messages
      */
    Class.prototype.setErrorMessages = function (error_messages) {
      var elem = this._errorMessagesElement();
      for (var i = 0; i < error_messages.length; i++) {
        elem.append('<div/>');
        var new_div = elem.children().last();
        new_div.text(error_messages[i]);
      }
    };

    /** @param {Function} action */
    Class.prototype.setTemperatureUnitChangeAction = function (action) {
      this._temperature_unit_change_action = action;
    };

    /**
      * @param {Weather} weather
      * @param {number} temperature
      * @param {string} temperature_unit - "C" or "F"
      */
    Class.prototype.showWeather =
      function (weather, temperature, temperature_unit)
    {
      if (weather.place != null) {
        this._placeElement().text(weather.place);
      }

      if (weather.country_code != null) {
        this._countryCodeElement().text(weather.country_code);
      }

      this._temperatureElement().text(temperature);

      this._temperatureUnitElement().text(temperature_unit);

      if (weather.short_description != null) {
        this._shortDescriptionElement().text(weather.short_description);
      }

      if (weather.icon_URL != null) {
        this._iconUrlElement().attr('src', weather.icon_URL);
      }
    };

    Class.prototype._countryCodeElement = function () {
      return $('.weather__country_code');
    };

    Class.prototype._errorElement = function () {
      return $('.weather__error');
    };

    Class.prototype._errorMessagesElement = function () {
      return $('.weather__error_messages');
    };

    Class.prototype._fetchingIndicatorElement = function () {
      return $('.weather__fetching_indicator');
    };

    Class.prototype._iconUrlElement = function () {
      return $('.weather__icon_URL');
    };

    Class.prototype._infoElement = function () {
      return $('.weather__info');
    };

    Class.prototype._placeElement = function () {
      return $('.weather__place');
    };

    Class.prototype._performTemperatureUnitChangeAction = function () {
      this._temperature_unit_change_action.call();
    };

    Class.prototype._shortDescriptionElement = function () {
      return $('.weather__short_description');
    };

    Class.prototype._temperatureElement = function () {
      return $('.weather__temperature');
    };

    Class.prototype._temperatureUnitChangeButton = function () {
      return $('.weather__temperature_unit_change_button');
    };

    Class.prototype._temperatureUnitElement = function () {
      return $('.weather__temperature_unit');
    };

    Class.prototype._weatherElement = function () {
      return $('.weather');
    };

    return Class;
  }
);
