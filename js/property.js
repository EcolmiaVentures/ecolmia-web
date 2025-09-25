// Lee ?id=BMR|CTR|ZODIAC y carga su JSON
(async () => {
  const params = new URLSearchParams(location.search);
  const id = (params.get("id") || "").toUpperCase();
  const mapFrames = {
    BMR: "https://www.openstreetmap.org/export/embed.html?bbox=-99.171,19.314,-99.131,19.354&layer=mapnik&marker=19.334,-99.151",
    CTR: "https://www.openstreetmap.org/export/embed.html?bbox=-99.171,19.314,-99.131,19.354&layer=mapnik&marker=19.334,-99.151",
    ZODIAC: "https://www.openstreetmap.org/export/embed.html?bbox=-99.930,16.800,-99.850,16.880&layer=mapnik&marker=16.850,-99.890"
  };

  const files = { BMR: "data/bmr.json", CTR: "data/ctr.json", ZODIAC: "data/zodiac.json" };
  const file = files[id] || files["BMR"];

  try{
    const res = await fetch(file, {cache:"no-store"});
    const data = await res.json();

    // Título y ubicación
    document.getElementById("prop-title").textContent = data.title;
    document.getElementById("prop-location").textContent = data.location;

    // Precio
    const priceBox = document.getElementById("prop-price");
    priceBox.innerHTML = `Entre semana: MXN $${data.prices.weekday} · Fines de semana y festivos: MXN $${data.prices.weekend}`;

    // Tabs + galería
    const gallery = document.getElementById("gallery");
    const tabs = document.querySelectorAll(".tab");
    const images = data.photos;
    function renderGallery(key){
      gallery.innerHTML = "";
      (images[key] || []).forEach(src => {
        const img = document.createElement("img");
        img.loading = "lazy";
        img.src = src;
        img.alt = `${data.short} - ${key}`;
        gallery.appendChild(img);
      });
    }
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGallery(btn.dataset.tab);
      });
    });
    renderGallery("areas");

    // Descripciones
    document.getElementById("desc-alojamiento").textContent = data.about.alojamiento;
    const ulAcc = document.getElementById("desc-acceso");
    data.about.acceso.forEach(li => { const el = document.createElement("li"); el.textContent = li; ulAcc.appendChild(el); });
    document.getElementById("desc-estancia").textContent = data.about.estancia;
    const ulDest = document.getElementById("desc-destacados");
    data.about.destacados.forEach(li => { const el = document.createElement("li"); el.textContent = li; ulDest.appendChild(el); });

    // Amenidades
    const amenGrid = document.getElementById("amenidades-grid");
    Object.entries(data.amenities).forEach(([group, items]) => {
      const card = document.createElement("div");
      card.className = "amen-card";
      const h4 = document.createElement("h4");
      h4.textContent = group;
      const ul = document.createElement("ul");
      items.forEach(x => { const li = document.createElement("li"); li.textContent = x; ul.appendChild(li); });
      card.appendChild(h4); card.appendChild(ul);
      amenGrid.appendChild(card);
    });

    // Reglas
    const rules = document.getElementById("rules-list");
    data.rules.forEach(r => { const li = document.createElement("li"); li.textContent = r; rules.appendChild(li); });

    // Mapa
    const m = document.getElementById("map-frame");
    m.src = mapFrames[id] || mapFrames["BMR"];

  }catch(err){
    console.error("No se pudo cargar la propiedad", err);
  }
})();
