$(document).ready(

  /* This is the function that will get executed after the DOM is fully loaded */
  function () {
    /* maybe use jquery ui menu one day? ...
    $( ".nav ul" ).menu();
    */
    $('.nav li').hover(
      function () {
        $('ul', this).fadeIn();
      },
      function () {
        $('ul', this).fadeOut();
      }
    );
  }

);