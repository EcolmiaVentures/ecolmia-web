INTERNACIONALIZACIÓN (i18n) Y SEO — INSTRUCCIONES RÁPIDAS

1) Archivos incluidos
- i18n/es.json y i18n/en.json (diccionarios)
- js/i18n.js (selector de idioma via ?lang=es|en y localStorage)
- seo/robots.txt, seo/sitemap.xml, seo/humans.txt
- seo/manifest.webmanifest (PWA básico)
- img/icons/icon-192.png, icon-512.png (favicons)
- js/seo.js (JSON-LD Organization y WebSite)

2) Cómo activar el cambio de idioma (sin romper español)
- Añade en tus plantillas spans con data-i18n, por ejemplo:
  <a data-i18n="menu.alojamientos">Alojamientos</a>
  <span data-i18n="footer.copy">© {year} ECOLMIA...</span>
- Incluye js/i18n.js al final de cada página (después de main.js).
- Crea dos botones o links para alternar:
  <button onclick="ECOLMIA_I18N.set('es')">ES</button>
  <button onclick="ECOLMIA_I18N.set('en')">EN</button>

3) SEO
- Sube seo/robots.txt a la raíz pública como robots.txt
- Sube sitemap.xml a la raíz pública
- Incluye js/seo.js y un <link rel="manifest" href="seo/manifest.webmanifest">
- Añade meta Open Graph por página (title, description, og:image) si lo deseas.

4) Prueba de idioma
- Abre cualquier página con ?lang=en para ver textos del diccionario.
