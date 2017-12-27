/*
  This file was used during development.  It is now unmaintained
  and may be incorrect.
*/
define(
  ['jquery-private', 'WikiPage'],
  function ($, WikiPage) {
    function Class() {
      this.results = successive_results();
      this.search_count = 0;
    }

    /**
      * @return {Promise<Array<WikiPage>>}
      */
    Class.prototype.search = function () {
      if (this.search_count < this.results.length) {
        var result = this.results[this.search_count];
        this.search_count++;
      } else {
        var result = this.results[this.results.length - 1];
      }
      return result;
    };

    return Class;

    function make_wiki_page(title) {
      return new WikiPage(
        title,
        'https://' + title,
        title + (' ' + title).repeat(39)
      );
    }

    function successive_results() {
      var s = [
        [
          make_wiki_page('Oak'),
          make_wiki_page('Beech'),
          make_wiki_page('Sycamore'),
          make_wiki_page('Elm'),
          make_wiki_page('Fir'),
        ],
        [
          make_wiki_page('Rose'),
          make_wiki_page('Tulip'),
          make_wiki_page('Carnation'),
          make_wiki_page('Snowdrop'),
          make_wiki_page('Daffodil'),
        ],
        [],
      ].map(
        function (a) {
          return $.Deferred().resolve(a);
        }
      );

      var f = [
        $.Deferred().reject(['err msg 1', 'err msg 2'])
      ];

      var result;
      result = s;
      result = [s[0], s[1], f[0]];
      return result;
    }
  }
);
