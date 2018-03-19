define(
  function () {
    /**
      * @constructor
      * @param {number} row
      * @param {number} col
      * @param {string} occupant
      */
    function Class(row, col, occupant) {
      this.row = row;
      this.col = col;
      this.occupant = occupant;
    }

    return Class;
  }
);
