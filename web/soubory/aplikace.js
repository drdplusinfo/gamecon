$(function(){

  $('a[href^="http"]').attr('target', '_blank');

});



//Date countdown
var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime(); //TO-DO: Předat jako parametr přes PHP

function Odpocet(){

  function Countdown() {
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

  Countdown();
  var intervalID = setInterval(Countdown, 5000); // Aktualizuj odpočet každých 5 sekund
};
