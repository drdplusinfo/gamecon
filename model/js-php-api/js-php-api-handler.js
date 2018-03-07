function () {

  var omluva = 'Omlouváme se, nastala chyba při komunikaci se serverem.'

  var vyhrazenaPromenna = '<vyhrazenaPromenna>'

  var zakladniData = <zakladniData>

  var observeri = [<observeri>]

  var apiObjekt = {
    zakladniData: zakladniData,
    zmenaZakladnichDat: function () {},
    <metody>
  }

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
      for (let atribut in novaHodnota) {
        staraHodnota[atribut] = novaHodnota[atribut]
      }
    } else {
      // u primitivních typů se hodnota přímo nahradí novou hodnotou
      eval('data.' + jsSelektor + ' = novaHodnota')
    }
  }

  var zpracujOdpoved = function (odpoved, callback) {
    if (zakladniData && odpoved.zmenaDat) {
      for (let klic in odpoved.zmenaDat) {
        zmenData(zakladniData, klic, odpoved.zmenaDat[klic])
      }
    }

    apiObjekt.zmenaZakladnichDat()
    observeri.forEach(function(observer) { observer() })
    if (typeof callback == 'function') {
      callback(odpoved.obsah)
    }
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
          callbackChyba(JSON.parse(this.responseText).obsah.chyba)
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

  return apiObjekt

} ()