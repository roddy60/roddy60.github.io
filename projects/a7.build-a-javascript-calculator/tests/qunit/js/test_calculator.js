define(
  function (require) {
    var Calculator = require('Calculator');
    var QUnit = require('vendor/QUnit');

    return function () {
      var PRECISION = Calculator.DEFAULT_PRECISION;
      var SCIENTIFIC_NOTATION_REGEX = /^[1-9](\.\d+)?e[-+]\d+$/;
      var SMALLEST_POSITIVE_NUMBER_AS_STRING =
        '0.' + '0'.repeat(PRECISION - 1) + '1';

      QUnit.module(
        "'Calculator' class",
        {
          beforeEach: function () {
            this.calc = new Calculator;
          },
        }
      );

      // Invalid button texts: start

      test(
        'Invalid button text',
        ['1', 'ACE'],
        '1',
        '1'
      );

      test(
        'Invalid button text: superscript one',
        ['\u00B9'],
        '',
        ''
      );

      test(
        'Invalid button text: digit 1 full stop',
        ['\u2488'],
        '',
        ''
      );

      // Invalid button texts: end

      // Basic tests: start

      test(
        'Display is initially empty',
        '',
        '',
        ''
      );

      test(
        'Multidigit number',
        '1 + 2345',
        '2345',
        '1+2345'
      );

      test(
        'Addition',
        '1 + 2 =',
        '3',
        '1+2=3'
      );

      test(
        'Subtraction',
        '1 - 2 =',
        '-1',
        '1-2=-1'
      );

      test(
        'Sequence ending in digit and binary minus',
        '1 -',
        '1',
        '1-'
      );

      test(
        'Binary minus',
        '1 - 2',
        '2',
        '1-2'
      );

      test(
        'Multiplication',
        '1 × 2 =',
        '2',
        '1×2=2'
      );

      test(
        'Division',
        '6 ÷ 2 =',
        '3',
        '6÷2=3'
      );

      test(
        'Multidigit term',
        '1 + 23 =',
        '24',
        '1+23=24'
      );

      test(
        'Zeroes followed by dot',
        '100.0 =',
        '100',
        '100.0=100'
      );

      // Basic tests: end

      // Trickier tests: start

      test(
        'Initial minus',
        '-',
        '-',
        '-'
      );

      test(
        'Unary minus',
        '-100+-10--20=',
        '-90',
        '-100+-10--20=-90'
      );

      test(
        'Precedence',
        '1 + 2 × 3 =',
        '7',
        '1+2×3=7'
      );

      var expected_result = (1 / 6).toFixed(PRECISION);
      test(
        'Associativity',
        '1 ÷ 2 ÷ 3 =',
        expected_result,
        '1÷2÷3=' + expected_result
      );

      test(
        'Decimal display (1)',
        '.',
        '0.',
        '0.'
      );

      test(
        'Decimal display (2)',
        '.1',
        '0.1',
        '0.1'
      );

      test(
        'Decimal sum',
        '.1 + .2 =',
        '0.3',
        '0.1+0.2=0.3'
      );

      test(
        'Using result (1)',
        '1 + 20 + 300 = +',
        '321',
        '321+'
      );

      test(
        'Using result (2)',
        '1 + 20 + 300 = + 4000 =',
        '4321',
        '321+4000=4321'
      );

      test(
        'Zero is displayed as "0"',
        SMALLEST_POSITIVE_NUMBER_AS_STRING + ' ÷ 10 =',
        '0',
        SMALLEST_POSITIVE_NUMBER_AS_STRING + '÷10=0'
      );
      /*<
        What we are checking here is that zero is not displayed
        as something like "0.000000".
      */

      test(
        'There is no "hidden precision"',
        SMALLEST_POSITIVE_NUMBER_AS_STRING + ' ÷ 10 = × 10 =',
        '0',
        '0×10=0'
      );

      var long_expression = '10' + '×10'.repeat(308);
      var expected_result = Calculator.ERROR_RESULT;
      test(
        'Expression that overflows JS Number',
        long_expression + '=',
        expected_result,
        long_expression + '=' + expected_result
      );

      test(
        'Division by zero',
        '1 ÷ 0 =',
        'Error',
        '1÷0=Error'
      );

      test(
        'Cancellation of minuses (1)',
        '1 + - -',
        '1',
        '1+'
      );

      test(
        'Cancellation of minuses (2)',
        '1 + 2 + 3 + - -',
        '3',
        '1+2+3+'
      );

      test(
        'Cancellation of minuses (3)',
        '1 + 2 + -34.5 + - -',
        '-34.5',
        '1+2+-34.5+'
      );

      test(
        'Equals-sign twice',
        '1 = =',
        '1',
        '1=1'
      );

      test(
        'Number with 2 decimal points',
        '1.2.3',
        '1.23',
        '1.23'
      );

      test(
        'JS decrement operator',
        '10--200=',
        '210',
        '10--200=210'
      );

      test(
        'Triple minus',
        '10---200=',
        '-190',
        '10-200=-190'
      );

      /*>
        The next two tests check whether a number can be emitted in
        scientific notation, which Number#toFixed can do in certain
        circumstances and which we *don't* want to see here.

        The second of these tests may be needless, since Number#toFixed
        seems not to use scientific notation in this case.
      */

      (
        function () {
          var expression = '1' + (' × 10').repeat(150);
          QUnit.test(
            'Huge number',
            function (assert) {
              //> Given

              //> When

              send_presses(this.calc, expression + '=');
              var line1 = this.calc.line1();

              //> Then

              assert.ok(typeof line1 === 'string');
              assert.ok(line1);
              assert.notOk(line1.match(SCIENTIFIC_NOTATION_REGEX));
            }
          );
        }
      ).call();

      (
        function () {
          var expression = '1' + (' ÷ 10').repeat(150);
          QUnit.test(
            'Tiny number',
            function (assert) {
              //> Given

              //> When

              send_presses(this.calc, expression + '=');
              var line1 = this.calc.line1();

              //> Then

              assert.ok(typeof line1 === 'string');
              assert.ok(line1);
              assert.notOk(line1.match(SCIENTIFIC_NOTATION_REGEX));
            }
          );
        }
      ).call();

      // Trickier tests: end

      // Octal numbers: start

      test(
        'Octal numbers not recognised',
        '011 =',
        '11',
        '011=11'
      );

      test(
        '"Bad" octal numbers not recognised',
        '08 + 09 =',
        '17',
        '08+09=17'
      );

      test(
        '"Octal number" with decimal',
        '01. + 0 =',
        /*<
          The expression before the equals sign, considered as a JavaScript
          expression, produces a syntax error.
        */
        '1',
        '01.+0=1'
      );

      // Octal numbers: end

      // Hexadecimal numbers: start

      test(
        'Hexadecimal number',
        '0x11 =',
        '11',
        '011=11'
      );

      // Hexadecimal numbers: end

      // Number ending in dot: start

      test(
        'Number ending in dot',
        '1.=',
        '1',
        '1.=1'
      );

      test(
        'Expression containing number ending in dot (1)',
        '1 + 20. + 300 =',
        '321',
        '1+20.+300=321'
      );

      test(
        'Expression containing number ending in dot (2)',
        '1 + 2.=',
        '3',
        '1+2.=3'
      );

      // Number ending in dot: end

      // AC: start

      test(
        'AC clears all',
        '1 + 2 AC',
        '',
        ''
      );

      // AC: end

      // CE: start

      test(
        'CE clears digit',
        '1 + 2 + 3 CE',
        '2',
        '1+2+'
      );

      test(
        'CE and multidigit number',
        '1 + 2 + 345 CE',
        '34',
        '1+2+34'
      );

      test(
        'CE clears operator',
        '1 + 2 + 3 + CE',
        '3',
        '1+2+3'
      );

      test(
        'CE and sequence of operators',
        '1 + 2 + 3 - + + CE CE',
        '2',
        '1+2+'
      );

      test(
        'CE operating on result of previous calculation',
        '1 + 20 = CE',
        '',
        ''
      );

      test(
        'Dot then CE',
        '. CE',
        '0',
        '0'
      );

      // CE: end

      // After "Error" result: start

      test(
        'Digit after "Error"',
        '1 / 0 = 5',
        '5',
        '5'
      );

      test(
        'Dot after "Error"',
        '1 / 0 = .',
        '0.',
        '0.'
      );

      test(
        'AC after "Error"',
        '1 ÷ 0 = AC',
        '',
        ''
      );

      test(
        'Operator after "Error"',
        '1 ÷ 0 = +',
        'Error',
        '1÷0=Error'
      );

      test(
        'CE after "Error"',
        '1 ÷ 0 = CE',
        '',
        ''
      );

      // After "Error" result: end

      test_arithmetic();

      test_precision();

      test_with_erroneous_input();
    };

    //> This has been tested manually
    /**
      * @param {string} button_texts - a sequence of button presses
      * @return {Array<string>} - the same sequence, as an array
      */
    function button_texts_s2a(button_texts) {
      return (
        button_texts.
        replace(/\s+/g, '').
        split(/([-+×÷.=0-9]|AC|CE)/).
        filter(Boolean)
      );
    }

    /**
      * @return {boolean}
      */
    function precision_out_of_range(precision) {
      var range_error_caught = false;
      try {
        (1).toFixed(precision);
      } catch (e) {
        range_error_caught = e instanceof RangeError;
      }
      return range_error_caught;
    }

    /**
      * @param {Calculator} calculator
      * @param {(Array<string>|string)} presses
      */
    function send_presses(calculator, presses) {
      var presses_as_array =
        Array.isArray(presses)?
        presses:
        (typeof presses === 'string'? button_texts_s2a(presses): null);
      presses_as_array.forEach(
        function (button_text) {
          calculator.press(button_text);
        }
      );
    }

    /**
      * @param {(Array<string>|string)} button_texts
      */
    function test(title, button_texts, expected_line_1, expected_line_2)
    {
      QUnit.test(
        title,
        function (assert) {
          send_presses(this.calc, button_texts);
          assert.strictEqual(
            this.calc.line1(),
            expected_line_1,
            'Line 1 is ' + expected_line_1
          );
          assert.strictEqual(
            this.calc.line2(),
            expected_line_2,
            'Line 2 is ' + expected_line_2
          );
        }
      );
    }

    function test_arithmetic() {
      test_expression('10 + 3 * 99');

      test_expression('1024 / 2 / 2 - 3');

      test_expression('6 / 3 / 4');

      test_expression('0.125 * 8 * 10');
    }

    /**
      * @param {string} expression - a valid JavaScript arithmetic
      * expression.  (Take care, because only some expressions will yield a
      * working test.  Read the source of this function to find out what you
      * can and can't pass.)
      */
    function test_expression(expression) {
      var expression_for_calculator =
        expression.replace(/\*/g, '×').replace(/\//g, '÷');
      var expected_result = eval(expression).toString();
      QUnit.test(
        'Expression: ' + expression,
        function (assert) {
          send_presses(this.calc, expression_for_calculator + '=');
          assert.strictEqual(this.calc.line1(), expected_result);
        }
      );
    }

    function test_precision() {
      (
        function () {
          var precision = 1000;
          if (precision_out_of_range(precision)) {
            QUnit.test(
              'Precision too high for JS',
              function (assert) {
                assert.throws(
                  function () {
                    new Calculator(precision);
                  },
                  RangeError
                );
              }
            );
          }
        }
      ).call();

      [4, 5, 13, 16].forEach(
        function (precision) {
          test2(
            {
              title: 'Precision set to ' + precision,
              calculator: new Calculator(precision),
              button_texts: '1 ÷ 9 =',
              line1: '0.' + '1'.repeat(precision),
            }
          );
        }
      );

      (
        function () {
          var precision = 20;
          /*<
            Twenty is the largest value which an ECMAScript implementation is
            required to support for the parameter of Number.prototype.toFixed.
            See the ECMAScript Standard, Edition 5.1, section 15.7.4.5, pages
            168-169.
          */
          QUnit.test(
            'Precision set to ' + precision,
            function (assert) {
              var calc = new Calculator(precision);
              send_presses(calc, '1 ÷ 9 =');
              var line1 = calc.line1();
              assert.strictEqual(Number(line1), 1 / 9);
              /*<
                We can't test the string value of line1, because different
                browsers return different values for (1 / 9).toFixed(20).
                For example, IE11 returns "0.11111111111111110000", whereas
                Firefox ESR 52.6.0 returns "0.11111111111111110494".
              */
            }
          );
        }
      ).call();

      test2(
        {
          title: 'Precision: rounding down',
          calculator: new Calculator(4),
          button_texts: '11 114 ÷ 100 000 =',
          line1: '0.1111',
        }
      );

      test2(
        {
          title: 'Precision: rounding up',
          calculator: new Calculator(4),
          button_texts: '11 116 ÷ 100 000 =',
          line1: '0.1112',
        }
      );
    }

    function test_with_erroneous_input() {
      test(
        'Error (1)',
        '=',
        '',
        ''
      );

      test(
        'Error (2)',
        '+ + +',
        '',
        ''
      );

      test(
        'Error (3)',
        '1 + 2 + +',
        '2',
        '1+2+'
      );

      test(
        'Error (4)',
        '1 + =',
        '1',
        '1+'
      );

      test(
        'Error (5)',
        '...',
        '0.',
        '0.'
      );

      test(
        'Error (6)',
        '+-+',
        '-',
        '-'
      );
    }

    /**
      * @param {Object} options
      */
    function test2(options) {
      check_options(options);

      QUnit.test(
        options.title,
        function (assert) {
          var calc = options.calculator || this.calc;

          send_presses(calc, options.button_texts);

          if (!options.hasOwnProperty('line1') &&
            !options.hasOwnProperty('line2'))
          {
            assert.expect(0);
          } else {
            if (options.hasOwnProperty('line1')) {
              assert.strictEqual(
                calc.line1(),
                options.line1,
                'Line 1 is ' + options.line1
              );
            }
            if (options.hasOwnProperty('line2')) {
              assert.strictEqual(
                calc.line2(),
                options.line2,
                'Line 2 is ' + options.line2
              );
            }
          }
        }
      );

      function check_options(options) {
        var required_keys = ['title'];
        required_keys.forEach(
          function (opt_name) {
            if (!options.hasOwnProperty(opt_name)) {
              throw new Error(
                "'options' object lacks '" + opt_name + "' property"
              );
            }
          }
        );
      }
    }
  }
);
