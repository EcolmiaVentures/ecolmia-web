const DATA_URL = "data/reservas-demo.json";

function nightsBetween(d1, d2){
  const ms = new Date(d2) - new Date(d1);
  return Math.max(1, Math.round(ms / (1000*60*60*24)));
}

(function(){
  const form = document.getElementById("booking-form");
  const msg = document.getElementById("form-msg");
  const result = document.getElementById("result");

  form?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    msg.textContent = "";
    result.classList.add("hidden");

    const data = new FormData(form);
    const email = String(data.get("email")||"").trim().toLowerCase();
    const folio = String(data.get("folio")||"").trim().toUpperCase();

    if(!email || !/.+@.+\..+/.test(email)){
      msg.textContent = "Ingresa un correo válido.";
      return;
    }
    if(!folio){
      msg.textContent = "Ingresa tu folio o ID.";
      return;
    }

    try{
      const res = await fetch(DATA_URL, {cache:"no-store"});
      const db = await res.json();
      const hit = db.find(x => x.email.toLowerCase()===email && x.folio.toUpperCase()===folio);
      if(!hit){
        msg.textContent = "No encontramos una reserva con esos datos. Verifica tu correo y folio.";
        return;
      }
      // pinta resultado
      document.getElementById("res-status").textContent = hit.status;
      document.getElementById("res-id").textContent = hit.folio;
      document.getElementById("res-prop").textContent = hit.property;
      document.getElementById("res-room").textContent = hit.space;
      document.getElementById("res-guests").textContent = hit.guests;
      document.getElementById("res-in").textContent = hit.checkin;
      document.getElementById("res-out").textContent = hit.checkout;
      document.getElementById("res-nights").textContent = nightsBetween(hit.checkin, hit.checkout);
      document.getElementById("res-total").textContent = Number(hit.total_mxn).toLocaleString('es-MX',{style:'currency',currency:'MXN'});
      document.getElementById("res-pay").textContent = hit.payment;

      result.classList.remove("hidden");

      document.getElementById("btn-pdf").onclick = ()=>{
        alert("Demo: el comprobante PDF se generará cuando conectemos esta función.");
      };
    }catch(err){
      console.error(err);
      msg.textContent = "Ocurrió un error al consultar. Inténtalo nuevamente.";
    }
  });
})();