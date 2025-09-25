// i18n.js — Carga traducciones y cambia textos con data-i18n="key.path"
(function(){
  const LS_KEY = "ecolmia.lang";
  const SUPPORTED = ["es","en"];

  function getLang(){
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if(fromUrl && SUPPORTED.includes(fromUrl)){ localStorage.setItem(LS_KEY, fromUrl); return fromUrl; }
    const saved = localStorage.getItem(LS_KEY);
    if(saved && SUPPORTED.includes(saved)) return saved;
    return "es";
  }

  async function loadDict(lang){
    const res = await fetch(`i18n/${lang}.json`, {cache:"no-store"});
    return await res.json();
  }

  function get(obj, path){
    return path.split(".").reduce((o,k)=> (o && o[k]!=null) ? o[k] : undefined, obj);
  }

  function apply(dict){
    const year = new Date().getFullYear();
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      let val = get(dict, key);
      if(typeof val === "string") val = val.replace("{year}", String(year));
      if(val!=null) el.textContent = val;
    });
    document.documentElement.lang = dict.lang || "es";

    // Hreflang alternates (basic)
    const base = location.pathname.split("/").pop() || "index.html";
    const head = document.head;
    SUPPORTED.forEach(l=>{
      const link = document.createElement("link");
      link.setAttribute("rel","alternate");
      link.setAttribute("hreflang", l);
      link.setAttribute("href", `${base}?lang=${l}`);
      head.appendChild(link);
    });
  }

  // Expose small API for language toggle buttons
  window.ECOLMIA_I18N = {
    set(lang){
      if(!SUPPORTED.includes(lang)) return;
      localStorage.setItem(LS_KEY, lang);
      location.search = `?lang=${lang}`;
    }
  };

  // Init
  (async ()=>{
    const lang = getLang();
    try{
      const dict = await loadDict(lang);
      apply(dict);
    }catch(e){ console.warn("i18n failed", e); }
  })();
})();