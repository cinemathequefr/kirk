$(function() {

  memory.init($(".container"));



  $(window).on("resize", function () { memory.start(); });
  $(window).trigger("resize");




});



