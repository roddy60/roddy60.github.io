define(
  function () {
    /**
      * This class is used for synthesizing a SimonEvent called
      * 'audio_stop_and_css_transition_end', when audio_stop and
      * css_transition_end have been received.
      *
      * @constructor
      */
    function Class() {
      this._init();
    }

    Class.prototype.clearEvent = function () {
      this._init();
    };

    Class.prototype.getEventName = function () {
      return 'audio_stop_and_css_transition_end';
    };

    Class.prototype.haveEvent = function () {
      return this._events.audio_stop && this._events.css_transition_end;
    }

    /**
      * @param {string} simon_state
      * @param {string} event_name
      * @return {void}
      */
    Class.prototype.update = function (simon_state, event_name) {
      if (this._start_simon_state &&
        this._start_simon_state !== simon_state)
      {
        this._init();
      }

      if (event_name === 'audio_stop' ||
        event_name === 'css_transition_end')
      {
        if (!this._start_simon_state) {
          this._start_simon_state = simon_state;
        }

        this._events[event_name] = true;
      }
    }

    Class.prototype._init = function () {
      this._start_simon_state = null;
      this._events = {};
    };

    return Class;
  }
);
