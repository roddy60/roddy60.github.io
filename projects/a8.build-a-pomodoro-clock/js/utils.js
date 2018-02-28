define(
  {
    format_time: function (time_in_milliseconds) {
      var time_in_seconds = Math.round(time_in_milliseconds / 1e3);

      var seconds = time_in_seconds % 60;
      var tmp = (time_in_seconds - seconds) / 60;

      var minutes = tmp % 60;
      var tmp = (tmp - minutes) / 60;

      var hours = tmp;

      return sprintf(
        '%s%02d:%02d',
        hours === 0? '': hours + ':',
        minutes,
        seconds
      ).
      replace(/^0(.:..)$/, '$1');
    },
  }
);
