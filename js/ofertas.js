const OFFERS_URL = "data/ofertas.json";

function offerCard(o){
  return `
  <article class="card">
    <img class="cover" src="${o.image}" alt="${o.title}" loading="lazy" />
    <div class="badges">
      ${o.badges.map(b=>`<span class="badge">${b}</span>`).join(" ")}
    </div>
    <h3>${o.title}</h3>
    <p>${o.description}</p>
    <div class="actions">
      <span class="tag">${o.discount}</span>
    </div>
  </article>`;
}

(async () => {
  try{
    const res = await fetch(OFFERS_URL, {cache:"no-store"});
    const items = await res.json();
    const grid = document.getElementById("offers-grid");
    grid.innerHTML = items.map(offerCard).join("");
  }catch(err){
    console.error("No se pudieron cargar las ofertas", err);
  }

  // Formulario de suscripción (placeholder)
  const form = document.getElementById("promo-form");
  const email = document.getElementById("promo-email");
  const msg = document.getElementById("promo-msg");
  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(!email.value || !/.+@.+\..+/.test(email.value)){
      msg.textContent = "Por favor ingresa un correo válido.";
      return;
    }
    msg.textContent = "¡Gracias! Te suscribimos para futuras promociones (demo).";
    form.reset();
  });
})();
