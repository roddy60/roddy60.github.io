## Introduction

A [specification](https://roddy60.github.io/sites/1/specs/a2.build-a-personal-portfolio-webpage/)
is available for this project.

## Building

The style is implemented in Sass.  The following command was used to compile
the Sass into CSS:

```
sass style/scss/style.scss style/css/style.css
```

## Things to note

### Bootstrap

Bootstrap is not used.

### Pure

[Pure](https://purecss.io/),
a small CSS framework, is used,
to get `normalize.css` and button styling.

### Responsivity

The first and second sections of the page are "responsive".

The breakpoints for these 2 sections are different.  There is
no reason to make them the same.

### JavaScript

There is some JavaScript.  Its purpose is
to place the appropriate section directly
under the navbar when a button in the
navbar is clicked.

Note that freeCodeCamp's example at
[https://codepen.io/freeCodeCamp/full/YqLyXB](https://codepen.io/freeCodeCamp/full/YqLyXB)
does *not* have this behaviour: when one clicks a
button, the page scrolls, but when scrolling has finished, the
upper part of the destination section is obscured by the
navbar.
