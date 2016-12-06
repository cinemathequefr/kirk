$(function () {
  "use strict";

  var boardSize = calcBoardSize(96, 100);
  var pairCount = (boardSize.rowsCount * boardSize.rowsCount) / 2;
  var rowsCount = boardSize.rowsCount;
  var cellSizePx = boardSize.cellSizePx;
  var $rootEl = $(".container").eq(0);
  var game = [];
  var step = 0;
  var moves = 0;
  var at = (function (r) { // Converts board coordinates to list index
    return function (x, y) {
      return (x < r ? (r * y) + x : null);
    };
  })(rowsCount);

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

  var queue = new createjs.LoadQueue(true); // http://stackoverflow.com/questions/33699468/preloadjs-to-pass-to-background-image
  queue.setMaxConnections(10);
  queue.loadManifest(_(new Array(pairCount)).map(function (e, i) { return ("img/" + i + ".jpg"); }).value());

  // Build board
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


  function showFace($card) { // Turn a card on its face
    $card
      .removeClass("back")
      .addClass("face")
      .data("card")
      .state = 1;
  }


  function showBack($card) { // Turn a card (or more) on their back
    $card
      .removeClass("face")
      .addClass("back");
    $card.each(function () { // Possibly 2 cards
      $(this).data("card").state = 0;
    });
  }


  function play($card) {
    var card  = $card.data("card");

    if (step === 3 || step === 4) { // Face turned cards must be turned back before playing move
      if (card.state === 1) {
        showBack($card);
        step = step + 1;
      } else if (card.state === 0) { // Shortcut: but if player tries to continue playing, we do that automatically
        showBack(
          $(".card").filter(function () {
            return $(this).data("card").state === 1;
          })
        );
        step = 0;
      }
    }

    if (step === 0) {
      moves = moves + 1;
      $(".info").html("Coups joués&nbsp;: " + moves);
    }

    if (step === 0 || step === 1) { // Player can face turn a card
      if (card.state === 0) {
        showFace($card);
        game.push(card);
        step = step + 1;
      }
    }

    if (step === 2) { // Two cards are turned on their face
      if (game[game.length - 1].value === game[game.length - 2].value) { // Winning move
        $(".card").filter(function () {
          return $(this).data("card").value === game[game.length - 1].value;
        }).remove();
        step = 0;
      } else { // Losing move
        step = 3;
      }
    }

    if (step === 5) {
      step = 0;
    }
  }

});


/**
 * calcBoardSize
 * @param minCellSize <Int> : the minimum pixel size of a side (we're dealing with squares) of the desired table cell
 * @param verticalMargin <Int> : the overall pixel space to be left available vertically (for margins, etc.)
 * @return {}
 */
function calcBoardSize(minCellSize, verticalMargin) {
  verticalMargin = verticalMargin || 0;
  var boardSizePx = Math.min($(window).width(), $(window).height()) - verticalMargin;
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
