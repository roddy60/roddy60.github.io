define(
  function (require) {
    var $ = require('jquery-private');
    var GroupFetcher = require('GroupFetcher');
    var ld = require('vendor/lodash');

    var URL_BASES = {
      streaming: 'https://wind-bow.glitch.me/twitch-api/streams/',
      user: 'https://wind-bow.glitch.me/twitch-api/users/',
    };
    var WEBSITE_URL = 'https://www.twitch.tv/';
    //< The value of this variable must end with a slash.

    /** @class */
    function Class() {}

    /**
      * @param {Array<string>} usernames
      * @return {Promise<Object<string, string>>}
      */
    Class.prototype.fetchStreamingInfo = function (usernames) {
      return (
        (new GroupFetcher(streaming_URLs(usernames))).
        fetch().
        then(transform_streaming_responses)
      );
    };

    /**
      * @param {Array<string>} usernames
      * @return {Promise<Array<Object>>}
      */
    Class.prototype.fetchUsers = function (usernames) {
      return (
        (new GroupFetcher(user_URLs(usernames))).
        fetch().
        then(transform_user_responses.bind(null, usernames))
      );
    };

    return Class;

    /**
      * @param {Object<string, Object>} responses
      * @return {Object<string, string>}
      * @throws {string}
      */
    function transform_streaming_responses(responses) {
      var result = {};

      if (ld.isPlainObject(responses)) {
        $.each(
          responses,
          function (username, response) {
            var game = ld.get(response, 'stream.channel.game');

            if (ld.isString(game) && game != '') {
              var tmp = game;

              var status = ld.get(response, 'stream.channel.status');
              if (ld.isString(status) && status != '') {
                tmp = status + ': ' + tmp;
              }

              result[username] = tmp;
            }
          }
        );
      }

      return result;
    }

    /**
      * @param {Object<string, Object>} responses
      * @return {Array<Object>}
      * @throws {string}
      */
    function transform_user_responses(usernames, responses) {
      if (!ld.values(responses).every(correct_user_format)) {
        throw 'Format error (user info)';
      } else {
        return usernames.reduce(
          function (acc, username) {
            var user_info = responses[username];
            acc.push(
              {
                URL: WEBSITE_URL + user_info.name,
                display_name: user_info.display_name,
                logo_URL: user_info.logo,
                username: user_info.name,
              }
            );
            return acc;
          },
          []
        );
      }
    }

    /**
      * @param {Object} user_info
      * @return {boolean}
      */
    function correct_user_format(user_info) {
      return (
        ld.isPlainObject(user_info) &&
        has_non_empty_string_prop(user_info, 'display_name') &&
        has_non_empty_string_prop(user_info, 'logo') &&
        has_non_empty_string_prop(user_info, 'name')
      );

      function has_non_empty_string_prop(obj, prop_name) {
        return (
          obj.hasOwnProperty(prop_name) &&
          ld.isString(obj[prop_name]) &&
          obj[prop_name] != ''
        );
      }
    }

    /**
      * @param {Array<string>} usernames
      * @return {Object<string, string>} - the keys are usernames
      */
    function streaming_URLs(usernames) {
      return usernames.reduce(
        function (acc, username) {
          acc[username] = URL_BASES.streaming + username;
          return acc;
        },
        {}
      );
    }

    /**
      * @param {Array<string>} usernames
      * @return {Object<string, string>} - the keys are usernames
      */
    function user_URLs(usernames) {
      return usernames.reduce(
        function (acc, username) {
          acc[username] = URL_BASES.user + username;
          return acc;
        },
        {}
      );
    }
  }
);
