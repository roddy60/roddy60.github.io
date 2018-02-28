require(
  ['dev', 'test/run_tests'],
  function (dev, run_tests) {
    run_tests();

    dev.console.timeEnd('QUnit test suite');
  }
);
