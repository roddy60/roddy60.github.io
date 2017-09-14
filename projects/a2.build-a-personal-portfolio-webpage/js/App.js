function App() {}

App.prototype.run = function () {
  var that =  this;
  $(
    function () {
      that._clickables().on(
        'click',
        $.proxy(that, '_scroll')
      );
    }
  );
};

App.prototype._clickables = function () {
  return $('.navbar [data-destination]');
};

App.prototype._determineDestination = function (jq_obj) {
  return $('#' + jq_obj.data('destination'));
};

App.prototype._firstSection = function () {
  return $('#me');
};

App.prototype._scroll = function (event) {
  var destination = this._determineDestination($(event.target));

  var top1 = this._firstSection().offset().top;
  var top2 = destination.offset().top;
  var diff = top2 - top1;

  this._scrollPageTo(diff);
};

App.prototype._scrollPageTo = function (position) {
  $('html, body').animate({ scrollTop: position + 'px' }, 0);
  /*<
    From <https://stackoverflow.com/a/2275282>.

    If the selector is just "html", the code doesn't work in Chromium
    57.0.2987.98 -- no scrolling occurs.
  */
};
