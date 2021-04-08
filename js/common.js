let cantLoad = 0;

$(document).ready(function () {
  $("#header").load("../views/common/header.html");
  $("#footer").load("../views/common/footer.html");
  getData();

  let query = document.querySelector("iframe");
  if (query) {
    query.addEventListener("load", function (e) {
      cantLoad += 1;
      if (cantLoad == 2) {
        $("#iframe").hide();
        $("#iframe").attr("height", "400px");
        $("#iframe").attr("src", "gracias.html");
        $("#iframe").show();
      }
    });
  }
});

function getData() {
  fetch("../json/db.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getAdopciones(data.mascotas.adopciones);
      getCasosEspeciales(data.mascotas.especiales);
      getRifas(data.rifas);
    });
}

class Slider {
  _slideIndex = 1;
  _id;

  constructor(id) {
    this._id = id;
  }

  move(n) {
    this._showDivs((this._slideIndex += n));
  }

  _showDivs(n) {
    let i;
    let fotos = $(`.slide_${this._id}`);

    if (n > fotos.length) {
      this._slideIndex = 1;
    }
    if (n < 1) {
      this._slideIndex = fotos.length;
    }
    for (i = 0; i < fotos.length; i++) {
      fotos[i].style.display = "none";
    }
    fotos[this._slideIndex - 1].style.display = "block";
  }
}

function abrirDialogo(idDialog) {
  $(idDialog)
    .dialog({
      autoOpen: false,
      modal: true,
      minWidth: 500,
      minHeight: "auto",
      maxHeight: 600,
      resizable: false,
      dialogClass: "dialog",
      show: {
        effect: "blind",
        duration: 1000,
      },
      hide: {
        effect: "explode",
        duration: 1000,
      },
      open: function (event, ui) {
        $("html").css("overflow", "hidden");
        $(".ui-widget-overlay").width($(".ui-widget-overlay").width() + 18);
      },
      close: function (event, ui) {
        $("html").css("overflow", "auto");
      },
    })
    .dialog("open");

  $(".ui-widget-overlay").click(function () {
    $(idDialog).dialog("close");
  });
}

function getHTMLMascota(mascota, id) {
  let sexo = mascota.sexo.toLowerCase();
  let htmlInicial = `<div class="card ${sexo}" id="adopcion">
                        <div class="title"><b>${mascota.nombre} / ${mascota.edad}</b></div>`;
  let htmlImagenes = getHTMLSliderFotos(mascota.fotos, id);
  let htmlFinal = `     <div class="footer">
                          <a class="donate-button" onclick="abrirDialogo('#dialog_${id}');">Más sobre mí</a>
                          <a class="donate-button" href="contacto.html">¡Adoptame!</a>
                        </div>
                        <div id="dialog_${id}" style="display: none" title="${mascota.nombre}">
                          ${mascota.descripcion}
                        </div>
                      </div>`;

  return `${htmlInicial} ${htmlImagenes} ${htmlFinal}`;
}

function getHTMLSliderFotos(fotos, id) {
  let htmlImagenes = "";
  let htmlFinal = "";
  let htmlInicial = `<div class="content">
                      <div class="slider-content slider-display-container">
                        <div class="imagen-mascota">`;

  if (fotos.length > 1) {
    htmlFinal = `           <button class="slider-button slider-black slider-display-left" onclick="slider${id}.move(-1)">&#10094;</button>
                            <button class="slider-button slider-black slider-display-right" onclick="slider${id}.move(1)">&#10095;</button>`;
  }
  htmlFinal += `         </div>
                      </div>
                    </div>`;

  for (let i = 0; i < fotos.length; i++) {
    const imagen = fotos[i];
    htmlImagenes += `<img class="slide_${id}" src="${imagen}" />`;
  }
  return `${htmlInicial} ${htmlImagenes} ${htmlFinal}`;
}

function getAdopciones(adopciones) {
  let divMascotas = document.getElementById("adopcion");
  if (divMascotas != null) {
    for (let i = 0; i < adopciones.length; i++) {
      var div = document.createElement("div");
      const mascota = adopciones[i];

      div.innerHTML = getHTMLMascota(mascota, i);
      divMascotas.appendChild(div);

      eval(`slider${i} = new Slider(${i});`);
      eval(`slider${i}.move(0)`);
    }
  }
}

function getCasosEspeciales(especiales) {
  let divMascotas = document.getElementById("especial");
  if (divMascotas != null) {
    for (let i = 0; i < especiales.length; i++) {
      let div = document.createElement("div");
      const mascota = especiales[i];

      div.innerHTML = getHTMLEspecial(mascota);
      if (i != especiales.length - 1) {
        div.innerHTML += "<p><hr /></p>";
      }
      divMascotas.appendChild(div);
    }
  }
}

function getHTMLEspecial(especial) {
  let htmlInicio = `<div>
                <div class="subtitle">${especial.nombre}</div>
                <p>${especial.descripcion}</p>`;

  let htmlButtons = "";
  for (let i = 0; i < especial.donacion.length; i++) {
    const donacion = especial.donacion[i];
    htmlButtons += `<a href="${donacion.link}" target="_blank" class="donate-button">  
                      Donar $${donacion.monto}
                    </a>`;
  }

  let htmlFin = "";
  if(especial.link != "#"){
      htmlFin = `<a href="${especial.link}" target="_blank" >
                  <img src="${especial.foto}" />                 
                 </a>`;
  }
  else{
    htmlFin = `<img src="${especial.foto}" />`;  
  }

  return `${htmlInicio} <div class="center-content">${htmlButtons}</div> <div class="center-content">${htmlFin} </div> </div>`;
}

function getHTMLRifa(rifa) {
  let html = `<div>
                <div class="subtitle">${rifa.fecha}</div>
                <p>${rifa.descripcion}</p>
                <div class="center-content"><a href="${rifa.link}" target="_blank"><img src="${rifa.imagen}" class="imagen-rifa" /></a></div>
              </div>`;

  return html;
}

function getRifas(rifas) {
  let divRifas = document.getElementById("rifas");
  if (divRifas != null) {
    for (let i = 0; i < rifas.length; i++) {
      let div = document.createElement("div");
      const rifa = rifas[i];

      div.innerHTML = getHTMLRifa(rifa);
      if (i != rifas.length - 1) {
        div.innerHTML += "<p><hr /></p>";
      }
      divRifas.appendChild(div);
    }
  }
}
