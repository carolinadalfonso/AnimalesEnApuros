let cantLoad = 0;

$(document).ready(function () {
  $("#header").load("../views/common/header.html");
  $("#footer").load("../views/common/footer.html");
  getData();

  document.querySelector("iframe").addEventListener("load", function (e) {
    cantLoad += 1;
    if (cantLoad == 2) {
      $("#iframe").hide();
      $("#iframe").attr("height", "400px");
      $("#iframe").attr("src", "gracias.html");
      $("#iframe").show();
    }
  });
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

function getHTMLMascota(mascota) {
  let sexo = mascota.sexo.toLowerCase();
  let html = `<div class="card ${sexo}" id="adopcion">
                <div class="title"><b>${mascota.nombre} / ${mascota.edad}</b></div>
                <div class="content">
                  <div class="imagen-mascota"><img src="${mascota.foto}"/></div>
                </div>
                <div class="footer">
                  <a class="donate-button" onclick="abrirDialogo('#dialog_${mascota.nombre}');">Más sobre mí</a>
                  <a class="donate-button" href="contacto.html">¡Adoptame!</a>
                </div>
                <div id="dialog_${mascota.nombre}" style="display: none" title="${mascota.nombre}">
                  ${mascota.descripcion}
                </div>
              </div>`;

  return html;
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

  let htmlFin = `<div class="center-content">
                  <a href="${especial.link}" target="_blank" >
                    <img src="${especial.foto}" />                 
                  </a>
                 </div>
                </div>`;

  return `${htmlInicio} <div class="center-content">${htmlButtons}</div> ${htmlFin}`;
}

function getAdopciones(adopciones) {
  let divMascotas = document.getElementById("adopcion");
  if (divMascotas != null) {
    for (let i = 0; i < adopciones.length; i++) {
      var div = document.createElement("div");
      const mascota = adopciones[i];

      div.innerHTML = getHTMLMascota(mascota);
      divMascotas.appendChild(div);
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
