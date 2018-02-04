SPECIFICATION

The specification for this project is here:

  https://roddy60.github.io/sites/1/specs/a6.use-twitchtv-json-api/

SASS TO CSS

During development, the following command should be running:

  sass --watch style/scss:generated/style/css

It compiles Sass files to CSS.

UNIT TESTS

This application comes with unit tests.  To run them, load the following
file into a web browser:

  tests/qunit/index.html

UNARY MINUS

The calculator accepts unary minus.

If a unary minus is entered that cancels out a preceding unary minus, both
are immediately removed.  (This may not have been a good decision.)  For
example, if you load the app and enter "1+--", that's the same as entering
only "1+", in the sense that the calculator's display will be the same in
either case.

Unary plus is not accepted.

AC AND CE

For the meaning of AC and CE, the source used was the following:

  https://www.quora.com/What-does-AC-and-CE-stand-for-on-calculators

According to that page, AC stands for "All Clear".  It "[c]lears the
calculator".

CE stands for "Clear Entry".  It "[e]rases the last number or operation
entered".