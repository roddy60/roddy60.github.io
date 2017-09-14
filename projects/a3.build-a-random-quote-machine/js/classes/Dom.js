define(
  function () {
    var Class = function () {};

    Class.prototype.getSource = function () {
      return this._checkedControl().val();
    };

    Class.prototype.makeAppUnavailable = function () {
      this._quoteAppElement().addClass('quote-app-unavailable');
    };

    /**
      * @param {string} status One of 'fetching', 'success', or 'failure'
      */
    Class.prototype.setFetchStatus = function (status) {
      if (/^(fetching|success|failure)$/.test(status)) {
        this.
          _fetchStatusElement().
          removeClass(
            'fetch-status-fetching fetch-status-success ' +
            'fetch-status-failure'
          ).
          addClass('fetch-status-' + status);
      }
    };

    Class.prototype.setNewQuoteRequestHandler = function (handler) {
      this._button().off('click');
      this._button().on('click', handler);
    };

    Class.prototype.setQuote = function (quote) {
      this._quoteElement().text(quote);
    };

    Class.prototype.setTwitterUrl = function (URL) {
      this._twitterLinkElement().attr('href', URL);
    };

    Class.prototype._button = function () {
      return $('#get-quote-button');
    };

    Class.prototype._checkedControl = function () {
      return $('[name="quote_source"]:checked');
    };

    Class.prototype._fetchStatusElement = function () {
      return $('.fetch-status');
    };

    Class.prototype._quoteAppElement = function () {
      return $('.quote-app');
    };

    Class.prototype._quoteElement = function () {
      return $('.quote-app .quote');
    };

    Class.prototype._twitterLinkElement = function () {
      return $('.tweet-quote');
    };

    return Class;
  }
);
