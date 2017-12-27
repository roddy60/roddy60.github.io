define(
  ['jquery-private', 'test_config', 'dom/dom_find'],
  function ($, test_config, dom_find) {
    /**
      * @class
      * @desc
      * This constructor assumes that DOMContentLoaded has fired.
      */
    function Class() {
      this._search_form_submission_action = $.noop;
      this._more_button_action = $.noop;

      dom_find.searchFormElement().on(
        'submit',
        $.proxy(this, '_handleSearchFormSubmission')
      );

      dom_find.moreButtonElement().on(
        'click',
        $.proxy(function () { this._more_button_action.call(); }, this)
      );

      test_config.process(
        'search_string',
        $.proxy($('.explore-wikipedia__search-form input'), 'val')
      );
    }

    Class.prototype.clearSearchResults = function () {
      dom_find.searchResultsElement().empty();
    };

    /** @param {boolean} display */
    Class.prototype.displayMoreButton = function (display) {
      var element = dom_find.moreButtonContainerElement();
      element.toggle(display);
    };

    Class.prototype.indicateAppLoaded = function () {
      dom_find.wikipediaElement().removeClass('explore-wikipedia--loading');
    };

    /** @param {boolean} fetching */
    Class.prototype.indicateFetching = function (fetching) {
      dom_find.fetchingElement().toggle(fetching);
    };

    /** @param {boolean} no_more_results */
    Class.prototype.indicateNoMoreResults = function (no_more_results) {
      dom_find.noMoreResultsElement().toggle(no_more_results);
    };

    /** @param {boolean} no_results */
    Class.prototype.indicateNoResults = function (no_results) {
      dom_find.noResultsElement().toggle(no_results);
    };

    /**
      * @param {WikiPage} wiki_page
      */
    Class.prototype.insertSearchResult = function (wiki_page) {
      var search_result_jq = this._instantiateTemplate('search-result');
      dom_find.
        searchResultAnchorElement(search_result_jq).
        text(title_with_disambiguation(wiki_page)).
        attr('href', wiki_page.URL);
      dom_find.
        searchResultExtractElement(search_result_jq).
        text(wiki_page.extract);
      dom_find.searchResultsElement().append(search_result_jq);

      function title_with_disambiguation(wiki_page) {
        var indication_required =
          wiki_page.disambiguation &&
          !String(wiki_page.title).match(/\s+\(disambiguation\)\s*$/);
        return (
          wiki_page.title + (indication_required? ' (disambiguation)': '')
        );
      }
    };

    /**
      * @param {Array<string>} error_messages
      */
    Class.prototype.setErrorMessages = function (error_messages) {
      var container = dom_find.errorMessageElement();
      container.empty();
      error_messages.forEach(
        function (msg) {
          container.append($('<p/>').text(msg));
        }
      );
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setMoreButtonAction = function (action) {
      this._more_button_action = action;
    };

    /**
      * @param {function(string)} action
      */
    Class.prototype.setSearchFormSubmissionAction = function (action) {
      this._search_form_submission_action = action;
    };

    /** @param {string} search_term */
    Class.prototype.showSearchTerm = function (search_term) {
      dom_find.searchTermElement().text(search_term);
      dom_find.searchTermHeadingElement().show();
    };

    Class.prototype._handleSearchFormSubmission = function (event) {
      this._search_form_submission_action.call(null, this._searchString());
      event.preventDefault();
    };

    /**
      * @return {jQuery}
      */
    Class.prototype._instantiateTemplate = function (short_name) {
      return dom_find.templateElement(short_name).clone();
    };

    Class.prototype._searchString = function () {
      return dom_find.searchStringElement().val().trim();
    };

    return Class;
  }
);
