// Carga de header y footer como parciales
(async () => {
  async function loadPartial(id, url){
    try{
      const el = document.getElementById(id);
      if(!el) return;
      const res = await fetch(url, {cache: "no-store"});
      const html = await res.text();
      el.innerHTML = html;
    }catch(err){
      console.error("No se pudo cargar", url, err);
    }
  }
  await loadPartial("site-header","partials/header.html");
  await loadPartial("site-footer","partials/footer.html");
})();

// Scroll suave para anclas
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  const id = a.getAttribute("href").slice(1);
  const target = document.getElementById(id);
  if (target){
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
  }
});
