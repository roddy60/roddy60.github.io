define(
  function (require) {
    var global = require('global');

    return Object.freeze(
      {
        console:
          global.console ||
          {
            assert: noop,
            error: noop,
            info: noop,
            log: noop,
            time: noop,
            timeEnd: noop,
            trace: noop,
            warn: noop,
          },

        dumpBoard: function (board) {
          this.console.debug(board2s(board));
        },
      }
    );

    function board2s(board) {
      return board.map(
        function (a) {
          return a.map(empty_string_to_dot).join('');
        }
      ).join('\n') + '\n'

      function empty_string_to_dot(s) {
        return s === ''? '.': s;
      }
    }

    function noop() {}
  }
);
