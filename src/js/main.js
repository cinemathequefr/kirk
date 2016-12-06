$(function () {
  "use strict";

  var boardSize = calcBoardSize(96, 24);
  var pairCount = (boardSize.rowsCount * boardSize.rowsCount) / 2;
  var rowsCount = boardSize.rowsCount;
  var cellSizePx = boardSize.cellSizePx;
  var $rootEl = $(".container").eq(0);

  var at = (function (r) { // Converts board coordinates to list index
    return function (x, y) {
      return (x < r ? (r * y) + x : null);
    };
  })(rowsCount);


  var queue = new createjs.LoadQueue(true); // http://stackoverflow.com/questions/33699468/preloadjs-to-pass-to-background-image
  queue.setMaxConnections(10);
  queue.loadManifest(_(new Array(pairCount)).map(function (e, i) { return ("img/" + i + ".jpg"); }).value());

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

  $([
    "<table class='board' style='width:" + (rowsCount * cellSizePx) + "px; height: " + (rowsCount * cellSizePx) + "px;'>",
    _(new Array(rowsCount)).map(function () {
      var y = arguments[1];
      return [
        "<tr>",
        _(new Array(rowsCount)).map(function () {
          var x = arguments[1];
          var i = at(x,y);
          var card = list[i];
          return [
            "<td id='i" + i + "' style='width:" + cellSizePx + "px; height:" + cellSizePx + "px;'>",
            "<div class='card loading' style='width:" + (cellSizePx - 6) + "px; height:" + (cellSizePx - 6) + "px; margin-top: " + _.random(3, 6) + "px; margin-left: " + _.random(3, 6) + "px; background-image:url(img/" + card.value + ".jpg)' data-card='" + JSON.stringify(card) + "'></div>",
            "</td>"
          ].join("");
        }).join(""),
        "</tr>"
      ].join("");
    }).join(""),
    "</table>"
  ].join(""))
  .appendTo($rootEl);

  queue.on("complete", ready);

  function ready() {

    _(list).forEach(function (card, i) {
      window.setTimeout(function () {
        $(".card").eq(i).addClass("back").removeClass("loading");
      }, (i * 25));
    });

    window.setTimeout(function () {
      $(".board").on("click", ".card", function (e) {
        play($(e.target));
      });
    }, (list.length * 25));

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
  }

});

/**
 * boardSize
 * @param minCellSize <Int> : the minimum pixel size of a side (we're dealing with squares) of the desired table cell
 * @param verticalMargin <Int> : the pixel space to be used as vertical margin (will be doubled: top and bottom)
 * @return {}
 */
function calcBoardSize(minCellSize, verticalMargin) {
  verticalMargin = verticalMargin || 0;
  var boardSizePx = Math.min($(window).width(), $(window).height()) - (2 * verticalMargin);
  var maxRows = Math.floor(boardSizePx / minCellSize);
  var rowsCount = _.reduce([10, 8, 6, 4, 2], function (acc, i) { // This finds the most adequate value
    return (acc <= maxRows ? acc : i);
  });
  var cellSizePx = Math.floor(boardSizePx / rowsCount);

  return {
    rowsCount: rowsCount,
    cellSizePx: cellSizePx
  };
}


// function pair() {
//   var c1 = getCard({ state: 1 });
//   var c2 = getCard({ state: 2 });
//   if (c1.)
//   return (c1.value === c2.value && c1.value !== undefined ? [c1, c2] : null); // WARNING: Maybe don't do this?
// }


// function isPair() {
//   var v1 = getCard({ state: 1 }).value;
//   var v2 = getCard({ state: 2 }).value;
//   return v1 === v2 && v1 !== undefined;
// }
