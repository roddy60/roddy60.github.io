define(
  function (require) {
    var $ = require('jquery-private');
    var dev = require('dev');

    return Object.freeze(
      {
        blockElement: function () {
          return ne($('.calculator'));
        },

        calculatorButtonElements: function () {
          return ne($('.calculator__button'));
        },

        line1Element: function () {
          return ne($('.calculator__line1'));
        },

        line2Element: function () {
          return ne($('.calculator__line2'));
        },
      }
    );

      /**
        * "ne" is short for "non-empty".
        * @param {jQuery} jq
        * @return {jQuery} - same as the 'jq' parameter
        * @throws {Error}
        */
    function ne(jq) {
      if (jq.length >= 1) {
        return jq;
      } else {
        var msg = 'Failed to find expected element or elements';
        dev.console.error(msg);
        dev.console.trace();
        throw new Error(msg);
      }
    }
  }
);
