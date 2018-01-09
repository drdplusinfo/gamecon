function (spravovanaData) {

  var omluva = 'Omlouváme se, nastala chyba při komunikaci se serverem.'

  var vyhrazenaPromenna = '<vyhrazenaPromenna>'

  // jestli je to json objekt
  function isObject (item) {
    return (typeof item === "object" && !Array.isArray(item) && item !== null);
  }

  var zmenData = function (data, selektor, novaHodnota) {
    var jsSelektor = selektor.replace(
      /\[([^=]+)=([^\]]+)\]/g,
      '.find(function(e) { return e.$1 == $2 })'
    )

    // selektor musí být safe data ze serveru
    var staraHodnota = eval('data.' + jsSelektor)

    if (isObject(novaHodnota)) {
      // u objektů se pouze nové atributy přidají / nahradí do původního objektu
      for (atribut in novaHodnota) {
        staraHodnota[atribut] = novaHodnota[atribut]
      }
    } else {
      // u primitivních typů se hodnota přímo nahradí novou hodnotou
      // to ale znamená najít "rodičovský" objekt dané staré hodnoty a v něm
      // upravit požadovaný atribut
      alert('TODO')
      throw 'TODO'
    }
  }

  var zpracujOdpoved = function (odpoved, callback) {
    if (spravovanaData && odpoved.zmenaDat) {
      for (klic in odpoved.zmenaDat) {
        zmenData(spravovanaData, klic, odpoved.zmenaDat[klic])
      }
    }

    callback(odpoved.obsah)
  }

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
        zpracujOdpoved(JSON.parse(this.responseText), callback)
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

} (<spravovanaDataPromenna>)
