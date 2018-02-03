require(
  ['global', 'test/run_tests'],
  function (global, run_tests) {
    run_tests();

    if (global.console && global.console.timeEnd) {
      global.console.timeEnd('QUnit test suite');
    }
  }
);
