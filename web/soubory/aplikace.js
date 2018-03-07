/* -------------- ZOBRAZOVÁNÍ SKRYTÝCH DIVŮ ----------------- */
function zobrazSkryj (event) {
  $('#' + event.target.id + '-obsah').slideToggle()
  event.preventDefault()
}


/* -------------- ODKAZY NA NOVOU ZÁLOŽKU ------------------- */
$(function () {
  $('a[href^="http"]').attr('target', '_blank')
})

/* -------------- ZMĚNA POZADÍ MENU NA MOBILU ---------------- */
function zmenPozadiNavbar (){
  if (document.getElementById('hlavniMenu').style.background === 'black') {
    document.getElementById('hlavniMenu').style.background = 'linear-gradient(black, rgba(255,255,255,0))'
    document.getElementById('hlavniMenu').style.marginBottom = '-51px'
  } else {
    document.getElementById('hlavniMenu').style.background = 'black'
    document.getElementById('hlavniMenu').style.marginBottom = '0px'
  }
  return false
};

/* Změna nápisu na homepage na mobilu */
function zmenZakladniInfo () {
  if (window.matchMedia('(max-width: 576px)').matches) {
    document.getElementsByClassName('zakladniInfo_box-cislo-gamecon')[0].innerHTML = 'Gamecon'
  } else {
    document.getElementsByClassName('zakladniInfo_box-cislo-gamecon')[0].innerHTML = 'GC'
  }
}

/* -------------- ODPOČET NA TITULCE ------------------- */
function odpocet(cas) {
  if (cas) {
    var countDownDate = new Date(cas).getTime()
  } else {
    document.getElementById('infopruh_odpocet').style.display = 'none'
  }

  function countdown() {
    var now = new Date().getTime() // Get todays date and time
    var distance = countDownDate - now // Find the distance between now an the count down date

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24))
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Display the result in the elements
    if (distance > 0) {
      document.getElementById('odpocetDny').innerHTML = days
      document.getElementById('odpocetHodiny').innerHTML = hours
      document.getElementById('odpocetMinuty').innerHTML = minutes
      document.getElementById('odpocetSekundy').innerHTML = seconds
    } else {
      document.getElementById('odpocetDny').innerHTML = '0'
      document.getElementById('odpocetHodiny').innerHTML = '0'
      document.getElementById('odpocetMinuty').innerHTML = '0'
      document.getElementById('odpocetSekundy').innerHTML = '0'
    }
  }

  countdown()
  setInterval(countdown, 1000) // Aktualizuj odpočet každých 5 sekund
};

/* -------------- MASONRY ------------------- */
function displayMasonry (gridName) { // spočítej masonry a zobraz
  $grid = $(gridName).masonry({
    columnWidth: 360,
    itemSelector: '.grid-item',
    gutter: 40,
    fitWidth: true
  })
  return $grid;
}

function displayToggleMasonry(aktivita, gridName) { //zobraz popis u aktivity a přepočítej celé masonry
  var $grid = displayMasonry(gridName);
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

/* -------------- SVG ZA INLINE SVG ------------------- */
/*
 * Převede všechny SVG obrázky na inline SVG
 */
 window.onload = function () {
   jQuery('img').filter(function() {
     return this.src.match(/.*\.svg$/);
   }).each(function(){
     var $img = jQuery(this);
     var imgID = $img.attr('id');
     var imgClass = $img.attr('class');
     var imgURL = $img.attr('src');

     jQuery.get(imgURL, function(data) {
       // Get the SVG tag, ignore the rest
       var $svg = jQuery(data).find('svg');

       // Add replaced image's ID to the new SVG
       if(typeof imgID !== 'undefined') {
         $svg = $svg.attr('id', imgID);
       }
       // Add replaced image's classes to the new SVG
       if(typeof imgClass !== 'undefined') {
         $svg = $svg.attr('class', imgClass+' replaced-svg');
       }

       // Remove any invalid XML tags as per http://validator.w3.org
       $svg = $svg.removeAttr('xmlns:a');

       // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
       if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
         $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
       }

       // Replace image with new SVG
       $img.replaceWith($svg);

     }, 'xml');
   });
 }
