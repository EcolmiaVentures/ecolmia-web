function renderCalendar(container, busyRanges){
  container.innerHTML='';
  const now=new Date();
  for(let m=0;m<2;m++){
    const dt=new Date(now.getFullYear(),now.getMonth()+m,1);
    container.appendChild(buildMonth(dt,busyRanges));
  }
}
function buildMonth(firstOfMonth,busyRanges){
  const wrap=document.createElement('div');wrap.style.margin='10px 0';
  const h=document.createElement('h4');h.textContent=firstOfMonth.toLocaleString('es-MX',{month:'long',year:'numeric'});h.style.margin='6px 0';wrap.appendChild(h);
  const table=document.createElement('table');table.className='table';
  const header=document.createElement('tr');
  'L M X J V S D'.split(' ').forEach(d=>{const th=document.createElement('th');th.textContent=d;th.style.textAlign='left';th.style.padding='4px';header.appendChild(th)});
  table.appendChild(header);
  const startDow=(firstOfMonth.getDay()+6)%7;let row=document.createElement('tr');
  for(let i=0;i<startDow;i++){const td=document.createElement('td');td.innerHTML='&nbsp;';row.appendChild(td)}
  const daysInMonth=new Date(firstOfMonth.getFullYear(),firstOfMonth.getMonth()+1,0).getDate();
  for(let d=1;d<=daysInMonth;d++){
    const cur=new Date(firstOfMonth.getFullYear(),firstOfMonth.getMonth(),d);
    const iso=cur.toISOString().slice(0,10);
    const td=document.createElement('td');td.textContent=d;td.style.padding='4px 6px';
    if(isBusy(iso,busyRanges)){td.style.background='#fee2e2';td.style.borderRadius='6px';td.title='Ocupado';}
    else{td.style.background='#ecfdf5';td.style.borderRadius='6px';td.title='Disponible';}
    row.appendChild(td);
    if((startDow+d)%7===0){table.appendChild(row);row=document.createElement('tr');}
  }
  if(row.children.length)table.appendChild(row);
  wrap.appendChild(table);return wrap
}
function isBusy(iso,ranges){
  const d=new Date(iso);
  return (ranges||[]).some(r=>{const s=new Date(r.start),e=new Date(r.end);return d>=s&&d<e;});
}