require(
  ['test/run_tests'],
  function (run_tests) {
    run_tests();

    console.timeEnd('QUnit test suite');
  }
);
