define(
  function (require) {
    var
      constants = require('constants'),
      $ = require('jquery-private'),
      Dom = require('dom/Dom'),
      MediawikiActionApi = require('MediawikiActionApi'),
      test_config = require('test_config');

    /**
      * @class
      * @desc
      * This constructor assumes that DOMContentLoaded has fired.
      */
    function Class() {
      this._DOM = new Dom;
      this._MediaWiki_action_API = null;
    }

    Class.prototype.start = function () {
      this._DOM.setSearchFormSubmissionAction(
        $.proxy(this, '_handleSearchFormSubmission')
      );

      this._DOM.setMoreButtonAction(
        $.proxy(this, '_handleMoreButtonPress')
      );

      test_config.process(
        'global_name',
        function (n) {
          window[n] = test_config;
        }
      );

      test_config.process(
        'ajax_timeout',
        function (timeout) {
          $.ajaxSetup(
            {
              timeout: timeout,
              /*<
                When the timeout is low, it's a lot less tedious to test
                error-handling.
              */
            }
          );
        }
      );

      this._DOM.indicateAppLoaded();

      if (window.console && console.timeEnd) {
        console.timeEnd('loading');
      }
    };

    Class.prototype._handleMoreButtonPress = function () {
      this._search(false);
    };

    /**
      * @param {boolean} first - true iff we are fetching the first batch for a search term
      * @param {Array<string>} error_messages
      */
    Class.prototype._handleSearchError = function (first, error_messages) {
      this._DOM.setErrorMessages(error_messages);
      if (!first) {
        this._DOM.displayMoreButton(true);
      }
      throw error_messages;
    };

    Class.prototype._handleSearchFormSubmission = function (search_string) {
      var base_URL = 'https://' + constants.DOMAIN + constants.API_PATH;
      this._MediaWiki_action_API = new MediawikiActionApi(
        base_URL,
        search_string
      );
      this._DOM.clearSearchResults();
      this._search(true);
    };

    /**
      * @param {boolean} first - true iff we are fetching the first batch for a search term
      * @param {Array<WikiPage>} wiki_pages
      */
    Class.prototype._processSearchResultSet = function (first, wiki_pages) {
      if (!wiki_pages.length) {
        if (first) {
          this._DOM.indicateNoResults(true);
        } else {
          this._DOM.indicateNoMoreResults(true);
        }
      } else {
        wiki_pages.forEach($.proxy(this._DOM, 'insertSearchResult'));
        this._DOM.displayMoreButton(true);
      }
    };

    /**
      * @param {boolean} first - true iff we are fetching the first batch for a search term
      * @return void
      */
    Class.prototype._search = function (first) {
      this._DOM.setErrorMessages([]);

      this._DOM.indicateFetching(true);

      var promise = this._MediaWiki_action_API.search();

      if (first) {
        promise.always(
          $.proxy(
            function () {
              this._DOM.showSearchTerm(
                this._MediaWiki_action_API.getSearchTerm()
              );
            },
            this
          )
        );
      }

      return (
        promise.
        always($.proxy(this, '_setBaseline')).
        done($.proxy(this, '_processSearchResultSet', first)).
        then(null, $.proxy(this, '_handleSearchError', first))
      );
    };

    Class.prototype._setBaseline = function () {
      this._DOM.indicateFetching(false);
      this._DOM.setErrorMessages([]);
      this._DOM.indicateNoResults(false);
      this._DOM.indicateNoMoreResults(false);
      this._DOM.displayMoreButton(false);
    };

    return Class;
  }
);
