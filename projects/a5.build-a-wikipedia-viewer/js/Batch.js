define(
  ['jquery-private', 'util'],
  function ($, util) {
    /**
      * @classdesc
      * This class--specifically, the 'update' method--has an implicit
      * dependency on the structure of the response from the MediaWiki
      * API, in that it assumes a certain structure for that response.
      */
    function Class() {
      this._count = 0;
      /** @member {Object<string, Object>} */
      this._pages = {};
      /** @member {boolean} */
      this._sufficient_cached = false;
    }

    /**
      * @return {Batch}
      */
    Class.prototype.clone = function () {
      var result = new this.constructor;
      result._count = this._count;
      result._pages = $.extend(true, {}, this._pages);
      result._sufficient_cached = this._sufficient_cached;
      return result;
    };

    /**
      * @return {boolean} - true iff the batch contains at least
      *   one sufficient page record
      * @desc
      * On 2017-12-19, the API at en.wikipedia.org was observed to return a
      * batch with an incomplete record.  A certain page was referred to in
      * a number of different HTTP responses.  All the responses contained
      * the title, but none contained the URL.  This means that the batch
      * gave incomplete information about that particular page.
      *
      * To introduce some terminology: we will say that a record is
      * sufficient or insufficient, depending on whether it has sufficient
      * information about a page.  For our definition of 'sufficient', see
      * the function 'is_sufficient_page'.
      */
    Class.prototype.hasSufficientPage = function () {
      /*>
        this._sufficient_cached, if false, may be out of date, but if true,
        will be true forever.
      */
      if (!this._sufficient_cached) {
        this._sufficient_cached =
          util.object_values(this._pages).some(is_sufficient_page);
      }

      return this._sufficient_cached;
    };

    /**
      * @return {Array<Object>}
      */
    Class.prototype.toArray = function () {
      var result =
        util.object_values(this._pages).filter(is_sufficient_page);
      result.sort(
        function (a, b) {
          return a.index - b.index;
        }
      );
      result.forEach(
        function (obj) {
          delete obj.index;
        }
      );
      return result;
    };

    /**
      * @param {Array<Object>} page_info_list
      * @return {this}
      */
    Class.prototype.update = function (page_info_list) {
      page_info_list.forEach(
        function (page_info) {
          var page_ID = page_info.pageid;

          if (!this._pages.hasOwnProperty(page_ID)) {
            var new_count = this._count + 1;
            this._pages[page_ID] = {
              index: new_count,   // This property is to allow sorting
              disambiguation: page_info.hasOwnProperty('categories'),
            };
            this._count = new_count;
          }

          if (page_info.hasOwnProperty('title')) {
            this._pages[page_ID].title = page_info.title;
          }

          if (page_info.hasOwnProperty('canonicalurl')) {
            this._pages[page_ID].URL = page_info.canonicalurl;
          }

          if (page_info.hasOwnProperty('extract')) {
            this._pages[page_ID].extract = page_info.extract;
          }
        },
        this
      );

      return this;
    };

    return Class;

    /**
      * @param {Object} page_info
      * @return {boolean}
      */
    function is_sufficient_page(page_info) {
      return (
        page_info.hasOwnProperty('title') &&
        /\S/.test(page_info.title) &&
        page_info.hasOwnProperty('URL')
      );
    }
  }
);
