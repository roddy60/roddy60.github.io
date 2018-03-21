BEST PLAY

This application makes no effort to find the best move, since that behaviour
is not required by the specification.

BETTER GAMEPLAY

For better gameplay, uncheck the checkbox labelled "... automatically start
new game".  (It's checked initially because that's required, on my reading
of the specification.)

UNIT TESTS

This application comes with unit tests.  To run them, load the following
file into a web browser:

  tests/qunit/index.html

SASS TO CSS

If you are working on the Sass files, you will need to have the following
command running to see the effect of your changes:

  sass --watch style/tic-tac-toe/scss:generated/style/tic-tac-toe/css

It compiles Sass files to CSS.

During initial development, the version of Sass used was 3.4.25.
