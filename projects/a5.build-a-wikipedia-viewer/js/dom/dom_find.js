define(
  ['jquery-private'],
  function ($) {
    return {
      errorMessageElement: function () {
        return $('.explore-wikipedia__error-messages');
      },

      fetchingElement: function () {
        return $('.explore-wikipedia__fetching');
      },

      moreButtonContainerElement: function () {
        return $('.explore-wikipedia__more-button-container');
      },

      moreButtonElement: function () {
        return $('.explore-wikipedia__more-button');
      },

      noMoreResultsElement: function () {
        return $('.explore-wikipedia__no-more-results');
      },

      noResultsElement: function () {
        return $('.explore-wikipedia__no-results');
      },

      searchButtonElement: function () {
        return $('.explore-wikipedia__search-button');
      },

      searchFormElement: function () {
        return $('.explore-wikipedia__search-form');
      },

      /** @param {jQuery} jq */
      searchResultAnchorElement: function (jq) {
        return jq.find('.explore-wikipedia__search-result-title');
      },

      /** @param {jQuery} jq */
      searchResultExtractElement: function (jq) {
        return jq.find('.explore-wikipedia__search-result-extract');
      },

      searchResultsElement: function () {
        return $('.explore-wikipedia__search-results');
      },

      searchStringElement: function () {
        return $('.explore-wikipedia__search-input');
      },

      searchTermElement: function () {
        return $('.explore-wikipedia__search-term');
      },

      searchTermHeadingElement: function () {
        return $('.explore-wikipedia__search-term-heading');
      },

      templateElement: function (short_name) {
        var selector =
          '.explore-wikipedia__templates ' +
          '.explore-wikipedia__' + short_name;
        return $(selector);
      },

      wikipediaElement: function () {
        return $('.explore-wikipedia');
      },
    }
  }
);
