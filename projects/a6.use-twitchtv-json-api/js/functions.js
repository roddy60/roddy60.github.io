define(
  function (require) {
    var dev = require('dev');
    var test_config = require('config/test/config');

    var functions;
    return Object.freeze(
      functions = {
        counter: (
          function () {
            var counter_val = {};

            /**
              * @param {string} name
              * @return {number}
              */
            return function (name) {
              if (!counter_val.hasOwnProperty(name)) {
                counter_val[name] = 0;
              }
              counter_val[name]++;
              return counter_val[name];
            };
          }
        )(),

        /**
          * @param {function()} func
          * @param {number} sleep_time
          * @param {boolean} [wait=false] - true means to wait sleep_time before making first call to func
          * @return {function()}
          */
        loopWithSleep: function (func, sleep_time, wait) {
          if (wait) {
            setTimeout(f, sleep_time);
          } else {
            f();
          }

          function f() {
            var end_loop =
              test_config.hasOwnProperty('max_updates') &&
              functions.counter('loopWithSleep') > test_config.max_updates;
            if (!end_loop) {
              if (1) {
                dev.console.log('loopWithSleep: about to call func');
              }
              func();
              setTimeout(f, sleep_time);
            }
          }
        },
      }
    );
  }
);
