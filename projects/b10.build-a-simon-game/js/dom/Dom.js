define(
  function (require) {
    var finder = (function (C) { return new C; })(require('dom/Finder'));

    function Class(clock) {
      this._clock = clock;

      this._scheduled_pauses = [];

      this._button_click_action = no_op;
      this._checkbox_click_action = no_op;
      this._colour_click_action = no_op;
      this._audio_stop_action = no_op;
      this._css_transition_end_action = no_op;

      this._colour_sound_end_times = [];

      var dom = this;

      finder.buttonElement().addEventListener(
        'click',
        function () {
          dom._button_click_action.call();
        }
      );

      finder.colourSquareElements().forEach(
        function (element, index) {
          element.addEventListener(
            'click',
            function () {
              dom._colour_click_action.call(null, index);
            }
          );
        }
      );

      finder.checkboxElement().addEventListener(
        'change',
        function (event) {
          dom._checkbox_click_action.call(null, event.target.checked);
        }
      );

      [
        finder.errorMessageElement(),
        finder.victoryMessageElement(),
      ].forEach(
        function (message_element) {
          message_element.addEventListener(
            'transitionend',
            function () {
              dom._css_transition_end_action.call();
            }
          );
        }
      );

      finder.allAudioElements().forEach(
        function (audio) {
          audio.addEventListener(
            'ended',
            function () {
              dom._handleAudioStop();
            }
          );
        }
      );

      finder.colourSquareElements().forEach(
        function (audio, colour_index) {
          audio.addEventListener(
            'playing',
            function () {
              if (dom._colour_sound_end_times[colour_index]) {
                var wait_time =
                  dom._colour_sound_end_times[colour_index] -
                  audio.currentTime;
                if (wait_time > 0) {
                  dom._schedulePause(
                    function () {
                      audio.pause();
                      dom._colour_sound_end_times[colour_index] = null;
                      dom._handleAudioStop();
                    },
                    wait_time * 1e3
                  );
                }
              }
            }
          );
        }
      );
    }

    Class.prototype.clearMessage = function () {
      this.showErrorMessage('');
      this.showVictoryMessage('');
    };

    Class.prototype.highlightColour = function (colour_index) {
      finder.colourSquareElements()[colour_index].classList.add(
        'simon__colour-square--highlight'
      );
    };

    /** Pause any track that is playing */
    Class.prototype.pauseTrack = function () {
      finder.allAudioElements().forEach(
        function (audio) {
          audio.pause();
        }
      );
      this._unscheduleAllPauses();
    };

    /**
      * @param {string} action
      */
    Class.prototype.playColourSound = function (colour_index, action) {
      var audio1 = finder.colourSquareAudioElements()[colour_index];

      if (audio1.error) {
        throw audio1.error;
      }

      switch (action) {
        case 'show':
          audio1.currentTime = 0;
          audio1.play();
        break;

        case 'accept':
          if (!Number.isFinite(audio1.duration)) {
            audio1.currentTime = 0;
            audio1.play();
          } else {
            var desired_clip_duration = 0.25;
            /*
              0.1 was tried, but wasn't long enough.  0.2 was also tried,
              but didn't seem to be long enough either.

              Of course, the choice of duration depends on the sounds that
              one is using.
            */

            if (audio1.duration <= desired_clip_duration) {
              audio1.currentTime = 0;
              audio1.play();
            } else {
              var start_time =
                (audio1.duration - desired_clip_duration) / 2;
              this._colour_sound_end_times[colour_index] =
                start_time + desired_clip_duration;
              audio1.currentTime = start_time;
              audio1.play();
            }
          }
        break;

        case 'reject':
          var audio2 = finder.errorBeepElement();
          if (audio2.error) {
            throw audio2.error;
          }
          audio2.currentTime = 0;
          audio2.play();
        break;
      }
    };

    /**
      * @param {string} sound
      */
    Class.prototype.playSound = function (sound) {
      switch (sound) {
        case 'out_of_time':
          var audio = finder.outOfTimeSoundElement();
          if (audio.error) {
            throw audio.error;
          }
          audio.currentTime = 0;
          audio.play();
        break;

        default:
          throw new Error('unrecognized sound');
      }
    };

    Class.prototype.reveal = function () {
      finder.blockElement().classList.remove('simon--loading');
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setAudioStopAction = function (action) {
      this._audio_stop_action = action;
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setButtonClickAction = function (action) {
      this._button_click_action = action;
    };

    Class.prototype.setButtonText = function (button_text) {
      finder.buttonElement().textContent = button_text;
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setCheckboxClickAction = function (action) {
      this._checkbox_click_action = action;
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setColourClickAction = function (action) {
      this._colour_click_action = action;
    };

    /**
      * @param {Function} action
      */
    Class.prototype.setCssTransitionEndAction = function (action) {
      this._css_transition_end_action = action;
    };

    Class.prototype.showErrorMessage = function (message) {
      show_message(finder.errorMessageElement(), message);
    };

    Class.prototype.showNumSteps = function (num_steps) {
      finder.numStepsElement().textContent = num_steps;
    };

    Class.prototype.showVictoryMessage = function (message) {
      show_message(finder.victoryMessageElement(), message);
    };

    Class.prototype.uncheckCheckbox = function () {
      finder.checkboxElement().checked = false;
    };

    Class.prototype.unhighlightColour = function (colour_index) {
      finder.colourSquareElements()[colour_index].classList.remove(
        'simon__colour-square--highlight'
      );
    };

    Class.prototype.unhighlightColourAll = function (colour_index) {
      for (var colour_index in finder.colourSquareElements()) {
        this.unhighlightColour(colour_index);
      }
    };

    Class.prototype._handleAudioStop = function () {
      this._audio_stop_action.call();
    };

    /**
      * @param {Function} action
      * @param {number} wait_time
      */
    Class.prototype._schedulePause = function (action, wait_time) {
      this._scheduled_pauses.push(
        this._clock.setTimeout(action, wait_time)
      );
    };

    Class.prototype._unscheduleAllPauses = function () {
      this._scheduled_pauses.forEach(
        function (id) {
          this._clock.clearTimeout(id);
        },
        this
      );
      this._scheduled_pauses = [];
    };

    return Class;

    function no_op() {}

    /**
      * Note that, because of the way we have implemented CSS transitions,
      * the CSS transition won't work unless the element is changing from
      * empty to non-empty.
      *
      * @param {Element} element
      */
    function show_message(element, message) {
      element.textContent = message;
      if (message === '') {
        element.style.removeProperty('transition-duration');
      } else {
        var duration = Math.min(10, Math.max(1, message.length * 0.0652));
        //< Give the user enough time to read the message
        element.style.setProperty('transition-duration', duration + 's');
      }
      /*<
        The reason for having a transition is that it keeps the user's mind
        occupied while he waits for the message to go away.
      */
    }
  }
);
