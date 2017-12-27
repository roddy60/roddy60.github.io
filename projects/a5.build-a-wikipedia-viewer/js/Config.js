define(
  ['jquery-private'],
  function ($) {
    /** @param {Object} settings */
    function Class(settings) {
      this._settings = $.extend(true, {}, settings);
    }

    /**
      * @return {this}
      */
    Class.prototype.delete = function (setting_name) {
      delete this._settings[setting_name];
      return this;
    };

    /** @return {*} - null if we don't have the setting */
    Class.prototype.get = function (setting_name) {
      return (
        this._settings.hasOwnProperty(setting_name)?
        this._settings[setting_name]:
        null
      );
    };

    /** @return {boolean} */
    Class.prototype.has = function (setting_name) {
      return this._settings.hasOwnProperty(setting_name);
    };

    Class.prototype.print = function () {
      var keys = Object.keys(this._settings);
      keys.sort();
      console.info.apply(console, keys.reduce(add_pair.bind(this), []));

      function add_pair(acc, key) {
        acc.push(key + ':', this._settings[key]);
        return acc;
      }
    };

    /**
      * @param {*} [context]
      * @return {void}
      */
    Class.prototype.process = function (setting_name, func, context) {
      if (this.has(setting_name)) {
        var setting_value = this.get(setting_name);
        var extra_func_args = [].slice.call(arguments, 3);
        var func_args = [setting_value].concat(extra_func_args);
        func.apply(context, func_args);
      }
    };

    /**
      * @param {string} name
      * @return {this}
      */
    Class.prototype.set = function (name, value) {
      this._settings[name] = value;
      return this;
    };

    return Class;
  }
);
