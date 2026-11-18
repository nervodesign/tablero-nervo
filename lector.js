/* Lector de #movimientos SIN IA: lee el texto con reglas, los comprobantes con OCR (en el navegador)
   y los PDF de presupuesto con pdf.js. La categoría la aprende del historial de Finanzas. */
(function(root){
  var CATS = null;
  function sinTildes(s){ return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function norm(s){ return sinTildes(s).toUpperCase().replace(/[^A-Z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function numAR(s){
    s = String(s || "").replace(/\s/g, "");
    if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(",", ".");
    else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
    var n = Number(s); return isFinite(n) ? n : 0;
  }
  function quien(s){
    s = norm(s);
    if (/\bEUGENIA\b|\bEUGE\b/.test(s)) return "euge";
    if (/\bPAULA\b|\bPAU\b|\bPALI\b/.test(s)) return "pau";
    return "";
  }

  /* ---------- 1. el texto del mensaje ---------- */
  var TIPOS_RE = [
    ["mayorista", /^\s*(venta\s+)?mayorista\b/i],
    ["sena", /^\s*se[ñn]a\b/i],
    ["venta", /^\s*(venta|vendi|vendimos)\b/i],
    ["sueldo", /^\s*sueldo\b/i],
    ["envio", /^\s*(env[ií]o|v[ií]a\s*cargo|andreani|correo|oca)\b/i],
    ["pago", /^\s*(pago|pagu[eé]|pagamos|pag[oó]|compra|compr[eé])(?![a-záéíóúñ])/i]
  ];
  function leerTexto(t){
    var r = { falta: [] }, s = String(t || "").trim(); if (!s) return r;
    /* "Euge pagó…", "Pau cobró…": quién va primero, la acción después */
    var pre = s.match(/^\s*(euge|eugenia|pau|paula|pali)\s+(?=(pag|cobr|compr|vend|transf|deposit|gast|abon|sueld))/i);
    if (pre){ r.por = quien(pre[1]); s = s.slice(pre[0].length); }
    for (var i = 0; i < TIPOS_RE.length; i++) if (TIPOS_RE[i][1].test(s)){ r.tipo = TIPOS_RE[i][0]; break; }
    if (!r.tipo && /v[ií]a\s*cargo|andreani|etiqueta/i.test(s)) r.tipo = "envio";
    var por = s.match(/\b(?:por|pag[oó]|cobr[oó]|entr[oó]\s+a|a\s+cuenta\s+de)\s+(euge|eugenia|pau|paula|pali)\b/i);
    if (por) r.por = quien(por[1]);
    var m = s.match(/\$\s*([\d.,]+)/) || s.match(/\b(\d{1,3}(?:\.\d{3})+(?:,\d+)?)\b/) || s.match(/\b(\d{4,9})\b/);
    if (m) r.monto = numAR(m[1]);
    if (/efectivo|eftvo/i.test(s)) r.medio = "efectivo"; else if (/tarjeta|cr[eé]dito|d[eé]bito/i.test(s)) r.medio = "tarjeta";
    else if (/transf/i.test(s)) r.medio = "transferencia"; else if (/mercado\s*pago|\bmp\b/i.test(s)) r.medio = "mercado pago";
    if (/no\s+factur/i.test(s)) r.factura = "no"; else if (/factur/i.test(s)) r.factura = "si";
    var pres = s.match(/presupuesto\s*(?:n[°º.]?|#)?\s*(\d+)|#\s*(\d{2,6})\b/i); if (pres) r.presupuesto = pres[1] || pres[2];
    /* contraparte: lo que queda en la primera línea sin la palabra clave, el monto y el "por X" */
    /* "por lámparas" = el concepto (si no es "por Euge/Pau") */
    var porC = s.split(/\n/)[0].match(/\bpor\s+(?!(?:euge|eugenia|pau|paula|pali)\b)([a-záéíóúñü][a-záéíóúñü\s]*?)\s*(?=$|,|\.|\d|\$|\b(?:en\s+)?(?:efectivo|transf\w*|tarjeta|mercado\s*pago|mp)\b)/i);
    if (porC && porC[1].trim()) r.concepto = porC[1].trim().charAt(0).toUpperCase() + porC[1].trim().slice(1);
    var l1 = s.split(/\n/)[0]
      .replace(/^\s*(venta\s+mayorista|venta|mayorista|se[ñn]a|sueldo|pag[oó]|pagu[eé]|pagamos|compra|compr[eé]|env[ií]o)(?![a-záéíóúñ])/i, "")
      .replace(/\$\s*[\d.,]+/g, "").replace(/\b\d{4,9}\b/g, "").replace(/\bpor\s+(?!(?:euge|eugenia|pau|paula|pali)\b).*$/i, "").replace(/\b\d{1,3}(?:\.\d{3})+(?:,\d+)?\b/g, "")
      .replace(/\b(?:por|pag[oó]|cobr[oó])\s+(euge|eugenia|pau|paula|pali)\b/ig, "")
      .replace(/[()\-–:,.]+/g, " ")
      .split(/\s+/).filter(function(w){ return w && !/^(de|a|al|la|el|en|efectivo|transferencia|transf|tarjeta|no|facturado|facturada|facturar)$/i.test(w); }).join(" ").trim();
    if (r.tipo === "envio" && !l1) l1 = (s.match(/v[ií]a\s*cargo|andreani|correo|oca/i) || [""])[0];
    if (r.tipo !== "sueldo") l1 = l1.replace(/\b(euge|eugenia|pau|paula|pali)\b/ig, " ").replace(/\s+/g, " ").trim();
    if (l1) r.contraparte = l1.split(" ").map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
    r.datos = s.split(/\n/).slice(1).join("\n").trim();
    return r;
  }

  /* ---------- 2. el texto de un comprobante (sale del OCR) ---------- */
  function lineaTras(lines, re){
    for (var i = 0; i < lines.length; i++){
      var m = lines[i].match(re); if (!m) continue;
      var resto = lines[i].slice(m.index + m[0].length).trim();
      if (resto.length > 2) return resto;
      for (var j = i + 1; j < Math.min(lines.length, i + 3); j++) if (lines[j].trim().length > 2) return lines[j].trim();
    }
    return "";
  }
  function leerComprobante(txt){
    var r = {}, T = String(txt || ""), lines = T.split(/\r?\n/).map(function(x){ return x.trim(); }).filter(Boolean);
    if (/transferencia\s+enviada|d[eé]bito|pagaste|enviaste|pago\s+realizado|compra/i.test(T)) r.signo = "egreso";
    else if (/transferencia\s+recibida|recibiste|cr[eé]dito|acreditad|te\s+(pag|transfiri)/i.test(T)) r.signo = "ingreso";
    var montos = []; (T.match(/[-−]?\s*\$\s*[\d.,]+/g) || []).forEach(function(x){ var n = numAR(x.replace(/[-−$\s]/g, "")); if (n >= 100) montos.push(n); });
    var imp = T.match(/(?:importe|monto|total)\s*:?\s*\n?\s*[-−]?\s*\$?\s*([\d.,]+)/i);
    r.monto = imp ? numAR(imp[1]) : (montos[0] || 0);
    var f = T.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})\b/); if (f) r.fecha = f[3] + "-" + ("0" + f[2]).slice(-2) + "-" + ("0" + f[1]).slice(-2);
    var de = lineaTras(lines, /^de\s*:?/i), para = lineaTras(lines, /^para\s*:?/i);
    var contra = lineaTras(lines, /nombre\s+contraparte|titular|destinatario|beneficiario/i);
    r.de = de; r.para = para;
    var origen = quien(de), destino = quien(para);
    if (r.signo === "egreso"){ r.cuenta = origen; r.contraparte = contra || (destino ? "" : para); }
    else if (r.signo === "ingreso"){ r.cuenta = destino; r.contraparte = contra || (origen ? "" : de); }
    else { r.cuenta = origen || destino; r.contraparte = contra || ""; }
    if (r.contraparte) r.contraparte = r.contraparte.replace(/\s+(cuit|cuil|cvu|cbu).*$/i, "").trim();
    return r;
  }

  /* ---------- 3. PDF de presupuesto ---------- */
  function leerPresupuestoTexto(txt, lista){
    var T = String(txt || ""), r = {};
    var n = T.match(/presupuesto\s*(?:n[°º.]?|#|nro\.?)?\s*(\d{1,6})/i) || T.match(/\bN[°º]\s*(\d{1,6})/);
    if (n) r.presupuesto = n[1];
    var p = (lista || []).find(function(x){ return r.presupuesto && String(x.num).replace(/\D/g, "") === r.presupuesto; });
    if (p){ r.contraparte = p.cliente || ""; r.monto = Number(p.total) || 0; r.tipo = /may/i.test(p.tipo || "") ? "mayorista" : (r.tipo || "mayorista"); }
    else {
      var t = T.match(/total\s*:?\s*\$?\s*([\d.,]+)/i); if (t) r.monto = numAR(t[1]);
    }
    return r;
  }

  /* ---------- 4. categoría aprendida del historial ---------- */
  var IDX = null, PALABRAS_VACIAS = /^(PAGO|PAGOS|POR|EUGE|PAU|PALI|VENTA|VENTAS|SENA|SUELDO|ENVIO|COMPRA|DESDE|MOVIMIENTOS|PARA|CON|DEL|LOS|LAS|UNA|UNO)$/;
  function armarIndice(filas, cats){
    CATS = cats; IDX = {};
    (filas || []).forEach(function(f){
      var c = String(f.cat || "").trim(); if (!c) return;
      norm((f.concepto || "") + " " + (f.notas || "")).split(" ").forEach(function(w){
        if (w.length < 4 || PALABRAS_VACIAS.test(w) || /^\d+$/.test(w)) return;
        var o = IDX[w] = IDX[w] || {}; o[c] = (o[c] || 0) + 1;
      });
    });
    (cats || []).forEach(function(c){ norm(c.replace(/^\d+\.\d+\s*/, "")).split(" ").forEach(function(w){
      if (w.length < 4 || /^(INSUMO|FIJO|OPERATIVO|LOGISTICA|EMBALAJE|VENTA|SUELDO|COMPRA|PRODUCTOS|PAG|TRANSP|FACTURADA|TARJETA|TRANSFERENCIA)$/.test(w)) return;
      var o = IDX[w] = IDX[w] || {}; o[c] = (o[c] || 0) + 25;
    }); });
  }
  function catDe(r){
    var cats = CATS || [];
    function cat(prefijo){ return cats.find(function(c){ return c.indexOf(prefijo + " ") === 0; }) || null; }
    /* etiquetas de Vía Cargo (u otro transporte): 4.2 LOGISTICA - ET. DE TRANSP. */
    if (r.tipo !== "venta" && r.tipo !== "mayorista" && r.tipo !== "sena" && /etiqueta/i.test(String(r.texto || "") + " " + (r.contraparte || ""))){ if (/v[ií]a\s*cargo/i.test(String(r.texto || "") + " " + (r.contraparte || ""))) r.contraparte = "ETIQUETAS VIA CARGO"; var c42 = cat("4.2"); if (c42) return c42; }
    /* proveedores de reventa: siempre 3.1 COMPRA PRODUCTOS - REVENTA */
    if (r.tipo !== "venta" && r.tipo !== "mayorista" && r.tipo !== "sena"){ var pv = norm((r.contraparte || "") + " " + String(r.texto || "").split(/\n/)[0]).match(/\b(AURORA|LICARI|GRASS|TIKKA|MEKK|ENTRANCE)\b/); if (pv){ r.contraparte = pv[1]; var c31 = cat("3.1"); if (c31) return c31; } }
    if (r.tipo === "sueldo"){
      var q = quien(r.contraparte || "");
      if (q === "euge") return cat("2.2"); if (q === "pau") return cat("2.1");
    }
    if (r.tipo === "venta"){
      var fac = r.factura === "si";
      if (r.medio === "efectivo") return cat("1.1");
      if (r.medio === "tarjeta") return cat(fac ? "1.2" : "1.3");
      return cat(fac ? "1.4" : "1.5");
    }
    if (r.tipo === "mayorista") return cat(r.factura === "si" ? "1.7" : "1.6");
    if (IDX){
      var puntos = {};
      norm((r.contraparte || "") + " " + (r.concepto || "") + " " + (r.texto || "").split(/\n/)[0]).split(" ").forEach(function(w){
        var o = IDX[w]; if (!o || w.length < 4) return;
        if (r.tipo !== "sueldo" && /^(EUGE|EUGENIA|PAULA|PALI)$/.test(w)) return;
        var tot = 0; for (var k in o) tot += o[k];
        for (var c in o) puntos[c] = (puntos[c] || 0) + o[c] / tot;
      });
      var mejor = null, mp = 0;
      for (var c2 in puntos) if (puntos[c2] > mp){ mp = puntos[c2]; mejor = c2; }
      if (mejor && mp >= 0.5){
        var limpia = cats.find(function(c){ return c.trim() === mejor.trim(); }) || cats.find(function(c){ return c.split(" ")[0] === mejor.trim().split(" ")[0]; });
        if (limpia) return limpia;
      }
    }
    if (r.tipo === "envio") return cat("4.1");
    return null;
  }

  /* ---------- 5. librerías del navegador (se bajan una sola vez, recién cuando hacen falta) ---------- */
  var cargas = {};
  function script(src){
    if (cargas[src]) return cargas[src];
    return cargas[src] = new Promise(function(ok, mal){ var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function(){ delete cargas[src]; mal(new Error("No cargó " + src)); }; document.head.appendChild(s); });
  }
  function ocr(dataUrl){
    return script("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js").then(function(){
      return root.Tesseract.recognize(dataUrl, "spa");
    }).then(function(x){ return (x && x.data && x.data.text) || ""; });
  }
  function textoPdf(dataUrl){
    return script("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js").then(function(){
      var lib = root.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      var bin = atob(dataUrl.split(",")[1]), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return lib.getDocument({ data: u }).promise;
    }).then(function(doc){
      var ps = []; for (var i = 1; i <= Math.min(doc.numPages, 3); i++) ps.push(doc.getPage(i).then(function(p){ return p.getTextContent(); }).then(function(tc){ return tc.items.map(function(x){ return x.str; }).join("\n"); }));
      return Promise.all(ps).then(function(a){ return a.join("\n"); });
    });
  }
  function archivo(id){
    return new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).fotoB64(id); });
  }

  /* ---------- todo junto ---------- */
  function leer(m, presupuestos){
    var r = leerTexto(m.texto); r.texto = m.texto || ""; r.leido = ["texto"];
    var adj = (m.adj || []).filter(function(a){ return a && a.id && /image|pdf/i.test((a.t || "") + " " + (a.n || "")); }).slice(0, 2);
    var cadena = Promise.resolve();
    adj.forEach(function(a){
      cadena = cadena.then(function(){ return archivo(a.id); }).then(function(url){
        if (/pdf/i.test(a.t || a.n || "") || /^data:application\/pdf/.test(url)){
          return textoPdf(url).then(function(t){ var p = leerPresupuestoTexto(t, presupuestos); mezclar(r, p); r.leido.push("pdf"); });
        }
        return ocr(url).then(function(t){ var c = leerComprobante(t); r.comprobante = { de: c.de, para: c.para }; mezclar(r, c); r.leido.push("comprobante"); });
      }).catch(function(e){ r.errores = (r.errores || []).concat(String(e && e.message || e).slice(0, 120)); });
    });
    return cadena.then(function(){
      if (!r.por && r.cuenta) r.por = r.cuenta;
      if (!r.signo) r.signo = /^(venta|mayorista|sena)$/.test(r.tipo) ? "ingreso" : /^(pago|sueldo|envio)$/.test(r.tipo) ? "egreso" : "";
      if (!r.tipo) r.tipo = r.signo === "ingreso" ? "venta" : r.signo === "egreso" ? "pago" : "otro";
      r.cat = catDe(r);
      r.falta = [];
      if (!r.monto) r.falta.push("monto");
      if (!r.por) r.falta.push("a quién se carga");
      if (!r.cat) r.falta.push("categoría");
      return r;
    });
  }
  /* el texto manda sobre el comprobante, salvo campos vacíos */
  function mezclar(r, x){ for (var k in x) if (x[k] && !r[k]) r[k] = x[k]; if (x.cuenta) r.cuenta = x.cuenta; }

  root.__nvLector = { leer: leer, armarIndice: armarIndice, leerTexto: leerTexto, leerComprobante: leerComprobante, leerPresupuestoTexto: leerPresupuestoTexto, catDe: catDe };
})(typeof window !== "undefined" ? window : globalThis);
