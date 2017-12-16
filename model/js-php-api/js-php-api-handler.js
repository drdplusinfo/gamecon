function () {

  var omluva = 'Omlouváme se, nastala chyba při komunikaci se serverem.'

  var vyhrazenaPromenna = '<vyhrazenaPromenna>'

  var zavolej = function (nazev, parametry, callback, callbackChyba) {
    var data = new FormData()
    data.append(vyhrazenaPromenna, JSON.stringify({
      metoda:     nazev,
      parametry:  parametry
    }))
    var url = location.pathname + (location.search ? location.search : '')

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (this.readyState != 4) return

      if (this.status == 200) {
        callback(JSON.parse(this.responseText))
      } else if (this.status == 400) {
        if (typeof callbackChyba == 'function') {
          callbackChyba(JSON.parse(this.responseText).chyba)
        } else {
          alert(omluva)
          throw 'Neošetřená chyba v ' + url
        }
      } else {
        alert(omluva)
      }
    }
    xhr.open('POST', location.protocol + '//' + location.host + url, true)
    xhr.send(data)
  }

  return <metody>

} ()
