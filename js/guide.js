document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("cards-grid");
  const mapDiv = document.getElementById("map");

  const isCDMX = document.title.includes("CDMX");
  const dataFile = isCDMX ? "data/guia-cdmx.json" : "data/guia-acapulco.json";

  fetch(dataFile)
    .then(res => res.json())
    .then(data => {
      grid.innerHTML = data.items.map(item => `
        <div class="card">
          <img src="${item.imagen}" alt="${item.titulo}" style="width:100%;border-radius:8px;">
          <h3>${item.titulo}</h3>
          <p>${item.descripcion}</p>
          <a href="${item.url}" target="_blank">Sitio oficial</a>
          <button onclick="alert('Ver en mapa: ${item.titulo}')">Ver en mapa</button>
        </div>
      `).join("");
      mapDiv.innerHTML = "<p>Mapa interactivo aquí</p>";
    });
});
