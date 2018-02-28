define(
  {
    from_HMS: function () {
      var a = normalize(([]).slice.call(arguments));

      return (3600 * a[0] + 60 * a[1] + a[2]) * 1e3;

      function normalize(a) {
        return [0, 0, 0].concat(a).slice(-3);
      }
    },
  }
);
