define(
  [],
  function () {
    /*>
      Any of the fields in this class can be null.
    */
    /**
      * @param {Object} fields
      * @class
      */
    var Class = function (fields) {
      var field_names = [
        'country_code',
        'icon_URL',
        'place',
        'short_description',
        'temperature',
      ];

      field_names.forEach(
        function (name) {
          this[name] = fields[name] == null? null: fields[name];
        },
        this
      );
    };

    return Class;
  }
);
