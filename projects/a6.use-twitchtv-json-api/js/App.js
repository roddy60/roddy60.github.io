define(
  function (require) {
    var $ = require('jquery-private');
    var Dom = require('dom/Dom');
    var TwitchApi = require('TwitchApi');
    var config = require('config/config');
    var dev = require('dev');
    var functions = require('functions');
    var strftime = require('vendor/mout/date/strftime');
    var test_config = require('config/test/config');

    /**
      * @class
      * @desc
      * This constructor assumes that DOMContentLoaded has fired.
      */
    function Class() {
      this._DOM = new Dom;
      this._twitch_API = new TwitchApi;
      this._first_update_done = false;
      this._first_reveal_call_complete = false;
    }

    Class.prototype.start = function () {
      dev.console.timeEnd('loading');

      if (test_config.ajax_timeout) {
        $.ajaxSetup({ timeout: test_config.ajax_timeout });
      }

      this._DOM.setActionForCheckboxForHasTitle(
        $.proxy(this._DOM, 'showIfHasTitle')
      );

      this._DOM.setActionForCheckboxForLacksTitle(
        $.proxy(this._DOM, 'showIfLacksTitle')
      );

      this.
        _twitch_API.
        fetchUsers(config.usernames).
        done(
          $.proxy(
            function (data) {
              this._DOM.insertUsers(data);

              functions.loopWithSleep(
                $.proxy(this, '_updateStreamingInfo'),
                config.update_interval
              );
            },
            this
          )
        ).
        fail($.proxy(this, '_indicateError'));
    };

    Class.prototype._indicateError = function () {
      this._DOM.setErrorState(true);
      this._reveal();
    };

    Class.prototype._reveal = function () {
      this._DOM.reveal();
      if (!this._first_reveal_call_complete) {
        dev.console.timeEnd('loading and initial Ajax');
      }
      this._first_reveal_call_complete = true;
    };

    Class.prototype._updateStreamingInfo = function () {
      var promise =
        test_config.streaming_info_attempt_1_fails &&
          functions.counter('_updateStreamingInfo') == 1?
        $.Deferred().reject():
        this._twitch_API.fetchStreamingInfo(config.usernames);

      promise.
      done(
        $.proxy(
          function (data) {
            this._DOM.setStreamingInfo(data);
            this._DOM.setLastUpdateTime(
              strftime(new Date, '%Y-%m-%d %H:%M:%S')
            );
            this._DOM.setErrorState(false);
            this._reveal();
            this._first_update_done = true;
          },
          this
        )
      );

      if (!this._first_update_done) {
        promise.fail($.proxy(this, '_indicateError'));
      }
    };

    return Class;
  }
);
