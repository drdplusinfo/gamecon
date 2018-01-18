/* -------------- ODKAZY NA NOVOU ZÁLOŽKU ------------------- */
$(function(){
  $('a[href^="http"]').attr('target', '_blank');
});

/* -------------- ODPOČET NA TITULCE ------------------- */
function odpocet(cas){
  if (cas) {
    var countDownDate = new Date(cas).getTime();
  }
  else {
    document.getElementById("infopruh_odpocet").style.display = "none";
  }

  function countdown() {
    var now = new Date().getTime(); // Get todays date and time
    var distance = countDownDate - now; // Find the distance between now an the count down date

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the elements
    if (distance > 0) {
      document.getElementById("odpocetDny").innerHTML = days;
      document.getElementById("odpocetHodiny").innerHTML = hours;
      document.getElementById("odpocetMinuty").innerHTML = minutes;
      //alert(seconds);
    }
    else {
      document.getElementById("odpocetDny").innerHTML = "0";
      document.getElementById("odpocetHodiny").innerHTML = "0";
      document.getElementById("odpocetMinuty").innerHTML = "0";
    }
  }

  countdown();
  var intervalID = setInterval(countdown, 5000); // Aktualizuj odpočet každých 5 sekund
};

function zmenPozadiNavbar(){
   if (document.getElementById('hlavniMenu').style.background == "black") {
     document.getElementById('hlavniMenu').style.background = "linear-gradient(black, rgba(255,255,255,0))";
   }
   else {
     document.getElementById('hlavniMenu').style.background = "black";
   }
   return false;
};

/* -------------- MASONRY ------------------- */
function displayMasonry() { //spočítej masonry a zobraz
  var $grid = $('.grid').masonry({
    columnWidth: 360,
    itemSelector: '.grid-item',
    gutter: 40,
    fitWidth: true
  });
  return $grid;
}

function displayToggleMasonry(aktivita) { //zobraz popis u aktivity a přepočítej celé masonry
  var $grid = displayMasonry();
  $('#'+aktivita+'_popis').slideToggle(200);
    setTimeout(function(){
      $grid.masonry('layout');
    }, 50);
    setTimeout(function(){
      $grid.masonry('layout');
    }, 100);
    setTimeout(function(){
      $grid.masonry('layout');
    }, 200);
  $('#'+aktivita+'_sipka_dolu').toggle();
  $('#'+aktivita+'_sipka_nahoru').toggle();
  return false;
}
