define(
  function () {
    function Class(title, URL, extract, disambiguation) {
      this.title = title;
      this.URL = URL;
      this.extract = extract;
      this.disambiguation = disambiguation;
    }

    return Class;
  }
);
