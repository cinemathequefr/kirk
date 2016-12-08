var memory = (function () {
  var $rootEl;
  var data = [
    { id: 0, title: "The Strange Love of Martha Ivers", titleFr: "L'Emprise du crime", director: "Lewis Milestone", year: "1946" },
    { id: 1, title: "The Bad and the Beautiful", titleFr: "Les Ensorcelés", director: "Vincente Minnelli", year: "1952" },
    { id: 2, title: "Champion", titleFr: "Le Champion", director: "Mark Robson", year: "1949" },
    { id: 3, title: "20,000 Leagues Under the Sea", titleFr: "20 000 lieues sous les mers", director: "Richard Fleischer", year: "1954" },
    { id: 4, title: "A Letter to Three Wives", titleFr: "Chaînes conjugales", director: "Joseph L. Mankiewicz", year: "1948" },
    { id: 5, title: "Un acte d'amour", titleFr: "", director: "Anatole Litvak", year: "1953" },
    { id: 6, title: "The Arrangement", titleFr: "L'Arrangement", director: "Elia Kazan", year: "1969" },
    { id: 7, title: "The Brotherhood", titleFr: "Les Frères siciliens", director: "Martin Ritt", year: "1968" },
    { id: 8, title: "The Vikings", titleFr: "Les Vikings", director: "Richard Fleischer", year: "1957" },
    { id: 9, title: "The Fury", titleFr: "Furie", director: "Brian De Palma", year: "1978" },
    { id: 10, title: "Out of the Past", titleFr: "La Griffe du passé", director: "Jacques Tourneur", year: "1946" },
    { id: 11, title: "In Harm's Way", titleFr: "Première victoire", director: "Otto Preminger", year: "1964" },
    { id: 12, title: "Saturn 3", titleFr: "", director: "Stanley Donen", year: "1980" },
    { id: 13, title: "There Was a Crooked Man", titleFr: "Le Reptile", director: "Joseph L. Mankiewicz", year: "1970" },
    { id: 14, title: "The Arrangement", titleFr: "L'Arrangement", director: "Elia Kazan", year: "1969" },
    { id: 15, title: "The Brotherhood", titleFr: "Les Frères siciliens", director: "Martin Ritt", year: "1968" },
    { id: 16, title: "Paris brûle-t-il", titleFr: "", director: "René Clément", year: "1965" },
    { id: 17, title: "Seven Days in May", titleFr: "Sept jours en mai", director: "John Frankenheimer", year: "1963" },
    { id: 18, title: "Lonely Are the Brave", titleFr: "Seuls sont les indomptés", director: "David Miller", year: "1961" },
    { id: 19, title: "Two Weeks in Another Town", titleFr: "Quinze jours ailleurs", director: "Vincente Minnelli", year: "1961" },
    { id: 20, title: "The Last Sunset", titleFr: "El Perdido", director: "Robert Aldrich", year: "1960" },
    { id: 21, title: "The Strange Love of Martha Ivers", titleFr: "L'Emprise du crime", director: "Lewis Milestone", year: "1946" },
    { id: 22, title: "Big Sky", titleFr: "La Captive aux yeux clairs", director: "Howard Hawks", year: "1951", pk: 32591 },
    { id: 23, title: "Along the Great Divide", titleFr: "Une corde pour te pendre", director: "Raoul Walsh", year: "1951" },
    { id: 24, title: "The Final Countdown", titleFr: "Nimitz, retour vers l'enfer", director: "Don Taylor", year: "1979" },
    { id: 25, title: "Lust for Life", titleFr: "La Vie Passionnée de Vincent van Gogh", director: "Vincente Minnelli", year: "1955" },
    { id: 26, title: "Ulisse", titleFr: "Ulysse", director: "Mario Camerini", year: "1953" },
    { id: 27, title: "Ace in the Hole", titleFr: "Le Gouffre aux chimères", director: "Billy Wilder", year: "1951" },
    { id: 28, title: "Spartacus", titleFr: "", director: "Stanley Kubrick", year: "1959" },
    { id: 29, title: "Paths of Glory", titleFr: "Les Sentiers de la gloire", director: "Stanley Kubrick", year: "1957" },
    { id: 30, title: "Detective Story", titleFr: "Histoire de détective", director: "William Wyler", year: "1951" }, 
    { id: 31, title: "Man Without a Star", titleFr: "L'Homme qui n'a pas d'étoile", director: "King Vidor", year: "1954" }
  ];

  var game, step, moves, pairsFound, pairCount, isStarted, timer, elapsed;



  function init(_$rootEl) {
    $rootEl = _$rootEl.eq(0);
  }

  function start() {
    var boardSize = calcBoardSize(96, 108);
    pairCount = (boardSize.rowsCount * boardSize.rowsCount) / 2;
    var rowsCount = boardSize.rowsCount;
    var cellSizePx = boardSize.cellSizePx;
    var at = (function (r) { // Converts board coordinates (x, y) to list index (i)
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

    game = [];
    step = 0;
    moves = 0;
    pairsFound = 0;
    isStarted = false;
    elapsed = 0;

    // Build board
    $rootEl.html([
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
      "</table>",
      "<div class='messageContainer'></div>"
    ].join(""));

    updateInfo();

    $(".container").on("click", ".btnContinue", function () {
      $(".messageContainer").fadeOut(125, function () {
        enablePlay();
        startTimer();
      });
    });

    queue.on("complete", function () {
      _(list).forEach(function (card, i) {
        window.setTimeout(function () {
          $(".card").eq(i).addClass("back").removeClass("loading");
        }, (i * 25));
      });

      window.setTimeout(function () {
        enablePlay();
      }, (list.length * 25));
    });

  }


  function enablePlay() {
    $(".card").removeClass("disabled");
    $(".board").off("click").on("click", ".card", function (e) { // Bug: on event gets bound twice? Try to turn it off first.
      play($(e.target));
    });
  }

  function disablePlay() {
    $(".board").off("click");
    $(".card").addClass("disabled");
  }

  function play($card) {
    var card  = $card.data("card");
    var $foundPair;

    if (isStarted === false) {
      // timer = window.setInterval(function () {
      //   elapsed = elapsed + 1;
      //   updateInfo();
      // }, 1000);
      startTimer();
      isStarted = true;
    }


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
      updateInfo();
    }

    if (step === 0 || step === 1) { // Player can face turn a card
      if (card.state === 0) {
        showFace($card);
        game.push(card);
        step = step + 1;
      }
    }

    if (step === 2) { // Two cards are turned on their face
      var value = game[game.length - 1].value; // Value of the card just turned
      if (value === game[game.length - 2].value) { // Winning move

        pairsFound = pairsFound + 1;
        disablePlay();
        updateInfo();

        if (pairCount - pairsFound === 0) {
          stopTimer();
          // window.clearInterval(timer);
          // TODO: end game
        }

        $foundPair = $(".card").filter(function () {
          return $(this).data("card").value === value;
        });

        $foundPair.addClass("animated bounceIn");

        window.setTimeout(function () {
          $foundPair.remove();
          step = 0;
          message(messagePairFound(value));
        }, 1000);


      } else { // Losing move
        step = 3;
      }
    }

    if (step === 5) {
      step = 0;
    }

  }

  function startTimer() {
    timer = window.setInterval(function () {
      elapsed = elapsed + 1;
      updateInfo();
    }, 1000);
  }

  function stopTimer() {
    window.clearInterval(timer);
  }

  function updateInfo() {
    $("td.moves").html(moves);
    $("td.pairsLeft").html(pairCount - pairsFound);
    $("td.time").html((Math.floor(elapsed / 60)) + ":" + ("00" + (elapsed % 60)).substr(-2, 2));
    // $("td.time").html((Math.floor(elapsed / 60)) + ":" + (elapsed % 60));
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

  function message(msg) {
    stopTimer();
    disablePlay();
    $(".messageContainer").html(msg).show();
  }

  function messagePairFound(value) {
    var film = _(data).find({ "id": value });
    var title = ((film.titleFr !== "" && film.titleFr !== film.title) ? "&ldquo;" + film.titleFr + "&rdquo; (&ldquo;" + film.title + "&rdquo;)" : "&ldquo;" + film.title + "&rdquo;");
   return [
      "<img src='img/" + value + ".jpg' style='height: 100%;'><div style='position: relative; overflow: hidden;'>Kirk Douglas dans " + title + " de " + film.director + ", " + film.year +  "<div class='btnContinue'>Continuer</div></div>"
    ].join("");
  }



  // calcBoardSize
  // @param minCellSize <Int> : the minimum pixel size of a side (we're dealing with squares) of the desired table cell
  // @param vSpace <Int> : the overall pixel space to be left available vertically (for margins, etc.)
  // @return {}
  function calcBoardSize(minCellSize, vSpace) {
    vSpace = vSpace || 0;
    var boardSizePx = Math.min($(window).width(), $(window).height()) - vSpace;
    var maxRows = Math.floor(boardSizePx / minCellSize);
    var rowsCount = _.reduce([8, 6, 4], function (acc, i) { // This finds the most adequate value
      return (acc <= maxRows ? acc : i);
    });
    return {
      rowsCount: rowsCount,
      cellSizePx: Math.floor(boardSizePx / rowsCount)
    };
  }




  return {
    init: init,
    start: start
  };
})();


