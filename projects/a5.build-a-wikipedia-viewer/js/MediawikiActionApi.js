/*
  The class name "MediawikiActionApi" comes from
  <https://www.mediawiki.org/w/index.php?title=API:Main_page&oldid=2648954>,
  which says:

    The MediaWiki action API is a web service that provides convenient
    access to wiki features, data, and meta-data over HTTP, via a URL.
    [...] It was known as the MediaWiki API, but there are now other web
    APIs available that connect to MediaWiki
*/
define(
  function (require) {
    var
      $ = require('jquery-private'),
      util = require('util'),
      constants = require('constants'),
      Batch = require('Batch'),
      WikiPage = require('WikiPage'),
      test_config = require('test_config');

    var MAX_REQUESTS_PER_SEARCH = 20;

    function Class(base_URL, search_string) {
      this._base_URL = base_URL;
      this._search_string = search_string;

      this._complete = false;
      this._continue_parameters = {};
    }

    Class.prototype.getSearchTerm = function () {
      return this._search_string;
    };

    /**
      * @return {Promise<Array<WikiPage>>}
      * @desc
      * All failures are considered temporary.  In other
      * words, if this method returns a promise in the 'rejected' state,
      * it's OK to call the method again (though one should probably
      * wait a while).
      */
    Class.prototype.search = function () {
      if (this._complete || test_config.get('search_returns_nothing')) {
        return $.Deferred().resolve([]).promise();
      } else {
        var URL = this._URL(this._continue_parameters);
        return $.ajax(URL).then(
          $.proxy(this, '_handleAjaxSuccess', new Batch, 1),
          $.proxy(this, '_handleAjaxFailure')
        );
      }
    };

    /**
      * @param {Object} extra_parameters
      */
    Class.prototype._URL = function (extra_parameters) {
      var query = constants.BASE_API_QUERY();
      query.setParameter('gsrsearch', this._search_string);
      $.each(
        extra_parameters,
        function (k, v) {
          query.setParameter(k, v);
        }
      );
      return (
        this._base_URL +
        '?' +
        query.toQueryStringSegment()
      );
    };

    Class.prototype._handleAjaxFailure = function () {
      throw util.jquery_ajax_error_messages.apply(null, arguments);
    };

    /**
      * @param {Batch} batch
      * @param {number} request_count - the number of HTTP requests that have been made thus far for the current search
      * @return {(Array<WikiPage>|Promise<Array<WikiPage>>)}
      */
    Class.prototype._handleAjaxSuccess =
      function (batch, request_count, data)
    {
      var errors = find_format_errors(data);
      if (errors.length) {
        throw errors.map(
          function (msg) {
            return 'Format error in response from server: ' + msg;
          }
        );
      }

      if (data.warnings) {
        console.warn(data.warnings);
      }

      if (data.error) {
        throw [data.error];
      }

      /*<
        For the 'warnings' and 'error' properties, we are essentially
        copying the logic in the Python code here:

          https://www.mediawiki.org/w/index.php?title=API:Query&oldid=2653378#Continuing_queries
      */

      if (!data.query || data.query.pages.length == 0) {
        this._complete = true;
        this._continue_parameters = {};
        return batch_to_wiki_pages(batch);
      } else {
        var batch2 = batch.clone().update(data.query.pages);
        if (!data.continue) {
          this._complete = true;
          this._continue_parameters = {};
          return batch_to_wiki_pages(batch2);
        } else {
          if (data.batchcomplete && batch2.hasSufficientPage()) {
            this._continue_parameters = data.continue;
            return batch_to_wiki_pages(batch2);
          } else {
            if (request_count >= MAX_REQUESTS_PER_SEARCH) {
              throw [
                'too many HTTP requests made for current search ' +
                '(limit is ' + MAX_REQUESTS_PER_SEARCH + ')'
              ];
            } else {
              var URL = this._URL(data.continue);
              return $.ajax(URL).then(
                $.proxy(
                  this, '_handleAjaxSuccess', batch2, request_count + 1
                ),
                $.proxy(this, '_handleAjaxFailure')
              );
            }
          }
        }
      }
    };

    return Class;

    /**
      * @param {Batch} batch
      * @return {Array<WikiPage>}
      */
    function batch_to_wiki_pages(batch) {
      return batch.toArray().map(
        function (obj) {
          return new WikiPage(
            obj.title,
            obj.URL,
            obj.extract,
            obj.disambiguation
          );
        }
      );
    }

    /** @return {Array<string>} - empty if there are no format errors */
    function find_format_errors(data) {
      tmp = test_config.get('response_format_error_messages');
      if (tmp !== null) {
        return tmp;
      }

      if (correct_format_but_no_search_results(data)) {
        return [];
      } else if ($.type(data) !== 'object') {
        return ['not an object'];
      } else if (!data.hasOwnProperty('query')) {
        return ["response object lacks 'query' property"];
      } else if ($.type(data.query) !== 'object') {
        return ["'query' property is not an object"];
      } else if (!data.query.hasOwnProperty('pages')) {
        return ["RESONSE.query lacks 'pages' property"];
      } else if ($.type(data.query.pages) !== 'array') {
        return ["RESPONSE.query.pages is not an array"];
      } else if (!array_contains_only_objects(data.query.pages)) {
        return ["RESPONSE.query.pages is not an array of objects"];
      } else if (!all_objects_have_pageid(data.query.pages)) {
        return [
          "one or more objects in RESPONSE.query.pages lacks " +
          "'pageid' property"
        ];
      } else if (!every_pageid_is_number(data.query.pages)) {
        return [
          "not every pageid in RESPONSE.query.pages is a number"
        ];
      } else {
        return [];
      }

      function all_objects_have_pageid(array) {
        return array.every(
          function (obj) {
            return obj.hasOwnProperty('pageid');
          }
        );
      }

      function array_contains_only_objects(array) {
        return array.every(
          function (x) {
            return $.type(x) === 'object';
          }
        );
      }

      function every_pageid_is_number(array) {
        return array.every(
          function (obj) {
            return $.type(obj.pageid) === 'number';
          }
        );
      }

      /**
        * @param {*} x
        * @return {boolean}
        */
      function correct_format_but_no_search_results(x) {
        return (
          $.type(x) === 'object' &&
          x.batchcomplete === true &&
          !x.hasOwnProperty('query')
        );
      }
    }
  }
);
