/*
  The methods of the class below are a subset of those of the 'Dom' class.
  Each method here does nothing but delegate to the method of the same name
  on the 'Dom' class.
*/
define(
  function () {
    /**
      * @constructor
      */
    function Class(dom) {
      this._DOM = dom;
    }

    [
      'clearMessage',
      'highlightColour',
      'pauseTrack',
      'playColourSound',
      'playSound',
      'setButtonText',
      'showErrorMessage',
      'showNumSteps',
      'showVictoryMessage',
      'unhighlightColour',
      'unhighlightColourAll',
    ].forEach(
      function (method_name) {
        Class.prototype[method_name] = function () {
          return this._DOM[method_name].apply(this._DOM, arguments);
        };
      }
    );

    return Class;
  }
);
