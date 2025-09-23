(async function(){
  const url=new URL(location.href);const pid=url.searchParams.get('id')||'BMR';
  const props=await (await fetch('data/properties.json')).json();
  const availability=await (await fetch('data/availability.json')).json();
  const parkingBlocks=await (await fetch('data/parking.json')).json();
  const property=props.properties[pid];

  document.getElementById('title').textContent=property.name+' · '+property.city;
  document.getElementById('subtitle').textContent=property.area+(property.reference?' — '+property.reference:'');
  document.getElementById('map').src='https://www.google.com/maps?q='+encodeURIComponent(property.map_query)+'&output=embed';

  const kpi=document.getElementById('kpi');
  ['Sin mínimo de noches','Mascotas (2 máx.)','Estac. sujeto a disp.'].forEach(t=>{
    const b=document.createElement('div');b.className='badge';b.textContent=t;kpi.appendChild(b)
  });

  const priceList=document.getElementById('priceList');
  const pFull=document.createElement('div');pFull.textContent=`Depto completo — Semana: $${property.prices.weekday} · Fin/festivo: $${property.prices.weekend}`;priceList.appendChild(pFull);
  Object.entries(property.rooms).forEach(([r,conf])=>{
    const d=document.createElement('div');d.textContent=`${r} — Semana: $${conf.prices.weekday} · Fin/festivo: $${conf.prices.weekend}`;priceList.appendChild(d)
  });

  const amenities=document.getElementById('amenities');
  const baseAm=['Wi-Fi','Cocina equipada','Toallas y ropa de cama','Utensilios de cocina','Entrada autónoma (según disp.)'];
  if(pid==='ZODIAC') baseAm.push('Aire acondicionado');
  baseAm.forEach(a=>{const div=document.createElement('div');div.textContent=a;amenities.appendChild(div)});

  const rules=document.getElementById('rules');
  ['Check-in: 3:00 pm – 11:59 pm · Check-out: 10:00 am','Sin mínimo de noches','Mascotas: máx. 2 · $150 por mascota (por estancia) · informar al reservar','Estacionamiento: sujeto a disponibilidad','No fumar en interiores · No fiestas/eventos','Identificación oficial requerida del titular'].forEach(x=>{const li=document.createElement('li');li.textContent=x;rules.appendChild(li)});

  const safety=document.getElementById('safety');
  ['Detectores de humo y CO','Cámaras en áreas comunes','Extintores'].forEach(x=>{const li=document.createElement('li');li.textContent=x;safety.appendChild(li)});

  const galleries=document.getElementById('galleries');galleries.innerHTML='';
  Object.keys(property.rooms).forEach(room=>{
    const wrap=document.createElement('div');wrap.className='card';
    const h=document.createElement('h3');h.textContent='Fotos · '+room;wrap.appendChild(h);
    const grid=document.createElement('div');grid.className='gallery';grid.style.gridTemplateColumns='repeat(3,1fr)';
    const imgs=property.rooms[room].images||[];
    if(imgs.length){
      imgs.forEach(src=>{const img=new Image();img.src=src;img.alt=room;img.style.width='100%';img.style.borderRadius='12px';grid.appendChild(img)})
    }else{
      for(let i=0;i<3;i++){const ph=document.createElement('div');ph.style.height='140px';ph.style.border='1px dashed #ddd';ph.style.borderRadius='12px';ph.style.display='grid';ph.style.placeItems='center';ph.textContent='(Foto de Airbnb)';grid.appendChild(ph)}
    }
    wrap.appendChild(grid);galleries.appendChild(wrap)
  });

  const roomChips=document.getElementById('roomChips');const modeSel=document.getElementById('mode');
  function renderRoomChips(){
    roomChips.innerHTML=''; if(modeSel.value==='full') return;
    Object.entries(property.rooms).forEach(([r,cfg])=>{
      const lab=document.createElement('label');lab.className='badge';lab.style.cursor='pointer';lab.style.userSelect='none';lab.style.padding='8px 10px';
      const cb=document.createElement('input');cb.type='checkbox';cb.value=r;cb.style.marginRight='6px';
      lab.appendChild(cb);lab.appendChild(document.createTextNode(`${r} · máx ${cfg.capacity}`));
      roomChips.appendChild(lab)
    })
  }
  renderRoomChips();

  function renderCalendars(){
    const calendars=document.getElementById('calendars');calendars.innerHTML='';
    if(modeSel.value==='full'){
      const fullRanges=availability[pid].full||[];const box=document.createElement('div');renderCalendar(box,fullRanges);calendars.appendChild(box)
    }else{
      Object.keys(property.rooms).forEach(r=>{
        const card=document.createElement('div');card.className='card';
        const h=document.createElement('h4');h.textContent='Disponibilidad · '+r;card.appendChild(h);
        const ranges=(availability[pid].rooms&&availability[pid].rooms[r])?availability[pid].rooms[r]:[];
        const box=document.createElement('div');renderCalendar(box,ranges);card.appendChild(box);calendars.appendChild(card)
      })
    }
  }
  renderCalendars();

  modeSel.addEventListener('change',()=>{renderRoomChips();renderCalendars()});

  const holidays=new Set(['2025-01-01','2025-02-03','2025-03-17','2025-05-01','2025-09-16','2025-11-17','2025-12-25']);
  function isWeekendOrHoliday(d){return d.getDay()==0||d.getDay()==6||holidays.has(d.toISOString().slice(0,10))}
  function daysBetween(start,end){const out=[];const s=new Date(start),e=new Date(end);for(let d=new Date(s);d<e;d.setDate(d.getDate()+1))out.push(new Date(d));return out}
  function selectedRooms(){if(modeSel.value==='full')return[];return Array.from(roomChips.querySelectorAll('input:checked')).map(i=>i.value)}
  function maxGuests(){if(modeSel.value==='full')return property.capacity;const rooms=selectedRooms();if(!rooms.length)return 1;return rooms.reduce((acc,r)=>acc+(property.rooms[r].capacity||2),0)}
  function checkParkingAvailable(start,end){const blocks=parkingBlocks[pid]||[];return !blocks.some(b=> new Date(start)<new Date(b.end) && new Date(end)>new Date(b.start))}

  function calc(){
    const ci=document.getElementById('checkin').value;
    const co=document.getElementById('checkout').value;
    const guests=+document.getElementById('guests').value;
    const pets=+document.getElementById('pets').value;
    const wantsParking=document.getElementById('parking').checked;
    const quote=document.getElementById('quote');
    const payBtn=document.getElementById('pay');

    if(!ci||!co||co<=ci){quote.textContent='Selecciona fechas válidas.';payBtn.disabled=true;return}
    const cap=maxGuests();
    if(guests>cap){document.getElementById('guests').value=cap;quote.textContent=`Se ajustó el número de huéspedes a ${cap} (capacidad máxima para la selección).`;payBtn.disabled=true;return}
    const days=daysBetween(ci,co); if(days.length==0){quote.textContent='Selecciona al menos una noche.';payBtn.disabled=true;return}

    let rows=''; let total=0;

    if(modeSel.value==='full'){
      const wkd=days.filter(isWeekendOrHoliday).length; const wk=days.length-wkd;
      if(wk){rows+=`<tr><td>${wk} noche(s) entre semana (Depto completo)</td><td>$${property.prices.weekday} × ${wk}</td></tr>`; total+=property.prices.weekday*wk}
      if(wkd){rows+=`<tr><td>${wkd} noche(s) fin/festivo (Depto completo)</td><td>$${property.prices.weekend} × ${wkd}</td></tr>`; total+=property.prices.weekend*wkd}
    }else{
      const rooms=selectedRooms(); if(!rooms.length){quote.textContent='Selecciona al menos una habitación.';payBtn.disabled=true;return}
      const wkd=days.filter(isWeekendOrHoliday).length; const wk=days.length-wkd;
      rooms.forEach(r=>{
        const pr=property.rooms[r].prices;
        if(wk){rows+=`<tr><td>${wk} noche(s) entre semana (${r})</td><td>$${pr.weekday} × ${wk}</td></tr>`; total+=pr.weekday*wk}
        if(wkd){rows+=`<tr><td>${wkd} noche(s) fin/festivo (${r})</td><td>$${pr.weekend} × ${wkd}</td></tr>`; total+=pr.weekend*wkd}
      });
    }

    if(pets>0){const p=150*pets; total+=p; rows+=`<tr><td>Mascotas (${pets} × $150)</td><td>$${p}</td></tr>`}

    if(wantsParking){
      const ok=checkParkingAvailable(ci,co);
      rows+=`<tr><td>Estacionamiento</td><td>${ok?'Disponible (sin costo)':'No disponible'}</td></tr>`;
      if(!ok){payBtn.disabled=true;document.getElementById('quote').innerHTML=`<table class='table'>${rows}<tr><td><strong>Total</strong></td><td><strong>$${total}</strong></td></tr></table>`;return}
    }

    rows+=`<tr><td><strong>Total</strong></td><td><strong>$${total}</strong></td></tr>`;
    document.getElementById('quote').innerHTML=`<table class='table'>${rows}</table>`;
    payBtn.disabled=false;
  }

  document.getElementById('calc').addEventListener('click',calc);

  (function init(){
    const t=new Date(); const ci=new Date(t); ci.setDate(ci.getDate()+2);
    const co=new Date(t); co.setDate(co.getDate()+5);
    document.getElementById('checkin').value=ci.toISOString().slice(0,10);
    document.getElementById('checkout').value=co.toISOString().slice(0,10);
  })();
})();