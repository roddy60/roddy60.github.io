define(
  function (require) {
    var $ = require('jquery-private');
    var dev = require('dev');
    var dom_funcs = require('dom/dom_functions');

    return Object.freeze(
      {
        allVideoTitleElements: function () {
          return ne($('.twitch-streamers__video-title'));
        },

        appElement: function () {
          return ne($('.twitch-streamers'));
        },

        checkboxForHasTitleElement: function () {
          return ne($('.twitch-streamers__check-if-want-if-has-title'));
        },

        checkboxForLacksTitleElement: function () {
          return ne($('.twitch-streamers__check-if-want-if-lacks-title'));
        },

        /**
          * @param {jQuery} jq
          * @return {jQuery}
          */
        displayNameElement: function (jq) {
          return ne(jq.find('.twitch-streamers__streamer-display-name'));
        },

        lastUpdateTimeElement: function () {
          return ne($('.twitch-streamers__last-update-time'));
        },

        /**
          * @param {jQuery} jq
          * @return {jQuery}
          */
        logoElement: function (jq) {
          return ne(jq.find('.twitch-streamers__streamer-logo'));
        },

        streamerTemplateElement: function () {
          return ne(
            $('.twitch-streamers__templates .twitch-streamers__streamer')
          );
        },

        twitchStreamersContainerElement: function () {
          return ne($('.twitch-streamers__streamers'));
        },

        videoTitleElement: function (username) {
          var ID = dom_funcs.twitchStreamerElementId(username);
          var streamer_elem = $(document.getElementById(ID));
          return ne(streamer_elem.find('.twitch-streamers__video-title'));
        },
      }
    );

      /**
        * "ne" is short for "non-empty".
        * @param {jQuery} jq
        * @return {jQuery} - the 'jq' parameter
        * @throws {Error}
        */
    function ne(jq) {
      if (jq.length >= 1) {
        return jq;
      } else {
        var msg = 'Failed to find expected element or elements';
        dev.console.error(msg);
        dev.console.trace();
        throw new Error(msg);
      }
    }
  }
);
