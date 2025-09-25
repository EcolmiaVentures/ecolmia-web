const DATA_URL = "data/resenas.json";

function stars(n){
  const full = "★".repeat(n);
  const empty = "☆".repeat(5-n);
  return `<span class="stars" aria-label="${n} de 5">${full}${empty}</span>`;
}

function card(r){
  return `
  <article class="card review-card">
    <div class="review-head">
      <div class="reviewer">
        <strong>${r.reviewer}</strong>
        <div class="review-meta">${r.stay_type} · ${r.room_label} · <time datetime="${r.date}">${r.date}</time></div>
      </div>
      ${stars(r.rating)}
    </div>
    <div class="badges">
      <span class="badge">${r.property}</span>
      ${r.tags.map(t=>`<span class="badge">${t}</span>`).join("")}
    </div>
    <p class="review-body">${r.text}</p>
  </article>`;
}

function sortItems(items, how){
  const arr = [...items];
  if(how === "date_desc") return arr.sort((a,b)=> b.date.localeCompare(a.date));
  if(how === "date_asc")  return arr.sort((a,b)=> a.date.localeCompare(b.date));
  if(how === "rating_desc") return arr.sort((a,b)=> b.rating - a.rating);
  if(how === "rating_asc")  return arr.sort((a,b)=> a.rating - b.rating);
  return arr;
}

(async () => {
  try{
    const res = await fetch(DATA_URL, {cache:"no-store"});
    const data = await res.json();

    const selectProp = document.getElementById("by-prop");
    const selectSort = document.getElementById("by-sort");
    const list = document.getElementById("reviews-list");

    function render(){
      const prop = selectProp.value;
      const sort = selectSort.value;
      let items = prop === "ALL" ? data : data.filter(x => x.property === prop);
      items = sortItems(items, sort);
      list.innerHTML = items.map(card).join("");
    }

    selectProp.addEventListener("change", render);
    selectSort.addEventListener("change", render);
    render();
  }catch(err){
    console.error("No se pudieron cargar las reseñas", err);
  }
})();
