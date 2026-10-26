const $ = (id) => document.getElementById(id);
const esc = (t) => String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// menú en celular
const burger = $("burger");
if (burger) burger.addEventListener("click", () => {
  const abierto = $("menu").classList.toggle("abierto");
  burger.setAttribute("aria-expanded", abierto);
});

// enlaces a la aplicación (login)
document.querySelectorAll("[data-app]").forEach(a => { a.href = APP_URL; });

// contacto
document.querySelectorAll("#lnkCorreo, #pieCorreo").forEach(a => { a.href = "mailto:" + CONTACTO.correo; a.textContent = CONTACTO.correo; });
if (CONTACTO.whatsapp) {
  const url = "https://wa.me/" + CONTACTO.whatsapp;
  if ($("bloqueWa")) { $("bloqueWa").hidden = false; $("lnkWa").href = url; $("lnkWa").textContent = CONTACTO.whatsappVisible || CONTACTO.whatsapp; }
  $("wa").hidden = false; $("wa").href = url;
}

// cifras, clientes y proyectos (aparecen solo si hay datos)
if ($("cifras") && CIFRAS.length) { $("cifras").hidden = false; $("cifrasLista").innerHTML = CIFRAS.map(c => `<div><b>${esc(c.valor)}</b><span>${esc(c.texto)}</span></div>`).join(""); }
if ($("clientes") && CLIENTES.length) { $("clientes").hidden = false; $("clientesLista").innerHTML = CLIENTES.map(c => `<li>${esc(c)}</li>`).join(""); }
if ($("fichasWrap") && PROYECTOS.length) {
  $("fichasWrap").hidden = false;
  const sectores = ["Todos", ...new Set(PROYECTOS.map(p => p.sector))];
  const pintar = (f) => {
    $("filtros").innerHTML = sectores.map(x => `<button type="button" aria-pressed="${x === f}" data-s="${esc(x)}">${esc(x)}</button>`).join("");
    $("fichas").innerHTML = PROYECTOS.filter(p => f === "Todos" || p.sector === f).map(p => `<article class="ficha"><div class="sector">${esc(p.sector)}</div><h3>${esc(p.nombre)}</h3><dl>${p.cliente ? `<dt>Cliente</dt><dd>${esc(p.cliente)}</dd>` : ""}${p.ubicacion ? `<dt>Ubicación</dt><dd>${esc(p.ubicacion)}</dd>` : ""}${p.anio ? `<dt>Año</dt><dd>${esc(p.anio)}</dd>` : ""}${p.area ? `<dt>Área</dt><dd>${esc(p.area)}</dd>` : ""}${p.modalidad ? `<dt>Servicio</dt><dd>${esc(p.modalidad)}</dd>` : ""}</dl></article>`).join("");
  };
  $("filtros").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pintar(b.dataset.s); });
  pintar("Todos");
}

// formulario: abre el correo del visitante con el mensaje redactado
if ($("formContacto")) {
  const q = new URLSearchParams(location.search).get("servicio");
  if (q) { const s = $("fServicio"); for (const o of s.options) if ((o.value || o.text) === q) s.value = o.value || o.text; }
  $("formContacto").addEventListener("submit", (e) => {
    e.preventDefault();
    const cuerpo = `Nombre: ${$("fNombre").value}\nEmpresa: ${$("fEmpresa").value}\nServicio: ${$("fServicio").value}\nTipo de proyecto: ${$("fSector").value}\n\n${$("fMensaje").value}`;
    window.location.href = "mailto:" + CONTACTO.correo + "?subject=" + encodeURIComponent("Consulta desde la web: " + $("fServicio").value) + "&body=" + encodeURIComponent(cuerpo);
  });
}
