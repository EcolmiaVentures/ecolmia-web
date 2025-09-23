// Inject shared header on every page for consistency
(function(){
  const nav = document.createElement('header');
  nav.className = 'site';
  nav.innerHTML = `
  <div class="container">
    <nav class="main">
      <a href="inicio.html" class="brand"><span class="logo"></span> ECOLMIA VENTURES</a>
      <ul class="menu">
        <li><a href="inicio.html">Inicio</a></li>
        <li>
          <button> Alojamientos ▾</button>
          <div class="dropdown">
            <div class="group">
              <div>CDMX</div>
              <a href="bmr.html">Departamento BMR</a>
              <a href="ctr.html">Departamento CTR</a>
            </div>
            <div class="group">
              <div>Acapulco</div>
              <span class="nolink">Acapulco</span>
              <a href="zodiac.html">Departamento Zodiac</a>
            </div>
            <div class="group">
              <a href="alojamientos.html"><strong>Ver todas las ciudades</strong></a>
            </div>
          </div>
        </li>
        <li><a href="ofertas.html">Ofertas</a></li>
        <li>
          <button>Galería ▾</button>
          <div class="dropdown">
            <div class="group"><a href="galeria.html">General</a></div>
            <div class="group"><div>Por propiedad</div>
              <a href="galeria-bmr.html">BMR</a>
              <a href="galeria-ctr.html">CTR</a>
              <a href="galeria-zodiac.html">Zodiac</a>
            </div>
          </div>
        </li>
        <li><a href="resenas.html">Reseñas</a></li>
        <li><a href="guia.html">Guía</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li>
          <button>Nosotros ▾</button>
          <div class="dropdown">
            <div class="group">
              <a href="quienes-somos.html">Quiénes somos</a>
              <a href="politicas-cancelacion.html">Políticas de cancelación</a>
              <a href="privacidad.html">Acuerdo de Privacidad</a>
              <a href="terminos.html">Términos y condiciones</a>
            </div>
          </div>
        </li>
        <li><a href="contacto.html">Contacto</a></li>
        <li><a href="facturacion.html">Facturación</a></li>
        <li><a href="mi-reserva.html">Mi reserva</a></li>
      </ul>
      <div class="controls">
        <select class="select" aria-label="Idioma">
          <option>ES</option><option>EN</option>
        </select>
        <select class="select" aria-label="Moneda">
          <option>MXN</option><option>USD</option><option>EUR</option>
        </select>
        <a class="btn btn-cta" href="alojamientos.html">Reserva ahora</a>
      </div>
    </nav>
  </div>`;
  // Insert as first child
  document.body.prepend(nav);
})();
