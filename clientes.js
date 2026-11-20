/* Mayoristas · Clientes: una sola vista con Activos / En contacto / Para activar, y la ficha completa de cada cliente */
(function(){
  if (window.__nvClientes) return; window.__nvClientes = 1;
  var MODO = true, ABIERTO = {}, GRUPO = { act: false, con: false, dor: false }, SEC = {}, BUSCA = "", BASE = null, CARGANDO = false;
  var css = document.createElement("style");
  css.textContent = [
    "main#list .my-top .pz-sw > button:not(.nvcl-tab):not(.nvml-tab){display:none!important}",
    "main#list.nvcl-on > *:not(.my-top):not(#nvcl){display:none!important}",
    "#nvcl{--ar:#F6F2ED;--hu:#ECE6DF;--bo:#E2DAD1;--ti:#4A3F37;--su:#8C7D71;--ma:#9C7B62;--ro:#B9776B;--ve:#6E8F72;--az:#7E9AA6;color:var(--ti);margin-top:14px}",
    "#nvcl .k{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}",
    "#nvcl .k div{background:var(--hu);border-radius:20px;padding:14px 16px;box-shadow:inset 3px 3px 8px rgba(120,100,85,.15),inset -3px -3px 8px rgba(255,255,255,.75)}",
    "#nvcl .k b{display:block;font-size:26px;font-weight:600}#nvcl .k span{font-size:12px;color:var(--su)}",
    "#nvcl .bus{width:100%;box-sizing:border-box;border:0;outline:0;background:var(--hu);border-radius:14px;padding:11px 16px;font:inherit;font-size:14px;color:var(--ti);margin-bottom:14px;box-shadow:inset 2px 2px 6px rgba(120,100,85,.15),inset -2px -2px 6px rgba(255,255,255,.8)}",
    "#nvcl .g{background:#fff;border:1px solid var(--bo);border-radius:22px;margin-bottom:12px;overflow:hidden}",
    "#nvcl .gh{display:flex;align-items:center;gap:10px;width:100%;border:0;background:none;padding:14px 18px;font:inherit;cursor:pointer;color:var(--ti);text-align:left}",
    "#nvcl .gh b{font-size:16px;font-weight:600}#nvcl .gh small{color:var(--su);font-size:12.5px;flex:1}#nvcl .gh i{font-style:normal;background:var(--hu);border-radius:999px;padding:2px 10px;font-size:12.5px}#nvcl .gh em{font-style:normal;color:var(--su);transition:transform .2s}#nvcl .g.cerr .gh em{transform:rotate(-90deg)}",
    "#nvcl .dot{width:10px;height:10px;border-radius:50%}",
    "#nvcl .c{border-top:1px solid var(--bo)}",
    "#nvcl .ch{display:grid;grid-template-columns:38px 1fr auto auto;gap:12px;align-items:center;width:100%;border:0;background:none;padding:11px 18px;font:inherit;cursor:pointer;text-align:left;color:var(--ti)}",
    "#nvcl .ch:hover{background:#FBF9F6}",
    "#nvcl .av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:600;background:#EFE6DE;color:var(--ma)}",
    "#nvcl .nm{font-weight:600;font-size:14.5px;line-height:1.2}#nvcl .sb{font-size:12px;color:var(--su);margin-top:2px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}",
    "#nvcl .tag{display:inline-block;border-radius:999px;padding:2px 9px;font-size:11.5px;background:var(--hu);color:var(--su)}#nvcl .tag.ro{background:#F6E1DD;color:var(--ro)}#nvcl .tag.ve{background:#E3EDE4;color:var(--ve)}#nvcl .tag.am{background:#F5ECD9;color:#9A7A3E}",
    "#nvcl .tot{font-size:13px;font-weight:600;text-align:right;white-space:nowrap}#nvcl .tot small{display:block;font-weight:400;color:var(--su);font-size:11.5px}",
    "#nvcl .fl{color:var(--su);transition:transform .2s}#nvcl .c.on .fl{transform:rotate(90deg)}",
    "#nvcl .fi{display:none;padding:4px 18px 18px 68px}#nvcl .c.on .fi{display:block}",
    "#nvcl .acc{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 14px}",
    "#nvcl .bt{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:13px;cursor:pointer;background:var(--hu);color:var(--ti);text-decoration:none;display:inline-flex;align-items:center;gap:6px}#nvcl .bt.wa{background:#4E6B4F;color:#fff}#nvcl .bt.os{background:var(--ti);color:#fff}#nvcl .bt[disabled]{opacity:.45;cursor:default}",
    "#nvcl .res{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:14px}#nvcl .res div{background:var(--ar);border-radius:14px;padding:9px 11px}#nvcl .res small{display:block;font-size:11px;color:var(--su)}#nvcl .res b{font-size:14px;font-weight:600}",
    "#nvcl .fr{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 10px;margin-bottom:12px}#nvcl .fr label{display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--su);text-transform:uppercase;letter-spacing:.05em}#nvcl .fr label.a2{grid-column:span 2}#nvcl .fr label.a4{grid-column:1/-1}",
    "#nvcl .in{border:0;outline:0;background:var(--ar);border-radius:10px;padding:8px 10px;font:inherit;font-size:13.5px;color:var(--ti);text-transform:none;letter-spacing:0;box-shadow:inset 1px 1px 3px rgba(120,100,85,.12)}#nvcl textarea.in{min-height:56px;resize:vertical}",
    "#nvcl .ps{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:var(--ar);border-radius:14px;padding:10px 12px;margin-bottom:12px}#nvcl .ps .in{background:#fff}#nvcl .ps .in.t{flex:1;min-width:180px}",
    "#nvcl .sc{border:1px solid var(--bo);border-radius:14px;margin-bottom:8px;overflow:hidden}#nvcl .sc>button{display:flex;justify-content:space-between;width:100%;border:0;background:#FBF9F6;padding:10px 14px;font:inherit;font-size:13.5px;font-weight:600;color:var(--ti);cursor:pointer}#nvcl .sc>button span{font-weight:400;color:var(--su)}",
    "#nvcl .sc .li{display:none;padding:4px 14px 10px}#nvcl .sc.on .li{display:block}",
    "#nvcl .it{display:grid;grid-template-columns:92px 1fr auto;gap:10px;padding:7px 0;border-top:1px solid #F0EBE5;font-size:13px}#nvcl .it:first-child{border-top:0}#nvcl .it i{font-style:normal;color:var(--su)}#nvcl .it b{font-weight:600;white-space:nowrap}",
    "#nvcl .vac{color:var(--su);font-size:13px;padding:8px 0}",
    "#nvcl .wa-t{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:-4px 0 14px}#nvcl .wa-t small{color:var(--su);font-size:12px;margin-right:2px}#nvcl .wa-t a{border-radius:999px;padding:6px 12px;font-size:12.5px;background:#E3EDE4;color:#3F5E43;text-decoration:none}#nvcl .wa-t a:hover{background:#D3E4D5}#nvcl .wa-t button{border:0;background:none;color:var(--su);font:inherit;font-size:12px;cursor:pointer;text-decoration:underline}",
    "#nvcl .top{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}#nvcl .top .p{display:flex;align-items:center;gap:8px;background:var(--ar);border-radius:14px;padding:7px 8px 7px 12px;font-size:13px}#nvcl .top .p b{font-weight:600}#nvcl .top .p i{font-style:normal;color:var(--su);font-size:12px}#nvcl .top .p a{border-radius:999px;padding:4px 9px;font-size:11.5px;background:#E3EDE4;color:#3F5E43;text-decoration:none}",
    "#nvcl .mt{position:fixed;inset:0;background:rgba(74,63,55,.3);z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px}#nvcl .mt>div{background:var(--ar);border-radius:22px;padding:20px;width:100%;max-width:620px;max-height:88vh;overflow:auto}#nvcl .mt h3{margin:0 0 4px;font-size:18px}#nvcl .mt p{margin:0 0 12px;color:var(--su);font-size:13px}#nvcl .mt label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--su);margin-bottom:10px}#nvcl .mt textarea{min-height:70px}#nvcl .mt .pie{display:flex;justify-content:flex-end;gap:8px}",
    "@media(max-width:760px){#nvcl .k{grid-template-columns:repeat(2,1fr)}#nvcl .res{grid-template-columns:repeat(2,1fr)}#nvcl .fr{grid-template-columns:1fr 1fr}#nvcl .fi{padding:4px 14px 16px}#nvcl .ch{grid-template-columns:34px 1fr auto;padding:10px 14px}#nvcl .ch .fl{display:none}#nvcl .it{grid-template-columns:78px 1fr}#nvcl .it b{grid-column:2}}"
  ].join("\n");
  document.head.appendChild(css);

  function S(){ return (window.__nv && window.__nv.S) || {}; }
  function soy(){ return String(S().soy || ""); }
  function hoy(){ var d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }
  function J(v){ if (Array.isArray(v)) return v; try { var x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : []; } catch(e){ return []; } }
  function N(s){ return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function plata(n){ n = Math.round(Number(n) || 0); return "$ " + n.toLocaleString("es-AR"); }
  function fc(iso){ if (!iso) return "—"; var p = String(iso).slice(0, 10).split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0].slice(2) : iso; }
  function dias(iso){ if (!iso) return 99999; return Math.round((Date.parse(hoy()) - Date.parse(String(iso).slice(0, 10))) / 864e5); }
  function hace(d){ if (d >= 99999) return "sin compras"; if (d <= 0) return "hoy"; if (d < 31) return "hace " + d + " d"; var m = Math.round(d / 30); return m < 12 ? "hace " + m + " mes" + (m > 1 ? "es" : "") : "hace " + Math.round(d / 365 * 10) / 10 + " años"; }
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ini(n){ var p = String(n || "?").trim().split(/\s+/); return ((p[0] || "")[0] + ((p[1] || "")[0] || "")).toUpperCase(); }

  function cargarBase(){
    if (CARGANDO || !window.__nvLocal || !window.__nvLocal.baseLeer) return; CARGANDO = true;
    window.__nvLocal.baseLeer([]).then(function(b){ BASE = b; CARGANDO = false; pintar(); }, function(){ CARGANDO = false; });
  }
  // une el historial guardado del cliente con los pedidos mayoristas cargados en el tablero
  function compras(c){
    var L = J(c.hist).map(function(x){ return { f: String(x[0] || "").slice(0, 10), t: Number(x[1]) || 0, d: String(x[2] || "").replace(/\s*·\s*·\s*/g, " · ").trim() }; });
    var nombres = [N(c.nombre)].concat(J(c.alias).map(N)).filter(Boolean);
    ((BASE && BASE.base_may) || []).forEach(function(r){
      var cl = N(r.cliente); if (!cl || !nombres.some(function(n){ return n === cl || (n.length >= 6 && cl.length >= 6 && (cl.indexOf(n) === 0 || n.indexOf(cl) === 0)); })) return;
      if (/CANCEL/i.test(r.estado)) return;
      var t = (Number(r.sena) || 0) + (Number(r.saldo) || 0), f = String(r.fecha || "").slice(0, 10);
      if (L.some(function(x){ return x.f === f && Math.abs(x.t - t) < 2; })) return;
      L.push({ f: f, t: t, d: String(r.pedido || "").replace(/\n+/g, " · "), est: J(r.estado).join(" ").toLowerCase(), pago: J(r.pago).join(" ").toLowerCase() });
    });
    return L.filter(function(x){ return x.f; }).sort(function(a, b){ return a.f < b.f ? 1 : -1; });
  }
  function info(c){
    var C = compras(c), tot = C.reduce(function(s, x){ return s + x.t; }, 0), ult = C[0] ? C[0].f : "", d = dias(ult);
    var log = J(c.log), ultLog = log.reduce(function(m, x){ return x[0] > m ? x[0] : m; }, "");
    var grupo = d <= 90 ? "act" : (((c.paso && !(c.fp && ult && c.fp < ult)) || c.etapa === "nuevo" || (ultLog && dias(ultLog) <= 45)) ? "con" : "dor");
    // si el paso anotado es de antes de la última compra, ya quedó viejo: no se muestra como atrasado
    var pasoViejo = !!(c.paso && c.fp && ult && c.fp < ult);
    var tienePaso = c.paso && !pasoViejo;
    // ritmo automático después de cada compra: al mes escribirles, a los 75 días ofrecer reposición, a los 5 meses reactivar
    var auto = null;
    if (!tienePaso && ult){
      if (d >= 30 && d < 75) auto = { paso: "Escribirles para ver cómo les va", fp: sumarDias(ult, 30), k: "seg", ic: "💬" };
      else if (d >= 75 && d <= 150) auto = { paso: "Ofrecer reposición sin mínimo", fp: sumarDias(ult, 75), k: "rep", ic: "🔁" };
      else if (d > 150) auto = { paso: "Mandar mensaje para reactivar", fp: sumarDias(ult, 150), k: "rea", ic: "✨" };
    }
    // último pedido mayorista sin pagar
    var debe = false; try { var ped = ((BASE && BASE.base_may) || []).filter(function(r){ return N(r.cliente) && [N(c.nombre)].concat(J(c.alias).map(N)).indexOf(N(r.cliente)) >= 0 && !/CANCEL/i.test(r.estado); }).sort(function(a, b){ return a.fecha < b.fecha ? 1 : -1; })[0]; debe = !!(ped && Number(ped.saldo) > 0); } catch(e){}
    return { pasoViejo: pasoViejo, tienePaso: tienePaso, debe: debe, c: c, C: C, tot: tot, ult: ult, d: d, rep: C.length > 1 ? C[0].f : "", pri: C.length ? C[C.length - 1].f : "", log: log, grupo: grupo, auto: auto };
  }
  function guardar(c, campos){
    campos.id = c.id; campos.cambiado = String(Date.now()); campos.por = soy() || c.por;
    Object.keys(campos).forEach(function(k){ c[k] = campos[k]; });
    try { var L = S().mayclientes || []; L.forEach(function(x){ if (x.id === c.id) Object.keys(campos).forEach(function(k){ x[k] = campos[k]; }); }); } catch(e){}
    if (window.__nvLocal && window.__nvLocal.guardar) window.__nvLocal.guardar(["mayclientes", campos]).catch(function(e){ alert("No se pudo guardar: " + (e && e.message || e)); });
  }
  function agregarLog(c, texto, tipo){ var L = J(c.log); L.unshift([hoy(), texto, tipo || "nota", soy()]); guardar(c, { log: JSON.stringify(L.slice(0, 200)) }); }


  /* ---------- mensajes de WhatsApp listos (se pueden editar) ---------- */
  var MSJ_DEF = {
    rep: ["Reposición", "Hola {nombre}! ¿Cómo están? Ya pasaron unos meses desde su último pedido 🙌 Les recordamos que la reposición no tiene mínimo. ¿Les armamos un pedido? Todo el catálogo está en nervomayorista.com"],
    cat: ["Catálogo nuevo", "Hola {nombre}! Ya está el catálogo mayorista actualizado con las novedades del mes 🤎 Lo pueden ver en nervomayorista.com ¿Quieren que les separemos algo?"],
    rea: ["Reactivar", "Hola {nombre}! Hace un tiempo que no hablamos y queríamos contarles que tenemos muchas novedades 🤎 Si quieren les pasamos el catálogo con los precios actualizados. ¡Nos encantaría volver a trabajar juntos!"],
    seg: ["Seguimiento de pedido", "Hola {nombre}! ¿Cómo están? Les escribimos para contarles cómo viene su pedido. Cualquier cosa nos avisan 🙌"],
    gra: ["Gracias por la compra", "Hola {nombre}! Muchas gracias por su compra 🤎 Cualquier cosa que necesiten estamos por acá. ¡Que lo disfruten!"]
  };
  function msjs(){
    var M = {}; Object.keys(MSJ_DEF).forEach(function(k){ M[k] = MSJ_DEF[k].slice(); });
    try { var cf = (S().config || []).find(function(x){ return x.id === "may_wa"; }); var g = cf && JSON.parse(cf.datos || "{}"); if (g) Object.keys(g).forEach(function(k){ if (M[k] && g[k]) M[k][1] = g[k]; }); } catch(e){}
    return M;
  }
  function nombreCorto(c){ return String(c.cont || c.nombre || "").split(/[|(]/)[0].trim(); }
  function waLink(c, texto){ var tel = String(c.tel || "").replace(/\D/g, ""); if (!tel) return ""; if (tel.length <= 10) tel = "549" + tel; return "https://wa.me/" + tel + "?text=" + encodeURIComponent(String(texto).replace(/\{nombre\}/g, nombreCorto(c)).replace(/\{producto\}/g, "")); }
  function editarMsjs(){
    var M = msjs(), box = document.getElementById("nvcl"), fondo = h("div", "mt"), caja = h("div");
    caja.append(h("h3", null, "Mensajes de WhatsApp"), h("p", null, "Usá {nombre} para el nombre del cliente. Se guardan para las dos."));
    var ins = {};
    Object.keys(M).forEach(function(k){ var l = h("label"), t = h("textarea", "in"); t.value = M[k][1]; ins[k] = t; l.append(h("span", null, M[k][0]), t); caja.append(l); });
    var pie = h("div", "pie"), no = h("button", "bt", "Cancelar"), si = h("button", "bt os", "Guardar"); no.type = si.type = "button";
    no.onclick = function(){ fondo.remove(); };
    si.onclick = function(){
      var o = {}; Object.keys(ins).forEach(function(k){ o[k] = ins[k].value.trim(); });
      var item = { id: "may_wa", datos: JSON.stringify(o), cambiado: String(Date.now()), por: soy() };
      try { var L = S().config || (S().config = []), x = L.find(function(y){ return y.id === "may_wa"; }); if (x) Object.assign(x, item); else L.push(item); } catch(e){}
      if (window.__nvLocal && window.__nvLocal.guardar) window.__nvLocal.guardar(["config", item]);
      fondo.remove(); pintar();
    };
    pie.append(no, si); caja.append(pie); fondo.append(caja); fondo.onclick = function(e){ if (e.target === fondo) fondo.remove(); }; box.append(fondo);
  }
  /* ---------- lo que más compra cada cliente ---------- */
  function productos(C){
    var P = {};
    C.forEach(function(x){ String(x.d || "").replace(/detalle pedido:?/ig, "").split(/\s*(?:·|\*|\n|;)\s*/).forEach(function(seg){
      var m = /^(\d+)\s*[x×]?\s+(.+?)(?:\s*:?\s*\$\s*[\d.,]+)?\s*$/i.exec(seg.trim()); if (!m) return;
      var nombre = m[2].replace(/:$/, "").trim(); if (nombre.length < 3) return;
      var k = N(nombre).split(" ").filter(function(w){ return !/^\d/.test(w) && w.length > 1; }).slice(0, 3).join(" "); if (!k) return;
      if (!P[k]) P[k] = { n: nombre, q: 0, v: 0, ult: "" }; P[k].q += Number(m[1]) || 1; P[k].v++; if (x.f > P[k].ult) P[k].ult = x.f;
    }); });
    return Object.keys(P).map(function(k){ return P[k]; }).sort(function(a, b){ return b.q - a.q || b.v - a.v; });
  }
  function lindo(n){ return String(n).toLowerCase().split(/\s+/).slice(0, 5).join(" ").replace(/(^|\s)\S/g, function(x){ return x.toUpperCase(); }); }
  function sumarDias(iso, n){ var d = new Date(String(iso).slice(0, 10) + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

  function seccion(id, titulo, cuenta, llenar){
    var s = h("div", "sc" + (SEC[id] ? " on" : "")), b = h("button"); b.type = "button";
    b.append(h("span", null, titulo).cloneNode(true)); b.firstChild.style.cssText = "font-weight:600;color:inherit"; b.append(h("span", null, cuenta + "  " + (SEC[id] ? "▾" : "▸")));
    var li = h("div", "li"); b.onclick = function(){ SEC[id] = !SEC[id]; s.classList.toggle("on", !!SEC[id]); b.lastChild.textContent = cuenta + "  " + (SEC[id] ? "▾" : "▸"); if (SEC[id] && !li.dataset.ok){ li.dataset.ok = 1; llenar(li); } };
    if (SEC[id]){ li.dataset.ok = 1; llenar(li); }
    s.append(b, li); return s;
  }
  function campo(lbl, val, cls, on, area){
    var l = h("label", cls || ""), i = h(area ? "textarea" : "input", "in"); i.value = val || ""; i.onchange = function(){ on(i.value.trim()); };
    l.append(h("span", null, lbl), i); return l;
  }
  function ficha(I){
    var c = I.c, f = h("div", "fi"), tel = String(c.tel || "").replace(/\D/g, ""), mails = I.log.filter(function(x){ return x[2] === "mail"; }), act = I.log.filter(function(x){ return x[2] !== "mail"; });
    // acciones
    var a = h("div", "acc");
    var wa = h("a", "bt wa", "WhatsApp"); if (tel){ wa.href = "https://wa.me/" + (tel.length <= 10 ? "549" + tel : tel); wa.target = "_blank"; } else { wa.setAttribute("disabled", ""); wa.textContent = "Sin celular"; }
    var em = h("a", "bt", "✉ Mail"); if (c.email){ em.href = "mailto:" + c.email; } else em.setAttribute("disabled", "");
    var ct = h("button", "bt", "✓ Le escribimos hoy"); ct.type = "button"; ct.onclick = function(){ agregarLog(c, "Le escribimos", "ct"); pintar(); };
    a.append(wa, em, ct); f.append(a);
    var M = msjs(), wt = h("div", "wa-t"); wt.append(h("small", null, "Mensajes listos:"));
    ["rep", "cat", "rea", "seg", "gra"].forEach(function(k){ var l = waLink(c, M[k][1]); if (!l) return; var x = h("a", null, M[k][0]); x.href = l; x.target = "_blank"; x.onclick = function(){ agregarLog(c, "WhatsApp: " + M[k][0], "ct"); }; wt.append(x); });
    var ed = h("button", null, "editar mensajes"); ed.type = "button"; ed.onclick = editarMsjs; wt.append(ed);
    if (tel) f.append(wt);
    // resumen
    var r = h("div", "res");
    [["Total comprado", plata(I.tot)], ["Compras", String(I.C.length)], ["Ticket promedio", I.C.length ? plata(I.tot / I.C.length) : "—"], ["Primera compra", fc(I.pri)], ["Última compra", fc(I.ult)], ["Última reposición", fc(I.rep)]].forEach(function(x){ var d = h("div"); d.append(h("small", null, x[0]), h("b", null, x[1])); r.append(d); });
    f.append(r);
    var P = productos(I.C).slice(0, 5);
    if (P.length){
      f.append(h("div", "sb", "Lo que más compra")).lastChild.style.cssText = "margin:-4px 0 6px;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em";
      var tp = h("div", "top");
      P.forEach(function(x){ var d = h("div", "p"); d.append(h("b", null, lindo(x.n)), h("i", null, x.q + " u. · " + x.v + " pedido" + (x.v > 1 ? "s" : "") + " · últ. " + fc(x.ult)));
        var l = waLink(c, "Hola {nombre}! ¿Cómo vienen con " + lindo(x.n) + "? Si quieren reponer, la reposición no tiene mínimo 🙌 ¿Les separamos?"); if (l){ var o = h("a", null, "Ofrecer"); o.href = l; o.target = "_blank"; o.onclick = function(){ agregarLog(c, "Ofrecimos " + lindo(x.n), "ct"); }; d.append(o); }
        tp.append(d); });
      f.append(tp);
    }
    // próximo paso
    var ps = h("div", "ps"); ps.append(h("span", null, "Próximo paso:"));
    var pt = h("input", "in t"); pt.placeholder = I.auto ? I.auto.paso + " (sugerido)" : "Ej: mandar catálogo nuevo, ofrecer reposición…"; pt.value = I.tienePaso ? c.paso : "";
    var pf = h("input", "in"); pf.type = "date"; pf.value = c.fp || "";
    pt.onchange = function(){ guardar(c, { paso: pt.value.trim() }); }; pf.onchange = function(){ guardar(c, { fp: pf.value }); };
    var ok = h("button", "bt os", "Hecho ✓"); ok.type = "button"; ok.onclick = function(){ if (!c.paso) return; agregarLog(c, "Hecho: " + c.paso, "hecho"); guardar(c, { paso: "", fp: "" }); pintar(); };
    ps.append(pt, pf, ok);
    if (I.auto && !I.tienePaso){ var rl = waLink(c, msjs()[I.auto.k][1]); if (rl){ var rb = h("a", "bt wa", I.auto.ic + " " + I.auto.paso); rb.href = rl; rb.target = "_blank"; rb.onclick = function(){ agregarLog(c, "WhatsApp: " + I.auto.paso, "ct"); guardar(c, { paso: "Ver si respondió", fp: sumarDias(hoy(), 3) }); setTimeout(pintar, 300); }; ps.append(rb); } }
    f.append(ps);
    // datos
    var fr = h("div", "fr");
    fr.append(
      campo("Nombre", c.nombre, "a2", function(v){ if (v) guardar(c, { nombre: v }); }),
      campo("Celular", c.tel, "", function(v){ guardar(c, { tel: v.replace(/[^\d+]/g, "") }); }),
      campo("Mail", c.email, "", function(v){ guardar(c, { email: v }); }),
      campo("Ciudad", c.ciu, "", function(v){ guardar(c, { ciu: v }); }),
      campo("Instagram", c.ig, "", function(v){ guardar(c, { ig: v }); }),
      campo("Contacto", c.cont, "", function(v){ guardar(c, { cont: v }); })
    );
    var abc = h("label"), s = h("select", "in"); ["A", "B", "C"].forEach(function(x){ var o = h("option", null, x + (x === "A" ? " · compra mucho" : x === "B" ? " · compra a veces" : " · compra poco")); o.value = x; s.append(o); }); s.value = c.abc || "C"; s.onchange = function(){ guardar(c, { abc: s.value }); };
    abc.append(h("span", null, "Categoría"), s); fr.append(abc);
    fr.append(campo("Datos de envío y facturación", c.datos, "a4", function(v){ guardar(c, { datos: v }); }, true), campo("Notas", c.notas, "a4", function(v){ guardar(c, { notas: v }); }, true));
    f.append(fr);
    // historiales colapsados
    f.append(seccion(c.id + "|c", "🧾 Compras", I.C.length + "", function(li){
      if (!I.C.length){ li.append(h("div", "vac", "Todavía no tiene compras cargadas.")); return; }
      I.C.forEach(function(x){ var it = h("div", "it"); it.append(h("i", null, fc(x.f)), h("span", null, x.d || "—"), h("b", null, plata(x.t))); li.append(it); });
    }));
    f.append(seccion(c.id + "|m", "✉ Mails enviados", mails.length + "", function(li){
      if (!mails.length){ li.append(h("div", "vac", "Todavía no se le mandó ningún mail. Cuando se manden desde la solapa Mails, van a quedar anotados acá.")); return; }
      mails.forEach(function(x){ var it = h("div", "it"); it.append(h("i", null, fc(x[0])), h("span", null, x[1]), h("b", null, x[3] ? (x[3] === "pau" ? "Pau" : x[3] === "euge" ? "Euge" : x[3]) : "")); li.append(it); });
    }));
    f.append(seccion(c.id + "|s", "📝 Seguimiento", act.length + "", function(li){
      var nota = h("div", "ps"); var ni = h("input", "in t"); ni.placeholder = "Anotar algo (llamada, respuesta, pedido de precios…)"; var nb = h("button", "bt", "Anotar"); nb.type = "button";
      nb.onclick = function(){ var v = ni.value.trim(); if (!v) return; agregarLog(c, v, "nota"); pintar(); }; nota.append(ni, nb); li.append(nota);
      if (!act.length){ li.append(h("div", "vac", "Sin movimientos todavía.")); return; }
      act.forEach(function(x){ var it = h("div", "it"); it.append(h("i", null, fc(x[0])), h("span", null, x[1]), h("b", null, x[2] === "ct" ? "contacto" : x[2] === "hecho" ? "hecho" : "")); li.append(it); });
    }));
    return f;
  }
  function fila(I){
    var c = I.c, w = h("div", "c" + (ABIERTO[c.id] ? " on" : "")), b = h("button", "ch"); b.type = "button";
    var mid = h("div"), sb = h("div", "sb");
    mid.append(h("div", "nm", c.nombre || "Sin nombre"), sb);
    var lugar = c.ciu || (String(c.datos || "").match(/(?:-|,)\s*([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{3,})\s*-/) || [])[1];
    if (lugar) sb.append(h("span", null, String(lugar).trim().toLowerCase().replace(/(^|\s)\S/g, function(x){ return x.toUpperCase(); })));
    sb.append(h("span", "tag" + (I.grupo === "act" ? " ve" : I.d <= 180 ? " am" : ""), I.ult ? "últ. compra " + hace(I.d) : "sin compras"));
    if (I.debe) sb.append(h("span", "tag am", "💳 esperando pago"));
    if (I.tienePaso){ var at = c.fp && c.fp < hoy(); sb.append(h("span", "tag" + (at ? " ro" : ""), (at ? "pendiente · " : (c.fp ? fc(c.fp) + " · " : "")) + c.paso)); }
    else if (I.auto && I.auto.k !== "rea") sb.append(h("span", "tag am", I.auto.ic + " " + I.auto.paso.toLowerCase()));
    var tot = h("div", "tot", plata(I.tot)); tot.append(h("small", null, I.C.length + " compra" + (I.C.length === 1 ? "" : "s")));
    var av = h("span", "av", ini(c.nombre)); var fl = h("span", "fl", "›");
    b.append(av, mid, tot, fl);
    b.onclick = function(){ ABIERTO[c.id] = !ABIERTO[c.id]; w.classList.toggle("on", !!ABIERTO[c.id]); if (ABIERTO[c.id] && !w.querySelector(".fi")) w.append(ficha(I)); };
    w.append(b); if (ABIERTO[c.id]) w.append(ficha(I));
    return w;
  }
  function pintar(){
    var box = document.getElementById("nvcl"); if (!box) return;
    if (!BASE) cargarBase();
    var L = (S().mayclientes || []).map(info), q = N(BUSCA);
    if (q) L = L.filter(function(I){ return N([I.c.nombre, I.c.ciu, I.c.datos, I.c.email, I.c.tel, J(I.c.alias).join(" ")].join(" ")).indexOf(q) >= 0; });
    var G = { act: [], con: [], dor: [] }; L.forEach(function(I){ G[I.grupo].push(I); });
    G.act.sort(function(a, b){ return a.d - b.d; });
    G.con.sort(function(a, b){ return (a.c.fp || "9") < (b.c.fp || "9") ? -1 : 1; });
    G.dor.sort(function(a, b){ return b.tot - a.tot; });
    var hoyN = L.filter(function(I){ return (I.tienePaso && I.c.fp && I.c.fp <= hoy()) || (I.auto && I.auto.k !== "rea" && I.auto.fp <= hoy()); }).length;
    var scroll = window.scrollY, foco = document.activeElement && document.activeElement.classList.contains("bus");
    box.innerHTML = "";
    var k = h("div", "k");
    [[G.act.length, "activos · compraron en 3 meses"], [G.con.length, "en contacto"], [G.dor.length, "para activar"], [hoyN, "para hacer hoy"]].forEach(function(x){ var d = h("div"); d.append(h("b", null, String(x[0])), h("span", null, x[1])); k.append(d); });
    var bus = h("input", "bus"); bus.placeholder = "Buscar cliente por nombre, ciudad, mail o celular…"; bus.value = BUSCA;
    bus.oninput = function(){ BUSCA = bus.value; clearTimeout(bus._t); bus._t = setTimeout(pintar, 200); };
    box.append(k, bus);
    [["act", "Activos", "compraron en los últimos 3 meses", "#6E8F72"], ["con", "En contacto", "les escribimos o tienen un próximo paso", "#C9A24F"], ["dor", "Para activar", "hace más de 3 meses que no compran · arriba los que más compraron", "#B9776B"]].forEach(function(g){
      var lista = G[g[0]], abierto = q ? true : GRUPO[g[0]];
      var s = h("div", "g" + (abierto ? "" : " cerr")), gh = h("button", "gh"); gh.type = "button";
      var dot = h("span", "dot"); dot.style.background = g[3];
      gh.append(dot, h("b", null, g[1]), h("small", null, g[2]), h("i", null, String(lista.length)), h("em", null, "▾"));
      gh.onclick = function(){ GRUPO[g[0]] = !GRUPO[g[0]]; pintar(); };
      s.append(gh);
      if (abierto){ if (!lista.length) { var v = h("div", "vac", "Nadie por acá."); v.style.padding = "0 18px 14px"; s.append(v); } lista.forEach(function(I){ s.append(fila(I)); }); }
      box.append(s);
    });
    if (foco){ bus.focus(); bus.setSelectionRange(bus.value.length, bus.value.length); }
    window.scrollTo(0, scroll);
  }
  window.__nvClientesPintar = pintar;

  function montar(){
    var main = document.querySelector("main#list"); if (!main) return;
    var top = main.querySelector(".my-top"), sw = top && top.querySelector(".pz-sw");
    if (!sw){ main.classList.remove("nvcl-on"); var bx = document.getElementById("nvcl"); if (bx) bx.remove(); return; }
    var b = sw.querySelector(".nvcl-tab");
    if (!b){ b = document.createElement("button"); b.type = "button"; b.className = "nvcl-tab"; b.textContent = "Clientes"; sw.insertBefore(b, sw.firstChild); }
    var mails = main.classList.contains("nvml-on"); if (mails) MODO = false;
    b.classList.toggle("on", MODO);
    sw.querySelectorAll("button:not(.nvcl-tab):not(.nvml-tab)").forEach(function(x){ x.classList.remove("on"); });
    main.classList.toggle("nvcl-on", MODO);
    var box = document.getElementById("nvcl");
    if (MODO){ if (!box || box.parentNode !== main){ if (box) box.remove(); box = document.createElement("div"); box.id = "nvcl"; top.after(box); pintar(); } }
    else if (box) box.remove();
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("main#list .my-top .pz-sw button"); if (!b) return;
    if (b.classList.contains("nvcl-tab")){ MODO = true; var m = document.querySelector("main#list"); if (m) m.classList.remove("nvml-on"); }
    else MODO = false;
    setTimeout(montar, 30);
  }, true);
  setInterval(function(){ try { montar(); } catch(e){} }, 700);
})();
