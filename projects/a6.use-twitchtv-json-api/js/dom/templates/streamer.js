define(
  function (require) {
    var $ = require('jquery-private');
    var dom_find = require('dom/dom_find');
    var dom_funcs = require('dom/dom_functions');

    return render;

    /**
      * @param {jQuery} template
      * @param {Object} params
      * @return {jQuery}
      */
    function render(template, params) {
      var result = template.clone();

      result.attr('id', dom_funcs.twitchStreamerElementId(params.username));

      dom_find.logoElement(result).attr('src', params.logo_URL);

      dom_find.
      displayNameElement(result).
      text(params.display_name).
      attr('href', params.URL);

      return result;
    }
  }
);
