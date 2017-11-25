define(
  ['config', 'globals/jquery'],
  function (config, $) {
    var TIMEOUT = 10e3;
    if (0) {
      var TIMEOUT = 1e-3;
    }

    var Class = function () {};

    /**
      * @param {Function} [error_callback]
      * @return {void}
      */
    Class.prototype.locate = function (success_callback, error_callback) {
      var error_callback2 = error_callback || $.noop;

      var get_position =
        config.useHardCodedPosition()?
        fake_get_position:
        $.proxy(navigator.geolocation, 'getCurrentPosition');

      get_position(
        position_callback1,
        use_position_error_message,
        { timeout: TIMEOUT }
      );

    /**
      * @param {Position} position
      * @return {void}
      */
      function position_callback1(position) {
        if (sufficiently_accurate(position)) {
          success_callback(
            position.coords.latitude,
            position.coords.longitude
          );
        } else {
          navigator.geolocation.getCurrentPosition(
            position_callback2,
            use_position_error_message,
            {
              timeout: TIMEOUT,
              enableHighAccuracy: true,
            }
          );
        }
      }

    /**
      * @param {Position} position
      * @return {void}
      */
      function position_callback2(position) {
        if (sufficiently_accurate(position)) {
          success_callback(
            position.coords.latitude,
            position.coords.longitude
          );
        } else {
          error_callback2(
            [
              'failed to get a sufficiently accurate location for you ' +
              'in 2 attempts'
            ]
          );
        }
      }

    /**
      * @param {PositionError} position_error
      * @return {void}
      */
      function use_position_error_message(position_error) {
        error_callback2([position_error.message]);
        /*<
          Of the 'message' property,
          <https://www.w3.org/TR/2016/REC-geolocation-API-20161108/#position-error>
          says:

            This attribute is primarily intended for debugging and
            developers should not use it directly in their application user
            interface.

          However, I think differently, so am ignoring this.
        */
      }
    };

    return Class;

    function fake_get_position(success_callback) {
      success_callback(
        {
          coords: {
            latitude: 53.7333,
            longitude: -7.8,
            accuracy: 1000,
          }
        }
      );
    }

    /**
      * @param {Position} position
      * @return {boolean}
      */
    function sufficiently_accurate(position) {
      return position.coords.accuracy <= 4e3;
      /*
        We should check position.coords.altitudeAccuracy too, but there's no
        point, seeing as <https://fcc-weather-api.glitch.me/api/current>
        doesn't use it.
      */
    }
  }
);
