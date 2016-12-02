// window.bootstrap = function() {
//     angular.bootstrap(document, ['mean']);
// };

// window.init = function() {
//     window.bootstrap();
// };
if (window.location.hash == "#_=_") window.location.hash = "#!";
// $(document).ready(function() {
//     //Fixing facebook bug with redirect
    

//     //Then init the app
//     window.init();
// });
$(document).ready(function (){
// Smooth Scrolling  
  $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 900, 'swing', function () {
          window.location.hash = target;
      });
  });
});