define(
  function (require) {
    Class.DEFAULT_PRECISION = 6;
    Class.ERROR_RESULT = 'Error';

    /**
      * @class
      * @param {number} [precision]
      * @throws {RangeError} precision is out of range
      */
    function Class(precision) {
      if (arguments.length >= 1) {
        if (!Number.isFinite(precision)) {
          throw new Error('invalid precision: ' + precision);
        }

        var range_error_caught = false;
        try {
          (1).toFixed(precision);
        } catch (e) {
          range_error_caught = e instanceof RangeError;
        }
        if (range_error_caught) {
          throw new RangeError('precision out of range: ' + precision);
        }
      }

      this._precision =
        arguments.length >= 1? precision: Class.DEFAULT_PRECISION;

      this._clearDisplay();
    }

    Class.prototype.getPrecision = function () {
      return this._precision;
    };

    /** @return {string} */
    Class.prototype.line1 = function () {
      return this._line1;
    };

    /** @return {string} */
    Class.prototype.line2 = function () {
      return this._line2;
    };

    /**
      * @param {string} button_text
      * @return {void}
      */
    Class.prototype.press = function (button_text) {
      switch (button_text) {
        case 'AC':
          this._clearDisplay();
        break;

        case 'CE':
          if (this._haveResult()) {
            this._clearDisplay();
          } else {
            this._line2 = this._line2.slice(0, -1);
            this._line1 = extract_last_number(this._line2);
          }
        break;

        case '=':
          if (!this._haveResult() && this._line2 &&
            is_digit_or_dot(this._lastCharOfLine2()))
          {
            var result_for_user = this._evaluationResult();
            this._line2 += '=' + result_for_user;
            this._line1 = result_for_user;
          }
        break;

        case '+':
        case '-':
        case '×':
        case '÷':
          var cur_result = this._currentResult();
          if (cur_result === Class.ERROR_RESULT) {
            break;
          } else if (cur_result !== null) {
            this._line2 = cur_result;
          }

          if (button_text !== '-') {
            if (this._line2 &&
              is_digit_or_dot(this._lastCharOfLine2()))
            {
              this._line2 += button_text;
            }
          } else {
            this._line2 = trim_double_unary_minus(this._line2 + '-');
            this._line1 = extract_last_number(this._line2);
          }
        break;

        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          if (this._haveResult()) {
            this._clearDisplay();
          }

          this._line2 += button_text;
          this._line1 = extract_last_number(this._line2);
        break;

        case '.':
          if (this._haveResult()) {
            this._clearDisplay();
          }

          this._line2 +=
            this._line2.match(/\.\d*$/)? '':
              (this._line2.match(/^$|[-+×÷]$/)? '0.': '.');
          /*<
            A decimal point should always be preceded by a digit, to ensure
            that it is not overlooked.  We ensure this by adding a zero if
            needs be.
          */

          this._line1 = extract_last_number(this._line2);
        break;
      }
    };

    Class.prototype._clearDisplay = function () {
      this._line1 = '';
      this._line2 = '';
    };

    /** @return {(null|string)} */
    Class.prototype._currentResult = function () {
      var index = this._line2.lastIndexOf('=');
      return index === -1? null: this._line2.slice(index + 1);
    };

    /** @return {string} */
    Class.prototype._evaluationResult = function () {
      var error_obj = null;
      try {
        var num = evaluate(this._line2);
      } catch (e) {
        error_obj = e;
      }

      if (error_obj || !Number.isFinite(num)) {
        return Class.ERROR_RESULT;
      } else {
        var tmp = (num).toFixed(this._precision);
        if (tmp.lastIndexOf('e') === -1) {
          return tmp.replace(/\.?0*$/, '');
        } else {
          return Class.ERROR_RESULT;
        }
      }
    };

    Class.prototype._haveResult = function () {
      return this._line2.lastIndexOf('=') >= 0;
      /*
        It's not necessary to check for an empty result (i.e. where the
        equals sign is the last character of _line2), because this should
        never happen.
      */
    };

    Class.prototype._lastCharOfLine2 = function () {
      return this._line2.slice(-1) || null;
    };

    return Class;

    /**
      * @param {string} expr
      * @return {number}
      */
    function evaluate(expr) {
      if (0) {
        throw new Error('test');
      }

      var expr2 = evaluatable(expr);

      if (0) {
        if (window.ft_log) {
          ft_log.log(expr2);
        }
      }

      return eval(expr2);

      function evaluatable(expr) {
        var result = expr;

        result = result.replace(/×/g, '*').replace(/÷/g, '/');

        result = result.replace(/-/g, ' - ');
        /*<
          Because an expression such as "1--2" is a syntax error in
          JavaScript.
        */

        result = fix_leading_zeroes(result);

        return result;

        function fix_leading_zeroes(expr) {
          return (
            expr.
              replace(/(^|[-+*\/])[\s0]+([1-9])/g, '$1$2').
              replace(/(^|[-+*\/])(\s*)0{2,}\./g, '$1$020.')
          );
          /*<
            A number with superfluous leading zeroes is either on octal
            number or a syntax error (for example, "00.1").  Such numbers
            are fixed by the above code.
          */
        }
      }
    }

    /**
      * @param {string} expression
      * @return {string}
      */
    function extract_last_number(expression) {
      var regexes = [   // Order is important in this array
        /(?:^|[-+×÷])(-)$/,
        /^(-?[\d.]+)[^\d.]*$/,
        /[-+×÷](-[\d.]+)[^\d.]*$/,
        /([\d.]+)[^\d.]*$/,
      ];
      for (var i = 0; i < regexes.length; i++) {
        var matches = expression.match(regexes[i]);
        if (matches) {
          return matches[1];
        }
      }
      return '';
    }

    function is_digit_or_dot(s) {
      return Boolean(s.match(/^[\d.]$/));
    }

    function trim_double_unary_minus(expression) {
      return expression.replace(/([-+×÷])--$/, '$1');
    }
  }
);
