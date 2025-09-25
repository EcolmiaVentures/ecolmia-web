(function(){
  function jsonld(obj){
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.text = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  jsonld({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ECOLMIA VENTURES",
    "url": "https://ecolmiaventures.github.io/ecolmia-web/",
    "email": "ecolmia.ventures@gmail.com",
    "sameAs": [
      "https://www.facebook.com/",
      "https://www.instagram.com/"
    ]
  });
  jsonld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ECOLMIA VENTURES",
    "url": "https://ecolmiaventures.github.io/ecolmia-web/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ecolmiaventures.github.io/ecolmia-web/mi-reserva.html?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  });
})();