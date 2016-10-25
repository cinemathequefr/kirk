$(function () {
  "use strict";

  var pairCount = 50;
  var boardDims = _(squarest(pairCount, 2)).sortBy().value(); // (Sorting makes it vertical somehow)
  var at = arrayListConverter(boardDims[0]); // Two conversion functions: at.coords, at.index (NB: at.index may not be useful here)


  var list = _(new Array(pairCount * 2))
    .map(function (a, i) {
      return {
        value: Math.floor(i / 2),
        index: i % 2,
        state: 0
      };
    })
    .shuffle()
    .value();

  // Create board
  $([
    "<table class='board'>",
    _(new Array(boardDims[0])).map(function () {
      var y = arguments[1];
      return [
        "<tr>",
        _(new Array(boardDims[1])).map(function () {
          var x = arguments[1];
          return "<td id='i" + at.coords(x, y) + "'></td>";
        }).join(""),
        "</tr>"
      ].join("");
    }).join(""),
    "</table>"
  ].join(""))
  .appendTo("body");

  // Place cards
  
  _(list).forEach(function (card, i) {
    window.setTimeout(function () {
      // $("<div class='card rotate'>" + card.value + "</div>")
      $("<div class='card back rotate'></div>")
      .data("card", card)
      .css({
        marginTop: _.random(0, 3) + "px",
        marginLeft: _.random(0, 3) + "px",
        backgroundImage: "url(img/" + card.value +".jpg)"
      })
      .appendTo($("#i" + i));
      window.setTimeout(function () { $("#i" + i).children(".card").removeClass("rotate"); }, 10);
    }, i * 25);
  });

  window.setTimeout(ready, list.length * 25);

  function ready() {
    $(".board").on("click", ".card", function (e) {
      play($(e.target));
    });
  }

  function play($card) {
    var card  = $card.data("card");
    if (card.state === 0) {
      $card
        .removeClass("back")
        .addClass("face")
        .css({ backgroundImage: "url(img/" + card.value +".jpg)" });
      card.state = 1;
    } else if (card.state === 1) {
      $card
        .removeClass("face")
        .addClass("back");
      card.state = 0;
    }
  }


  /*
   * squarest
   * Given the dimensions of a 2-dimensional array, returns the dimensions of the "squarest" 2-dim array having the same number of elements
   * @param a <Int> size of the 1st dimension
   * @param b <Int> size of the 1nd dimension
   * @return <[Int, Int]> dimensions of the "squarest" equivalent array
   * Examples: squarest(4, 25) => [10, 10], squarest(2, 25) => [5, 10], squarest(2, 11) => [2, 11]
   */
  function squarest(a, b) {
    var sq = a * b;
    var x, y = x = Math.floor(Math.sqrt(sq));
    return (function t(x, y) {
      return (x * y === sq ? [x, y] : (x * y < sq ? t(x, y + 1) : t(x - 1, y)));
    })(x, y);
  }


  /**
   * arrayListConverter
   * Imagine that we fill a 2-dimensional array of a given width with the elements from a list, from left to right, then top to bottom.
   * This returns two conversion functions:  from list index to array coordinates, and vice versa.
   * @param w <Int>: the width of the two-dimensional array
   * @return ({ coords: <Function>, index: <Function> })
   * Function coords @param x, y <Int, Int>: array coordinates
   * Function coords @return <Int>: list index
   * Function index @param i <Int>: list index
   * Function index @return x, y <Int, Int>: array coordinates
   */
  function arrayListConverter(w) {
    if (w < 1) return null;
    return {
      coords: function (x, y) { return (x < w ? (w * y) + x : null); },
      index: function (i) { return [i % w, Math.floor(i / w)]; }
    };
  }






});