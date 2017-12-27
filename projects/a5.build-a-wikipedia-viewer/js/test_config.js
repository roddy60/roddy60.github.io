define(
  ['Config', 'config/test/config'],
  function (Config, test_config_settings) {
    return new Config(test_config_settings);
  }
);
