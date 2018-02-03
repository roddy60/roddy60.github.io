define(
  function (require) {
    var $ = require('jquery-private');
    var dom_find = require('dom/dom_find');

    var BUTTON_FLASH_CLASS = 'calculator__button--just-clicked';
    var BUTTON_FLASH_DURATION = 100;

    function Class() {
      this._button_press_handler = $.noop;
      this._give_feedback_on_press = false;
      /** @member {Object<string, number>} */
      this._scheduled_tasks = {};

      dom_find.calculatorButtonElements().on(
        'click',
        $.proxy(this, '_processButtonPress')
      );
    }

    /** @param {boolean} new_value */
    Class.prototype.giveFeedbackOnPress = function (new_value) {
      this._give_feedback_on_press = Boolean(new_value);
    };

    Class.prototype.indicateIe11 = function (indication_wanted) {
      dom_find.blockElement().toggleClass(
        'calculator--ie11',
        indication_wanted
      );
    };

    Class.prototype.reveal = function () {
      dom_find.blockElement().removeClass('calculator--loading');
    };

    /** @param {Function} handler */
    Class.prototype.setButtonPressHandler = function (handler) {
      this._button_press_handler = handler;
    };

    /** @param {string} line1 */
    Class.prototype.setLine1 = function (line1) {
      dom_find.line1Element().text(line1);
    };

    /** @param {string} line2 */
    Class.prototype.setLine2 = function (line2) {
      dom_find.line2Element().text(line2);
    };

    /**
      * @param {Event} - a jQuery Event object
      */
    Class.prototype._processButtonPress = function (event) {
      var target = $(event.target);
      var button_text = target.text();

      if (this._give_feedback_on_press) {
        var delete_task = $.proxy(
          function () {
            clearTimeout(this._scheduled_tasks[button_text]);
            delete this._scheduled_tasks[button_text];
          },
          this
        );

        delete_task();

        target.addClass(BUTTON_FLASH_CLASS);

        this._scheduled_tasks[button_text] = setTimeout(
          function () {
            delete_task();
            target.removeClass(BUTTON_FLASH_CLASS);
          },
          BUTTON_FLASH_DURATION
        );
      }

      this._button_press_handler.call(null, button_text);
    };

    return Class;
  }
);
