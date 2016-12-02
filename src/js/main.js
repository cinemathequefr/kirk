$(function () {
  "use strict";

  // var pairCount = 50;
  var pairCount = 32;
  var boardDims = _(squarest(pairCount, 2)).sortBy().value(); // (Sorting makes it vertical somehow)
  var at = arrayListConverter(boardDims[1]); // Two conversion functions: at.coords, at.index (NB: at.index may not be useful here)
  var $rootEl = $(".container").eq(0);

  var queue = new createjs.LoadQueue(false); // http://stackoverflow.com/questions/33699468/preloadjs-to-pass-to-background-image
  queue.setMaxConnections(10);
  queue.loadManifest(_(new Array(pairCount)).map(function (e, i) { return ("img/" + i + ".jpg"); }).value());

  // queue.on("complete", function () {
  //   console.log("Hey");
  // });

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


  // Testing board size
  boardSize(106);

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
  .appendTo($rootEl);

  // Place cards
  
  _(list).forEach(function (card, i) {
    window.setTimeout(function () {
      // $("<div class='card back rotate'>" + card.value + "</div>")
      $("<div class='card back rotate' title='" + card.value + "'></div>")
      .data("card", card)
      .css({
        marginTop: _.random(3, 6) + "px",
        marginLeft: _.random(3, 6) + "px",
        backgroundImage: "url(img/" + card.value +".jpg)"
      })
      .appendTo($("#i" + i));
      window.setTimeout(function () { $("#i" + i).children(".card").removeClass("rotate"); }, 10);
    }, i * 25);
  });

  // window.setTimeout(ready, list.length * 25);

  queue.on("complete", ready);

  function ready() {
    // console.log("Ready");
    $(".board").on("click", ".card", function (e) {
      play($(e.target));
    });
  }


  function play($card) {
    var card  = $card.data("card");

    if (card.state === 0) {
      $card.removeClass("back").addClass("face");
      card.state = 1;
    } else if (card.state === 1) {
      $card.addClass("back").removeClass("face");
      card.state = 0;
    }

    // if (card.state === 0 && step() < 2) {
    //   $card.removeClass("back").addClass("face");
    //   card.state = step() + 1;
    //   if (step() === 2) {
    //   }
    // }

  }


  function step() {
    return _(list).filter(function (c) { return c.state === 1 || c.state === 2; }).value().length;
  }


  function getCard(f) {
    return _(list).find(f);
  }


  // function pair() {
  //   var c1 = getCard({ state: 1 });
  //   var c2 = getCard({ state: 2 });
  //   if (c1.)
  //   return (c1.value === c2.value && c1.value !== undefined ? [c1, c2] : null); // WARNING: Maybe don't do this?
  // }

/*
  function isPair() {
    var v1 = getCard({ state: 1 }).value;
    var v2 = getCard({ state: 2 }).value;
    return v1 === v2 && v1 !== undefined;
  }
*/


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


  /**
   * boardSize
   * @param minCellSize <Int> : the minimum pixel size of a side (we're dealing with squares) of the desired table cell
   * @return {}
   */
  function boardSize(minCellSize) {
    var boardSizePx = Math.min($(window).width(), $(window).height());
    var maxRows = Math.floor(boardSizePx / minCellSize);
    var rowsCount = _.reduce([10, 8, 6, 4, 2], function (acc, i) { // This finds the most adequate value
      return (acc <= maxRows ? acc : i);
    });
    var cellSizePx = math.floor(boardSizePx / rowsCount);
    return {
      rowsCount: rowsCount,
      cellSizePx: cellSizePx
    };
  }






});