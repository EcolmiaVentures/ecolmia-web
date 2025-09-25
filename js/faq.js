const DATA_URL = "data/faq.json";

function makeItem(q){
  const badge = q.note ? `<span class="badge">${q.note}</span>` : "";
  return `<details class="item">
    <summary>${q.q}${badge}</summary>
    <div class="content">${q.a}</div>
  </details>`;
}

(async () => {
  try{
    const res = await fetch(DATA_URL, {cache:"no-store"});
    const data = await res.json();
    // por categoría
    document.querySelectorAll(".accordion").forEach(acc => {
      const cat = acc.getAttribute("data-category");
      acc.innerHTML = (data[cat] || []).map(makeItem).join("");
    });
  }catch(err){
    console.error("No se pudo cargar FAQ", err);
  }
})();
