define(
  ['Query'],
  function (Query) {
    return {
      API_PATH: '/w/api.php',

      BASE_API_QUERY: function () {
        return (new Query).setParameters(
          { action: 'query' },

          { format: 'json' },

          { formatversion: 2 },
          /*<
            <https://www.mediawiki.org/w/index.php?title=API:Query&oldid=2534019>
            says:

              If you're querying Wikimedia wikis and requesting results as
              format=json (or php), then specify formatversion=2
          */

          { origin: '*' },
          /*<
            <https://www.mediawiki.org/w/index.php?title=Manual:CORS&oldid=2621343#Description>
            says:

              For anonymous requests, origin query string parameter can be
              set to * which will allow requests from anywhere.
          */

          { generator: 'search' },
          /*<
            This parameter tells the API to do a search.
            Parameters below tell the API what information
            to send about the objects that are found by
            the search.
          */

          { gsrwhat: 'text' },
          { gsrlimit: 20 },
          /*<
            These parameters relate to the search.  See
            <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bsearch>
            for more information.

            To find the name of a parameter in the aforementioned page,
            remove the initial "g" from its name.  The reason for the
            initial "g" is given in
            <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bsearch>,
            which says:

              Parameters passed to a generator must be prefixed with a g.
          */

          { prop: 'categories|extracts|info' },
          /*<
            We want the API to return 3 different kinds of information
            (separated in the above by the pipe symbol):

              * categories (documented at
              <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bcategories>);

              * extracts (documented at
              <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bcategories>);

              * "info" (documented at
              <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Binfo>).
          */

          { cllimit: 20 },
          { clcategories: 'Category:Disambiguation pages' },
          /*<
            These parameteters, documented at
            <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bcategories>,
            pertain to 'prop' and 'categories', above.
          */

          { exsentences: 2 },
          { exintro: null },
          { explaintext: null },
          { exsectionformat: 'plain' },
          { exlimit: 20 },
          /*<
            These parameteters, documented at
            <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bextracts>,
            pertain to 'prop' and 'extracts', above.

            When exsectionformat is set to "plain", as above, sentence
            detection works better, though still imperfectly.
          */

          { inprop: 'url' }
          /*<
            This parameteter, documented at
            <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Binfo>,
            pertains to 'prop' and 'info', above.
          */

          /*<
            We set various limits above: gsrlimit, cllimit, and exlimit.
            These should all be set to the same value.  Without this, we may
            get unnecessary "continuing".  ("Continuing" refers to the
            generation of incomplete responses which have to be filled in
            with further requests.  See
            <https://www.mediawiki.org/w/index.php?title=API:Query&oldid=2534019#Continuing_queries>.)
          */
        );
      },

      DOMAIN: 'en.wikipedia.org',
    }
  }
);
