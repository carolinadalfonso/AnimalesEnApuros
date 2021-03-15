let cantLoad = 0;

$(document).ready(function () {
  $("#header").load("../views/common/header.html");
  $("#footer").load("../views/common/footer.html");
  getData();

  document.querySelector("iframe").addEventListener("load", function (e) {
    cantLoad += 1;
    if (cantLoad == 2) {
      $("#iframe").hide();
      $("#confirm").css("display", "block");
      $("#iframe").attr("height", "300px");
      $("#iframe").css("margin-top", "-45px");
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

function getHTMLMascota(mascota) {
  let html = `<div class="recuadro">
                <div class="img-mascota"><img src="${mascota.foto}"/></div>
                <p><b>${mascota.nombre}</b></p>
                <div class="text">${mascota.descripcion}</div></br>
                <a href="contacto.html">Adoptarme</a>
              </div>`;

  return html;
}

function getHTMLEspecial(especial) {
  let htmlInicio = `<div>
                <div class="subtitle">${especial.nombre}</div>
                <p>${especial.descripcion}</p>`;

  let htmlbuttons = "";
  for (let i = 0; i < especial.donacion.length; i++) {
    const donacion = especial.donacion[i];
    htmlbuttons += `<a href="${donacion.link}" target="_blank" class="donate-button">  
                      Donar $${donacion.monto}
                    </a>`;
  }

  let htmlFin = `<a href="${especial.link}" target="_blank" >
                  <div class="imagen-mascota">
                    <img src="${especial.foto}" />
                  </div>
                </a>
              </div>`;

  return htmlInicio + htmlbuttons + htmlFin;
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
                <a href="${rifa.link}" target="_blank"><img src="${rifa.imagen}" width="100%" /></a>
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

// $(function () {
//   window.onscroll = function () {
//     stickyHeader();
//   };

//   var header = $("#header");
//   var sticky = $("#header").offset().top + 200;

//   function stickyHeader() {
//     if (window.pageYOffset > sticky) {
//       $("#header").addClass("sticky");
//       $("#logo").addClass("logo-sticky");
//       $("#cat-header").addClass("cat-sticky");
//     } else {
//       $("#header").removeClass("sticky");
//       $("#logo").removeClass("logo-sticky");
//       $("#cat-header").removeClass("cat-sticky");
//     }
//   }
// });
