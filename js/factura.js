(function(){
  const form = document.getElementById("bill-form");
  const msg = document.getElementById("form-msg");
  form?.addEventListener("submit",(e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const required = ["rfc","razon","uso","email","calle","ext","colonia","municipio","estado","cp","pais","folio","alojamiento","importe","checkin","checkout"];
    for (const k of required){
      if(!String(data.get(k)||"").trim()){
        msg.textContent = "Por favor completa todos los campos obligatorios.";
        return;
      }
    }
    if(!document.getElementById("acepto").checked){
      msg.textContent = "Debes aceptar los términos y el acuerdo de privacidad.";
      return;
    }
    // Placeholder: aquí se integrará el envío por correo al área administrativa.
    msg.textContent = "¡Solicitud enviada! Recibirás tu CFDI en hasta 72 horas hábiles (demo).";
    form.reset();
  });
})();