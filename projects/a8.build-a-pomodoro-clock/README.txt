SPECIFICATION

The specification for this project is here:

  https://roddy60.github.io/sites/1/specs/a8.build-a-pomodoro-clock

SASS TO CSS

If you are working on the Sass files, you will need to have the following
command running to see the effect of your changes:

  sass --watch style/pomodoro/scss:generated/style/pomodoro/css

It compiles Sass files to CSS.

During initial development, the version of Sass used was 3.4.25.

UNIT TESTS

This application comes with unit tests.  To run them, load the following
file into a web browser:

  tests/qunit/index.html

ASSESSING THIS APPLICATION

For someone assessing this application, it may be useful to speed up time.
This can be done at the browser console, by calling pomodoro.clock.setRate.
For example, entering the following code at the browser console will cause
time in the application to run 100 times faster than true time:

  pomodoro.clock.setRate(100)

This method can be called at any time, and any number of times.  The new
rate takes effect immediately.
