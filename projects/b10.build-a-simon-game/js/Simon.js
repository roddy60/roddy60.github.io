define(
  function (require) {
    var EventSynthesis = require('EventSynthesis');
    var SimonEvent = require('SimonEvent');
    var ld = require('vendor/lodash');

    /**
      * @param {Object} [options]
      */
    function Class(clock, colour_sequence, ui, options) {
      this._clock = clock;
      this._colour_sequence = colour_sequence;
      this._ui = ui;

      var default_options = {
        time_before_new_sequence: 1.2e3,
        time_between_two_steps: 100,
        wait_time_for_colour_click: 5e3,
        total_steps_final: 20,
      };

      var final_options = ld.assign({}, default_options, options || {});
      for (var i in default_options) {
        this['_' + i] = final_options[i];
      }

      this._strict = false;
      this._total_steps_initial = 1;

      /*
        The following are the variables that can change after this
        constructor returns.
      */

      this._saved_strict = null;
      this._total_steps_current = null;
      this._current_step = null;
      this._state = 'initial';
      this._game_never_started = true;
      this._timeout_IDs = [];
      this._out_of_time_event_ID = null;
      this._event_synthesis = new EventSynthesis;
      this._rejected_colour_index = null;
    }

    Class.prototype.handleAudioStop = function () {
      this._handleEvent(new SimonEvent('audio_stop'));
    };

    Class.prototype.handleButtonClick = function () {
      this._handleEvent(new SimonEvent('button_click'));
    };

    /**
      * @param {boolean} checked - true iff the checkbox is checked
      */
    Class.prototype.handleCheckboxClick = function (checked) {
      this._handleEvent(
        new SimonEvent('checkbox_click', { checked: checked })
      );
    };

    Class.prototype.handleColourClick = function (colour_index) {
      this._handleEvent(
        new SimonEvent('colour_click', { colour_index: colour_index })
      );
    };

    Class.prototype.handleCssTransitionEnd = function () {
      this._handleEvent(new SimonEvent('css_transition_end'));
    };

    /**
      * @return {void}
      * @throws {Error}
      */
    Class.prototype._checkInvariants = function () {
      if (this._current_step !== null && (this._current_step < 1 ||
        this._current_step > this._total_steps_current))
      {
        throw new Error(
          'out-of-range: _current_step: ' + this._current_step
        );
      }

      if (this._out_of_time_event_ID !== null &&
        this._timeout_IDs.indexOf(this._out_of_time_event_ID) === -1)
      {
        throw new Error('_out_of_time_event_ID is unregistered');
      }
    };

    /**
      * @param {SimonEvent} event
      */
    Class.prototype._handleEvent = function (event) {
      this._event_synthesis.update(this._state, event.type);

      var new_event_name = null;
      if (this._event_synthesis.haveEvent()) {
        new_event_name = this._event_synthesis.getEventName();
        this._event_synthesis.clearEvent();
      }

      this._handleEvent2(event);

      if (new_event_name) {
        this._handleEvent2(
          new SimonEvent(new_event_name)
        );
      }
    };

    /**
      * @param {SimonEvent} event
      */
    Class.prototype._handleEvent2 = function (event) {
      switch (event.type) {
        case 'button_click':
          if (this._game_never_started) {
            this._ui.setButtonText('NEW GAME');
          }
          this._state = 'showing_step';
          this._startNewGame();
          this._game_never_started = false;
        break;

        case 'checkbox_click':
          this._strict = event.checked;
        break;

        default:
          var array = get_state_transition_info()[this._state];
          if (array[0]) {
            var new_state = array[0].call(this, event);
            if (new_state !== undefined) {
              if (array[1]) {
                array[1].call(this, new_state, event);
              }
              this._state = new_state;
            }
          }
      }

      this._checkInvariants();
    };

    /**
      * @param {Function} action
      * @param {number} delay_time
      * @return {number}
      */
    Class.prototype._schedule = function (action, delay_time) {
      var new_ID = this._clock.setTimeout(action, delay_time);
      this._timeout_IDs.push(new_ID);
      return new_ID;
    };

    /** @return {void} */
    Class.prototype._scheduleOutOfTimeEvent = function () {
      this._out_of_time_event_ID = this._schedule(
        this._handleEvent.bind(
          this,
          new SimonEvent('out_of_time')
        ),
        this._wait_time_for_colour_click
      );
    };

    /**
      * @param {string} action
      * @param {number} [colour_index]
      */
    Class.prototype._showColour = function (action, colour_index) {
      var colour_index2 =
        typeof colour_index === 'number'?
        colour_index:
        this._colour_sequence.item(this._current_step - 1);
      this._ui.highlightColour(colour_index2);
      this._ui.playColourSound(colour_index2, action);
    };

    Class.prototype._showNumSteps = function () {
      this._ui.showNumSteps(this._total_steps_current);
    };

    Class.prototype._startNewGame = function () {
      var c = this._clock;
      this._timeout_IDs.forEach(c.clearTimeout.bind(c));
      this._timeout_IDs = [];

      this._out_of_time_event_ID = null;

      this._event_synthesis = new EventSynthesis;

      /*>
        At time of writing, this group of instance variables shouldn't need
        to be reinitialized -- but there's no harm in doing so.
      */
      this._saved_strict = null;
      this._rejected_colour_index = null;

      this._ui.unhighlightColourAll();
      this._ui.clearMessage();
      this._ui.pauseTrack();

      this._total_steps_current = this._total_steps_initial;
      this._current_step = 1;
      this._showNumSteps();

      this._colour_sequence.generate();
      this._showColour('show');
    };

    Class.prototype._unscheduleOutOfTimeEvent = function () {
      if (this._out_of_time_event_ID !== null) {
        ld.pull(this._timeout_IDs, this._out_of_time_event_ID);
      }
      this._clock.clearTimeout(this._out_of_time_event_ID);
      this._out_of_time_event_ID = null;
    };

    return Class;

    /*
      For a diagram of the state transition graph, see this file:

        generated/state-transitions.png

      In that diagram, the colour of an arc indicates the name of the event
      that produced the transition.
    */
    /** @return Object<string, Array<Function>> */
    function get_state_transition_info() {
      /*
        For code review, the following is probably the best order in which
        to check the states:

          initial
          showing_step
          between_2_steps
          awaiting_step
          accepting_step
          rejecting_step
          out_of_time
          waiting_before_showing_steps
          user_victorious

        In the object literal below, the state names are in ASCII order.
      */

      return {
        accepting_step: [
          function (event) {
            if (event.type === 'audio_stop') {
              return (
                this._current_step < this._total_steps_current?
                'awaiting_step':
                (this._total_steps_current < this._total_steps_final?
                'waiting_before_showing_steps':
                'user_victorious')
              );
            }
          },

          function (new_state) {
            var colour_index =
              this._colour_sequence.item(this._current_step - 1);
            this._ui.unhighlightColour(colour_index);

            switch (new_state) {
              case 'awaiting_step':
                this._current_step++;
                this._scheduleOutOfTimeEvent();
              break;

              case 'waiting_before_showing_steps':
                this._schedule(
                  this._handleEvent.bind(
                    this,
                    new SimonEvent('end_of_waiting_before_showing_steps')
                  ),
                  this._time_before_new_sequence
                );
              break;

              case 'user_victorious':
                this._ui.showVictoryMessage('YOU WON!');
              break;
            }
          },
        ],

        awaiting_step: [
          function (event) {
            switch (event.type) {
              case 'colour_click':
                var current_colour_index =
                  this._colour_sequence.item(this._current_step - 1);
                return (
                  current_colour_index === event.colour_index?
                  'accepting_step':
                  'rejecting_step'
                );
              break;

              case 'out_of_time':
                return 'out_of_time';
              break;
            }
          },

          function (new_state, event) {
            switch (new_state) {
              case 'accepting_step':
                this._unscheduleOutOfTimeEvent();
                this._showColour('accept');
              break;

              case 'rejecting_step':
                this._unscheduleOutOfTimeEvent();
                this._saved_strict = this._strict;
                this._ui.showErrorMessage(
                  this._strict?
                  'WRONG BUTTON!  NEW GAME WILL START.':
                  'WRONG BUTTON!'
                );
                this._rejected_colour_index = event.colour_index;
                this._showColour('reject', event.colour_index);
              break;

              case 'out_of_time':
                this._ui.showErrorMessage(
                  'YOU WAITED TOO LONG\u00A0— SEQUENCE WILL BE SHOWN AGAIN'
                );
                this._ui.playSound('out_of_time');
              break;
            }
          },
        ],

        between_2_steps: [
          function (event) {
            if (event.type === 'end_of_between_2_steps') {
              return 'showing_step';
            }
          },

          function () {
            //> This should never be true
            if (this._current_step >= this._total_steps_current) {
              throw new Error;
            }

            this._current_step++;
            this._showColour('show');
          },
        ],

        initial: [],

        out_of_time: [
          function (event) {
            if (event.type === 'audio_stop_and_css_transition_end') {
              return 'showing_step';
            }
          },

          function () {
            this._ui.clearMessage();
            this._current_step = 1;
            this._showColour('show');
          },
        ],

        rejecting_step: [
          function (event) {
            if (event.type === 'audio_stop_and_css_transition_end') {
              return 'showing_step';
            }
          },

          function () {
            this._ui.unhighlightColour(this._rejected_colour_index);
            this._rejected_colour_index = null;

            if (this._saved_strict) {
              this._total_steps_current = this._total_steps_initial;
              this._showNumSteps();
            }
            this._saved_strict = null;

            this._current_step = 1;
            this._ui.clearMessage();
            this._showColour('show');
          },
        ],

        showing_step: [
          function (event) {
            if (event.type === 'audio_stop') {
              return (
                this._current_step < this._total_steps_current?
                'between_2_steps':
                'awaiting_step'
              );
            }
          },

          function (new_state) {
            var colour_index =
              this._colour_sequence.item(this._current_step - 1);
            this._ui.unhighlightColour(colour_index);

            switch (new_state) {
              case 'between_2_steps':
                this._schedule(
                  this._handleEvent.bind(
                    this,
                    new SimonEvent('end_of_between_2_steps')
                  ),
                  this._time_between_two_steps
                );
              break;

              case 'awaiting_step':
                this._current_step = 1;
                this._scheduleOutOfTimeEvent();
              break;
            }
          },
        ],

        user_victorious: [
          function (event) {
            if (event.type === 'css_transition_end') {
              return 'showing_step';
            }
          },

          function () {
            this._ui.clearMessage();
            this._startNewGame();
          },
        ],

        waiting_before_showing_steps: [
          function (event) {
            if (event.type === 'end_of_waiting_before_showing_steps') {
              return 'showing_step';
            }
          },

          function () {
            this._total_steps_current++;
            this._showNumSteps();
            this._current_step = 1;
            this._showColour('show');
          },
        ],
      };
    } // end of: function get_state_transition_info()
  }
); // end of: define
