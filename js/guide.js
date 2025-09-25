
// Guide pages dynamic behavior (CDMX & Acapulco)
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Try to inject header/footer from /partials if present
  async function injectPartials(){
    const header = document.getElementById('app-header');
    const footer = document.getElementById('app-footer');
    async function load(id, url){
      try{
        const res = await fetch(url,{cache:'no-store'});
        if(res.ok){
          document.getElementById(id).innerHTML = await res.text();
        }
      }catch(e){ /* no-op: partials optional */ }
    }
    if(header) load('app-header','/ecolmia-web/partials/header.html');
    if(footer) load('app-footer','/ecolmia-web/partials/footer.html');
  }

  // Leaflet map init
  let map, markersLayer;
  function initMap(center=[19.356,-99.163], zoom=12){
    map = L.map('map',{scrollWheelZoom:false}).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    markersLayer = L.markerClusterGroup ? L.markerClusterGroup() : L.layerGroup();
    map.addLayer(markersLayer);
  }
  const markerIndex = new Map();
  function addMarker(item){
    const m = L.marker([item.lat, item.lng]).bindPopup(`
      <b>${item.titulo}</b><br/>
      <small>${item.zona || ''}</small><br/>
      <div style="margin-top:6px">${item.descripcion || ''}</div>
      ${item.url ? `<div style="margin-top:8px"><a href="${item.url}" target="_blank" rel="noopener">Sitio oficial</a></div>`:''}
    `);
    markerIndex.set(item.id, m);
    markersLayer.addLayer(m);
  }
  function focusMarker(id){
    const m = markerIndex.get(id);
    if(!m) return;
    map.setView(m.getLatLng(), 15, {animate:true});
    m.openPopup();
  }

  // Render chips
  function renderChips(categories){
    const wrap = $('.chips');
    wrap.innerHTML = '';
    const all = document.createElement('button');
    all.className='chip'; all.textContent='Todo'; all.dataset.value='*'; all.dataset.active='true';
    wrap.appendChild(all);
    categories.forEach(cat=>{
      const b = document.createElement('button');
      b.className='chip'; b.textContent=cat; b.dataset.value=cat;
      wrap.appendChild(b);
    });
  }

  // Render list/grid
  function renderGrid(items){
    const grid = $('.grid'); grid.innerHTML = '';
    items.forEach(it=>{
      const card = document.createElement('article');
      card.className='card';
      card.innerHTML = `
        <div class="media">${it.imagen ? `<img src="${it.imagen}" alt="${it.titulo}">` : ''}</div>
        <div class="body">
          <div class="title">${it.titulo} ${it.destacado ? '<span class="badge">recomendado</span>' : ''}</div>
          <div class="meta">${it.zona || ''} • ${it.categoria}</div>
          <div class="tags">${(it.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
        <div class="actions">
          <button class="btn btn-ghost" data-open="${it.id}">Ver en mapa</button>
          ${it.url ? `<a class="btn btn-primary" href="${it.url}" target="_blank" rel="noopener">Sitio oficial</a>`:''}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Filtering
  function setupFiltering(allItems){
    let activeCat = '*';
    const search = $('#search');
    function apply(){
      const q = (search.value || '').toLowerCase().trim();
      const list = allItems.filter(it => {
        const hitCat = activeCat==='*' || it.categoria===activeCat;
        const hitQ = !q || [it.titulo, it.descripcion, it.zona, (it.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
        return hitCat && hitQ;
      });
      renderGrid(list);
    }
    $('.chips').addEventListener('click', e=>{
      const b = e.target.closest('.chip'); if(!b) return;
      $$('.chip').forEach(x=>x.dataset.active='false');
      b.dataset.active='true';
      activeCat = b.dataset.value;
      apply();
    });
    search.addEventListener('input', apply);
    $('.grid').addEventListener('click', e=>{
      const btn = e.target.closest('[data-open]'); if(!btn) return;
      e.preventDefault();
      focusMarker(btn.dataset.open);
      document.getElementById('map').scrollIntoView({behavior:'smooth', block:'center'});
    });
    apply();
  }

  async function main(){
    await injectPartials();
    const mainEl = document.querySelector('main[data-json]');
    const jsonUrl = mainEl?.dataset?.json;
    if(!jsonUrl) return;

    // Default centers
    let center = [19.356,-99.163], zoom=12;
    if(jsonUrl.includes('acapulco')){ center=[16.853,-99.865]; zoom=13; }
    initMap(center, zoom);

    const res = await fetch(jsonUrl, {cache:'no-store'});
    const data = await res.json();
    const items = data.items || [];

    // Sidebar categories
    const cats = Array.from(new Set(items.map(i=>i.categoria))).sort();
    renderChips(cats);

    // Markers
    items.forEach(addMarker);

    // Grid initial
    renderGrid(items);
    setupFiltering(items);
  }
  document.addEventListener('DOMContentLoaded', main);
})();
