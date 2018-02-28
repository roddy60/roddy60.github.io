define(
  function () {
    /**
      * @class
      * @param {jQuery} triangle_time_elapsed_indicator_element
      */
    function Class(triangle_time_elapsed_indicator_element) {
      this._triangle_time_elapsed_indicator_element =
        triangle_time_elapsed_indicator_element;
    }

    Class.prototype.setBottomArea = function (fraction) {
      /*
        To know where the arithmetic in this function comes from, see the
        comment at the end of this file.
      */
      var h_1 = 100;
      var b = fraction;
      var h_2 = Math.sqrt(h_1 * h_1 * (1 - b));

      var new_height = (h_1 - h_2) + '%';

      this._triangle_time_elapsed_indicator_element.css(
        'height',
        new_height
      );
    };

    return Class;
  }
);

/*
  In this application, we have an equilateral triangle.  Let T_1 denote this
  triangle, let A_1 denote its area, and let h_1 denote its height.

  We propose to draw a horizontal line through the triangle, creating
  another equilateral triangle, with a varying height.  Let T_2 denote this
  triangle, let A_2 denote its area, and let h_2 denote its height.

  Let b denote the ratio of two areas, as follows.  The first area is T1
  exclusive of T2 (in other words, that part of triangle T1 which is below
  the base of triangle T2).  The second area is A1.  We are given b and we
  need to derive h_2.

  Clearly,

    b = (A_1 - A_2) / A_1

  :. b = 1 - A_2 / A_1

  The area of an equilateral triangle is proportional to the square of its
  height. Therefore,

    A_2 / A_1 = h_2^2 / h_1^2

  :. b = 1 - h_2^2 / h_1^2

  :. h_2^2 = h_1^2 * (1 - b)

  :. h_2 = sqrt(h_1^2 * (1 - b))

  In the method called 'setBottomArea', above, we rely on the above
  equation.

  Since T_1 in our application has a height of 100% (that is, a value of
  100% for the CSS 'height' property), we say:

    h_1 = 100

  :. h_2 = sqrt(100^2 * (1 - b))

  A quick check: the last equation gives:

    b = 0 => h_2 = 100
    b = 1 => h_2 = 0

  Both are correct.
*/
