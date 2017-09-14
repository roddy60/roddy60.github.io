define(
  [
    'classes/Dom',
    'classes/DefinitionQuoteFetcher',
    'classes/ForismaticQuoteFetcher',
  ],
  function (Dom, DefinitionQuoteFetcher, ForismaticQuoteFetcher) {
    var Class = function () {
      this._DOM = new Dom;

      this._handler_objects = {
        'forismatic.com': new ForismaticQuoteFetcher,
        'definitions': new DefinitionQuoteFetcher,
      };
    };

    Class.prototype.start = function () {
      if (!CSP_support_seems_complete()) {
        this._DOM.makeAppUnavailable();
        /*<
          We access api.forismatic.com by JSONP.  This is risky, since
          api.forismatic.com is untrusted.  Content Security Policy, which
          we are using, is arguably a sufficient defence; but if it's not
          available, we disable the app for the user's protection.
        */
      } else {
        this._DOM.setNewQuoteRequestHandler(
          $.proxy(this, '_handleNewQuoteRequest')
        );

        this._handleNewQuoteRequest();
      }

      function CSP_support_seems_complete() {
        var EvalError_caught = false;
        try {
          (new Function).call();
        } catch (_) {
          EvalError_caught = true;
        }
        return EvalError_caught;

        /*<
          Quoting
          <https://www.w3.org/TR/2016/REC-CSP2-20161215/#directive-script-src>:

            If 'unsafe-eval' is not in allowed script sources:

              [...]

              * When called as a constructor, the function Function
              MUST throw an EvalError exception.

          Chromium 57.0.2987.98 throws an EvalError.  Firefox 52.3.0 throws
          a plain Error.

          On 2017-09-15,
          <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError>
          says that EvalError has not been used by the EcmaScript
          specification since EcmaScript 5.1.
        */
      }
    };

    Class.prototype._handleNewQuoteRequest = function () {
      var source = this._DOM.getSource();
      if (this._handler_objects.hasOwnProperty(source)) {
        var fetcher = this._handler_objects[source];
        this._DOM.setFetchStatus('fetching');
        fetcher.
          fetchQuote().
          done(
            $.proxy(
              function (quote) {
                this._DOM.setQuote(quote.formatted);

                var URL = twitter_URL(quote.tweetified);
                this._DOM.setTwitterUrl(URL);

                this._DOM.setFetchStatus('success');
              },
              this
            )
          ).
          fail($.proxy(this._DOM, 'setFetchStatus', 'failure'));
      }

      /** @param {string} quote */
      function twitter_URL(quote) {
        return 'https://twitter.com/intent/tweet?text=' +
          encodeURIComponent(quote);
      }
    };

    return Class;
  }
);
