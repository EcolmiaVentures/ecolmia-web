(function(){
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-msg");
  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name")||"").toString().trim();
    const email = (data.get("email")||"").toString().trim();
    const topic = (data.get("topic")||"").toString().trim();
    const message = (data.get("message")||"").toString().trim();

    if(!name || !email || !topic || !message){
      msg.textContent = "Por favor completa los campos requeridos.";
      return;
    }
    if(!/.+@.+\..+/.test(email)){
      msg.textContent = "Ingresa un correo válido.";
      return;
    }
    // Placeholder: aquí se integrará el envío (EmailJS, Formspree o backend propio)
    msg.textContent = "¡Gracias! Hemos recibido tu mensaje (demo).";
    form.reset();
  });
})();