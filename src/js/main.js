$(function() {

  memory.init($(".container"));



  $(window).on("resize", memory.start);
  $(window).trigger("resize");




});



