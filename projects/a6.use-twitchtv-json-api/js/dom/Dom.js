define(
  function (require) {
    var $ = require('jquery-private');
    var dom_find = require('dom/dom_find');
    var render_streamer_template = require('dom/templates/streamer');

    /**
      * @class
      * @desc
      * This constructor assumes that DOMContentLoaded has fired.
      */
    function Class() {
      this._action_for_checkbox_for_has_title = $.noop;
      this._action_for_checkbox_for_lacks_title = $.noop;

      var that = this;
      dom_find.checkboxForHasTitleElement().on(
        'change',
        function (event) {
          that._action_for_checkbox_for_has_title.call(
            null,
            $(event.target).is(':checked')
          )
        }
      );
      dom_find.checkboxForLacksTitleElement().on(
        'change',
        function (event) {
          that._action_for_checkbox_for_lacks_title.call(
            null,
            $(event.target).is(':checked')
          )
        }
      );
    }

    /**
      * @param {Array<Object>} user_info_list
      */
    Class.prototype.insertUsers = function (user_info_list) {
      var template = dom_find.streamerTemplateElement();
      user_info_list.forEach(
        function (user_info) {
          var streamer_element =
            render_streamer_template(template, user_info);
          dom_find.
          twitchStreamersContainerElement().
          append(streamer_element);
        }
      );
    };

    Class.prototype.reveal = function () {
      dom_find.appElement().removeClass('twitch-streamers--loading');
    };

    /**
      * @param {function()} func
      */
    Class.prototype.setActionForCheckboxForHasTitle = function (func) {
      this._action_for_checkbox_for_has_title = func;
    };

    /**
      * @param {function()} func
      */
    Class.prototype.setActionForCheckboxForLacksTitle = function (func) {
      this._action_for_checkbox_for_lacks_title = func;
    };

    /**
      * @param {boolean} error
      */
    Class.prototype.setErrorState = function (error) {
      dom_find.appElement().toggleClass('twitch-streamers--error', error);
    };

    /** @param {string} last_update_time */
    Class.prototype.setLastUpdateTime = function (last_update_time) {
      dom_find.lastUpdateTimeElement().text(last_update_time);
    };

    /**
      * @param {Object<string, string>} stream_info - the keys are usernames
      */
    Class.prototype.setStreamingInfo = function (stream_info) {
      set_video_title(dom_find.allVideoTitleElements(), '');
      /*<
        This is needed because some users may have stopped streaming
        since the page was last updated.
      */

      $.each(
        stream_info,
        function (username, video_title) {
          set_video_title(
            dom_find.videoTitleElement(username),
            video_title
          );
        }
      );
    };

    Class.prototype.showIfHasTitle = function (show) {
      dom_find.appElement().toggleClass(
        'twitch-streamers--hide-if-has-video-title',
        !show
      );
    };

    Class.prototype.showIfLacksTitle = function (show) {
      dom_find.appElement().toggleClass(
        'twitch-streamers--hide-if-lacks-video-title',
        !show
      );
    };

    return Class;

    /**
      * @param {jQuery} jq - jq.length > 1 is allowed
      */
    function set_video_title(jq, new_text) {
      jq.text(new_text);

      var streamer_elements = jq.closest('.twitch-streamers__streamer');

      if (new_text === '') {
        streamer_elements.removeClass('twitch-streamers__has-video-title');
        streamer_elements.addClass('twitch-streamers__lacks-video-title');
      } else {
        streamer_elements.removeClass('twitch-streamers__lacks-video-title');
        streamer_elements.addClass('twitch-streamers__has-video-title');
      }
    }
  }
);
