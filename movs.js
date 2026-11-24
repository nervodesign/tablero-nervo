/* #movimientos: cada mensaje del canal pasa por la IA y queda "pendiente de aprobación" en la solapa Movimientos */
(function(){
  if (window.__nvMov) return; window.__nvMov = 1;
  var SB = window.__sb; if (!SB) return;
  /* el lector (sin IA) viene en su propio archivo */
  (function(){ if (window.__nvLector) return; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src);
    var sc = document.createElement("script"); sc.src = "lector.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();
  var CANAL = "mov", DESDE = Date.parse("2026-11-18T00:00:00-03:00");
  var TIPOS = [["venta","Venta minorista","+"],["mayorista","Venta mayorista","+"],["sena","Seña","+"],["pago","Pago","-"],["sueldo","Sueldo","-"],["envio","Envío","-"],["otro","Otro",""]];
  var QUIEN = { "eugeabdon@gmail.com": "euge", "mpauabdon@gmail.com": "pau", "nervodesigncordoba@gmail.com": "nervo" };
  var NOM = { euge: "Euge", pau: "Pau", nervo: "Nervo" };
  var CATS = ["1.1 VENTA MIN. EFTVO", "1.2 VENTA MIN. TARJETA FACTURADA", "1.3 VENTA MIN. TARJETA NO FACTURADA", "1.4 VENTA MIN. TRANSFERENCIA FACTURADA", "1.5 VENTA MIN. TRANSFERENCIA NO FACTURADA", "1.6 VENTA MAY. NO FACTURADA", "1.7 VENTA MAY. FACTURADA", "1.8 DEVOLUCIÓN RECIBIDA", "2.1 SUELDO - SUELDO PAU", "2.2 SUELDO - SUELDO EUGE", "2.3 MO - HERRERO GABRIEL", "2.4 MO - TEJEDORA LAURA", "2.5 MO - EMP DEPÓSITO DAMIÁN", "2.6 MO - TEJEDORA RAQUEL", "2.7 MO - TEJEDORA IRIS", "2.8 PEDRO CARPINTERO", "3.1 COMPRA PRODUCTOS - REVENTA", "3.2 INSUMO - HIERRO", "3.3 INSUMO - HILOS Y TEJIDOS", "3.4 INSUMO - KITS ELÉCTRICOS", "3.5 INSUMO- ADHESIVOS Y TERMINACIONES", "3.6 INSUMO - FERRETERÍA Y OTROS", "4.1 LOGISTICA - ET. DE TRANSP. PAG. X NERVO", "4.2 LOGISTICA - ET. DE TRANSP. PAG. X CLIENTE", "4.3 EMBALAJE - MATERIALES", "4.4 EMBALAJE- PACKAGING DE MARCA", "4.5 GASTOS DE ENVIOS PROVEEDORES", "5.1 FIJO - CONTADOR", "5.2 FIJO- MONOTRIBUTO E IMPUESTOS", "5.3 FIJO - ALQUILER DEPÓSITO", "5.4 FIJO - PLATAFORMAS DIGITALES", "5.5 FIJO - SERVICIOS DEPOSITO", "6.1 MKT - PUBLICIDAD DIGITAL", "6.2 MANTENIMIENTO - DEPÓSITO Y EQUIPOS", "6.3 OPERATIVO - COMIDAS Y VIÁTICOS", "6.4 OPERATIVO - REGALOS Y EVENTOS", "6.5 OPERATIVO -  LIMPIEZA Y DEPÓSITO", "6.6 DEVOLUCION AL CLIENTE", "7.4 FINANCIERO - SALDO INICIAL"];
  var GRUPOS_FIN = { "1": "1.0 INGRESOS", "2": "2.0 MANO DE OBRA", "3": "3.0 PRODUCCIÓN E INSUMOS", "4": "4.0 LOGÍSTICA Y ENVÍOS", "5": "5.0 GASTOS FIJOS", "6": "6.0 GASTOS VARIABLES OPERATIVOS", "7": "7.0 MOVIMIENTOS FINANCIEROS" };
  function catLimpia(c){ c = String(c || "").trim(); if (!c) return null; var k = c.split(" ")[0]; return CATS.find(function(x){ return x === c; }) || CATS.find(function(x){ return x.split(" ")[0] === k; }) || null; }
  function catCorta(c){ return String(c || "").replace(/^\d+\.\d+\s*/, ""); }
  function esBorradorVenta(r){ return r.tipo === "venta" && !/^venta:/.test(r.msg_id || ""); }
  var ROWS = [], SOY = null, LISTO = false, ENCURSO = {}, FILTRO = "pend", RECIEN = {}, COLAP = { ventas: true, plata: true }; /* siempre arranca contraído: se ve cuántos hay y se abre a mano */
  function h(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function plata(n){ n = Number(n) || 0; return "$" + Math.round(n).toLocaleString("es-AR"); }
  function tipoDe(k){ return TIPOS.find(function(t){ return t[0] === k; }) || TIPOS[6]; }
  function signoDe(r){ return r.signo === "ingreso" ? "+" : r.signo === "egreso" ? "-" : tipoDe(r.tipo)[2]; }
  function toast(t){ var d = h("div", "nvtoast", t); document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 3500); }
  function diaDe(ts){ var d = new Date(ts); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function diaLargo(k){ var p = k.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]); var s = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }); return s.charAt(0).toUpperCase() + s.slice(1); }
  function destino(r){
    var q = NOM[r.por] || "❓";
    return "Finanzas " + q + " · " + (r.cat ? catCorta(r.cat) : "❓ categoría");
  }

  /* ---------- datos ---------- */
  function cargar(){
    return SB.from("movimientos").select("*").order("msg_at", { ascending: false }).limit(2000).then(function(r){
      if (r.error){ console.warn("movimientos:", r.error.message); return; }
      ROWS = r.data || []; LISTO = true; pintar();
    });
  }
  function upsertLocal(row){ var i = ROWS.findIndex(function(x){ return x.id === row.id; }); if (i >= 0) ROWS[i] = row; else ROWS.unshift(row); }
  function guardar(row, campos){
    Object.assign(row, campos, { cambiado: new Date().toISOString(), cambiado_por: SOY });
    pintar();
    return SB.from("movimientos").update(Object.assign({}, campos, { cambiado: row.cambiado, cambiado_por: SOY })).eq("id", row.id).then(function(r){ if (r.error) toast("No se pudo guardar: " + r.error.message); });
  }
  function enVivo(){
    SB.channel("nervo-mov").on("postgres_changes", { event: "*", schema: "public", table: "movimientos" }, function(p){
      if (p.eventType === "DELETE"){ ROWS = ROWS.filter(function(x){ return x.id !== (p.old || {}).id; }); }
      else if (p.new) upsertLocal(p.new);
      pintarSuave();
    }).subscribe();
  }

  /* ---------- la IA lee cada mensaje nuevo del canal ---------- */
  function ia(m){
    return new Promise(function(ok, mal){
      try { google.script.run.withSuccessHandler(ok).withFailureHandler(mal).iaMovimiento(m.texto || "", m.adj || [], NOM[m.por] || m.por || "", CATS); } catch(e){ mal(e); }
    });
  }
  function esperarLector(){ return new Promise(function(ok){ (function mirar(n){ if (window.__nvLector || n > 60) ok(); else setTimeout(function(){ mirar(n + 1); }, 250); })(0); }); }
  var IDX_P = null;
  function indice(){
    if (IDX_P) return IDX_P;
    IDX_P = new Promise(function(ok){
      try { google.script.run.withSuccessHandler(function(d){ try { window.__nvLector.armarIndice((d.fin_euge || []).concat(d.fin_pau || []), CATS); } catch(e){} ok(); })
        .withFailureHandler(function(){ window.__nvLector.armarIndice([], CATS); ok(); }).baseLeer(); } catch(e){ ok(); }
    });
    return IDX_P;
  }
  function ayudaIA(x, m){
    ia(m).then(function(res){
      res = res || {}; var c = {};
      if (!x.monto && Number(res.monto)) c.monto = Number(res.monto);
      if (!x.por && /^(euge|pau)$/.test(res.por || res.cuenta)) c.por = /^(euge|pau)$/.test(res.por) ? res.por : res.cuenta;
      if (!x.fecha && /^\d{4}-\d{2}-\d{2}$/.test(res.fecha || "")) c.fecha = res.fecha;
      if (!x.contraparte && res.contraparte) c.contraparte = res.contraparte;
      if (!x.cat && catLimpia(res.cat)) c.cat = catLimpia(res.cat);
      if (!Object.keys(c).length || x.estado !== "pendiente") return;
      c.falta = (x.falta || []).filter(function(f){ return !((f === "monto" && c.monto) || (f === "a quién se carga" && c.por) || (f === "categoría" && c.cat)); });
      guardar(x, c);
    }, function(){});
  }
  function procesar(){
    var N = window.__nv, S = N && N.S; if (!LISTO || !S || !S.chat || !S.chat.m || !SOY) return;
    var ahora = Date.now();
    var nuevos = S.chat.m.filter(function(m){
      return m.canal === CANAL && !m.borrado && !m.padre && !(m.reac && m.reac.__p) && m.creado >= DESDE && ahora - m.creado > 6000 && !ENCURSO[m.id] && !/^\s*✅\s*TODO ACTUALIZADO/i.test(m.texto || "");
    });
    nuevos.forEach(function(m){
      var row = ROWS.find(function(x){ return x.msg_id === m.id; });
      if (row && !(row.estado === "procesando" && ahora - Date.parse(row.cambiado || row.creado) > 120000)) return;
      ENCURSO[m.id] = 1;
      var paso = row ? Promise.resolve(row) : SB.from("movimientos").insert({ msg_id: m.id, msg_at: new Date(m.creado).toISOString(), autor: m.por, texto: m.texto || "", adj: m.adj || [], estado: "procesando" }).select().then(function(r){
        if (r.error) throw r.error; var x = r.data[0]; upsertLocal(x); pintarSuave(); return x;
      });
      paso.then(function(x){
        return esperarLector().then(indice).then(function(){
          var S2 = window.__nv && window.__nv.S;
          return window.__nvLector.leer(m, (S2 && S2.presupuestos) || []);
        }).then(function(res){
          return guardar(x, { tipo: tipoDe(res.tipo)[0], cat: catLimpia(res.cat), signo: /^(ingreso|egreso)$/.test(res.signo) ? res.signo : null, monto: Number(res.monto) || null,
            fecha: /^\d{4}-\d{2}-\d{2}$/.test(res.fecha || "") ? res.fecha : null, por: /^(euge|pau)$/.test(res.por) ? res.por : null, cuenta: /^(euge|pau)$/.test(res.cuenta) ? res.cuenta : null,
            contraparte: res.contraparte || null, concepto: res.concepto || null, medio: res.medio || null, presupuesto: res.presupuesto || null,
            cliente: res.datos ? { datos: res.datos } : null, falta: res.falta || [], ia: { lector: res.leido, errores: res.errores || null }, estado: "pendiente" }).then(function(){
            /* solo si quedó sin monto o sin dueño y hay un archivo, pedimos ayuda a la IA (si está saturada, no pasa nada) */
            if ((!x.monto || !x.por) && (m.adj || []).length) ayudaIA(x, m);
          });
        });
      }).catch(function(e){ if (!/duplicate|23505/i.test(String(e && (e.code || e.message)))) console.warn(e); }).then(function(){ delete ENCURSO[m.id]; });
    });
  }

  /* ---------- en el chat: etiqueta debajo de cada mensaje ---------- */
  function etiqueta(r){
    if (/^\s*\/ojo/i.test(r.texto || "")) return (r.estado === "aprobado" || r.estado === "descartado") ? ["✓ Ojo resuelto", "ok"] : ["⚠ Ojo · para corregir", "pen"];
    if (/^web-/.test(r.msg_id || "")){ var wr = baseMin().find(function(x){ return "web-" + x.id === r.msg_id; }); return wr && !/REVISAR/i.test(wr.env || "") ? ["✓ Venta web revisada", "ok"] : ["● Venta web · para revisar en Movimientos", "pen"]; }
    if (r.estado === "procesando") return ["⏳ Leyendo…", "lee"];
    if (r.estado === "descartado") return ["✖ Descartado", "des"];
    var t = tipoDe(r.tipo)[1] + (r.monto ? " · " + plata(r.monto) : "") + " · " + (NOM[r.por] || "❓");
    return r.estado === "aprobado" ? ["✓ Aprobado · " + t, "ok"] : ["● Pendiente · " + t, "pen"];
  }
  function decorarChat(){
    var S = window.__nv && window.__nv.S, ay = document.querySelector(".chw .nvmov-ayuda");
    if (!S || !S.chat || S.chat.canal !== CANAL){ if (ay) ay.remove(); return; }
    if (!ay){ var fo = document.querySelector(".chw form.chf"); if (fo){ ay = h("div", "nvmov-ayuda"); ay.innerHTML = '<b>Cómo cargar</b><span>“Pagué 200000 a Licari por lámparas, transferencia”</span><span>“Venta Juana Pérez 85000 transferencia, cobró Pau”</span><span>“Me pagó Pintegral 50000 en efectivo”</span>'; fo.before(ay); } }
    document.querySelectorAll(".chw .chmsg[data-id]").forEach(function(el){
      var r = ROWS.find(function(x){ return x.msg_id === el.dataset.id; }); if (!r) return;
      var e = etiqueta(r), b = el.querySelector(".nvmovchip");
      if (!b){ b = h("button", "nvmovchip"); b.type = "button"; b.onclick = function(ev){ ev.stopPropagation(); abrir(); }; (el.querySelector(".chx") || el).after(b); }
      if (b.dataset.t !== e[0]){ b.dataset.t = e[0]; b.textContent = e[0]; b.className = "nvmovchip " + e[1]; }
    });
  }

  /* ---------- aprender: si una vez corregiste la categoría de "Licari", la próxima vez la pone sola ---------- */
  function claveCp(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim(); }
  function aprendido(r){
    var k = claveCp(r.contraparte); if (!k) return null; var best = null;
    ROWS.forEach(function(x){
      if (x === r || !x.cat || claveCp(x.contraparte) !== k) return;
      if (!(x.cliente && x.cliente.catManual) && x.estado !== "aprobado") return;
      var t = Date.parse(x.cambiado || x.creado || "") || 0; if (!best || t > best.t) best = { cat: x.cat, t: t };
    });
    return best && best.cat;
  }
  function aplicarAprendido(){
    ROWS.forEach(function(r){
      if (r.estado !== "pendiente" || esBorradorVenta(r) || (r.cliente && (r.cliente.catManual || r.cliente.catAprendida))) return;
      var c = aprendido(r); if (!c) return;
      var cl = Object.assign({}, r.cliente || {}, { catAprendida: true });
      if (c !== r.cat){ Object.assign(r, { cat: c, cliente: cl }); SB.from("movimientos").update({ cat: c, cliente: cl }).eq("id", r.id).then(function(){}); }
      else { r.cliente = cl; }
    });
  }
  /* ---------- borrar un mensaje del chat = borrarlo de Movimientos (si todavía no está en Finanzas) ---------- */
  document.addEventListener("click", function(e){
    var d = e.target.closest && e.target.closest(".chw .chmsg .chdel"); if (!d || !d.classList.contains("arm")) return;
    var el = d.closest(".chmsg"), id = el && el.dataset.id; if (!id) return;
    var r = ROWS.find(function(x){ return x.msg_id === id; }); if (!r) return;
    if (r.estado === "aprobado"){ toast("Lo borraste del chat. En Movimientos queda porque ya está cargado en Finanzas."); return; }
    SB.from("movimientos").delete().eq("id", r.id).then(function(res){
      if (res.error){ guardar(r, { estado: "descartado" }); return; }
      var i = ROWS.indexOf(r); if (i >= 0) ROWS.splice(i, 1); pintarSuave();
    });
  }, true);

  /* ---------- solapa Movimientos ---------- */
  function tabBtn(){
    var nav = document.querySelector("nav.tabs"); if (!nav) return;
    var b = nav.querySelector(".nvmov-tab");
    if (!b){
      b = h("button", "tab nvmov-tab"); b.type = "button"; b.id = "tab-mov";
      b.innerHTML = '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3"></rect><circle cx="12" cy="12" r="2.5"></circle><path d="M7 9.5v5M17 9.5v5"></path></svg><span class="n nvmov-n"></span></span><span class="lb">Movimientos</span>';
      b.onclick = function(e){ e.stopPropagation(); abrir(); };
      var ref = nav.querySelector("#tab-ven"); if (ref && ref.nextSibling) nav.insertBefore(b, ref.nextSibling); else nav.appendChild(b);
    }
    var n = ROWS.filter(function(r){ return r.estado === "pendiente" || r.estado === "procesando"; }).length + ventasWeb().length;
    var c = b.querySelector(".nvmov-n"), t = n ? String(n) : "";
    if (c.textContent !== t) c.textContent = t;
    var on = document.body.classList.contains("nvmov-on");
    if (on) nav.querySelectorAll(".tab").forEach(function(x){ var s = x === b ? "true" : "false"; if (x.getAttribute("aria-selected") !== s) x.setAttribute("aria-selected", s); });
  }
  document.addEventListener("click", function(e){
    var t = e.target.closest && e.target.closest("nav.tabs .tab, .bnav button, .mnav button");
    if (t && !t.classList.contains("nvmov-tab") && document.body.classList.contains("nvmov-on")) cerrarPanel();
  }, true);
  function panel(){
    var w = document.querySelector(".wrap"); if (!w) return null;
    var p = w.querySelector(".nvmovp"); if (!p){ p = h("section", "nvmovp"); w.appendChild(p); }
    return p;
  }
  function abrir(){ document.body.classList.add("nvmov-on"); RECIEN = {}; pintar(); window.scrollTo(0, 0); }
  function cerrarPanel(){ document.body.classList.remove("nvmov-on"); var b = document.querySelector(".nvmov-tab"); if (b) b.setAttribute("aria-selected", "false"); }

  var tSuave = null;
  /* al repintar, no perder dónde estabas: scroll de la página, scroll de cada tabla y el casillero en el que estabas parada */
  var _pintarBase = pintar;
  pintar = function(){
    var p = document.querySelector(".nvmovp"), sy = window.scrollY, sl = [], fi = -1, fs = null, ab = [];
    if (p){
      sl = Array.prototype.map.call(p.querySelectorAll(".nvmov-tb"), function(e){ return e.scrollLeft; });
      var cs = p.querySelectorAll("input,select,textarea"), a = document.activeElement;
      fi = Array.prototype.indexOf.call(cs, a); if (fi >= 0 && a.selectionStart != null) { try { fs = [a.selectionStart, a.selectionEnd]; } catch(e){} }
      ab = Array.prototype.map.call(p.querySelectorAll(".nvmov-det"), function(d){ return !d.hidden; });
    }
    try { aplicarAprendido(); } catch(e){}
    _pintarBase.apply(this, arguments);
    p = document.querySelector(".nvmovp"); if (!p) return;
    Array.prototype.forEach.call(p.querySelectorAll(".nvmov-tb"), function(e, i){ if (sl[i]) e.scrollLeft = sl[i]; });
    Array.prototype.forEach.call(p.querySelectorAll(".nvmov-det"), function(d, i){ if (ab[i]){ d.hidden = false; var b = d.parentNode && d.parentNode.querySelector(".nvmov-mas"); if (b){ b.classList.add("on"); b.textContent = "Cerrar"; } } });
    if (fi >= 0){ var n = p.querySelectorAll("input,select,textarea")[fi]; if (n){ try { n.focus({ preventScroll: true }); if (fs && n.setSelectionRange) n.setSelectionRange(fs[0], fs[1]); } catch(e){} } }
    if (Math.abs(window.scrollY - sy) > 2) window.scrollTo(0, sy);
  };
  function pintarSuave(){ clearTimeout(tSuave); tSuave = setTimeout(function(){
    var a = document.activeElement; if (a && a.closest && a.closest(".nvmovp") && /INPUT|SELECT|TEXTAREA/.test(a.tagName)){ tabBtn(); decorarChat(); return; }
    pintar();
  }, 250); }
  function pintar(){
    tabBtn(); decorarChat();
    if (!document.body.classList.contains("nvmov-on")) return;
    var p = panel(); if (!p) return; var y = window.scrollY;
    p.replaceChildren();
    var vivos = ROWS.filter(function(r){ return r.estado !== "descartado" && !esBorradorVenta(r); });
    var pend = vivos.filter(function(r){ return r.estado === "pendiente" || r.estado === "procesando"; });
    var apro = vivos.filter(function(r){ return r.estado === "aprobado"; });
    var cab = h("div", "nvmov-cab");
    var ult = 0; ROWS.forEach(function(r){ var t = Date.parse(r.cambiado || r.creado || r.msg_at || "") || 0; if (t > ult) ult = t; });
    ventasWeb().forEach(function(r){ var t = Number(r.cambiado || r.creado) || Date.parse(r.cambiado || "") || 0; if (t > ult) ult = t; });
    var ultTx = ult ? new Date(ult).toLocaleDateString("es-AR", { day: "numeric", month: "long" }) + " · " + new Date(ult).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) : "—";
    var tt = h("div"); tt.append(h("h1", null, "Canal Movimientos"), h("p", null, "Todo esto está pendiente de aprobar · Última actualización: " + ultTx));
    cab.append(tt); p.append(cab);
    var vw = ventasTodas(), plataPend = pend.length;
    function bloque(k, titulo, sub, n){
      var s = h("section", "nvmov-blq" + (COLAP[k] ? " cerr" : "")); var hd = h("button", "nvmov-blqh"); hd.type = "button";
      hd.append(h("i", "nvmov-chev", "›"), h("b", null, titulo), h("em", n ? "pen" : "", n ? n + " para revisar" : "al día"), h("small", null, sub));
      hd.onclick = function(){ COLAP[k] = !COLAP[k]; try { localStorage.setItem("nvmov-colap", JSON.stringify(COLAP)); } catch(e){} pintar(); };
      var bd = h("div", "nvmov-blqb"); s.append(hd, bd); p.append(s); return bd;
    }
    var bv = bloque("ventas", "🛍 Ventas", "Tienda Nube, WhatsApp e Instagram · al aprobar pasan a Ventas minoristas", vw.length);
    if (!COLAP.ventas) pintarVentas(bv, vw);
    var bp = bloque("plata", "💵 Movimientos de plata", "Lo que entra y sale de las cuentas · al aprobar pasa a Finanzas de quien corresponda", plataPend);
    if (COLAP.plata){ window.scrollTo(0, y); return; }
    p = bp;
    var st = h("div", "nvmov-st");
    [["Total en #movimientos", vivos.length, ""], ["Pendientes", pend.length, "pen"], ["Aprobados", apro.length, "ok"]].forEach(function(x){
      var c = h("div", "nvmov-k " + x[2]); c.append(h("b", null, String(x[1])), h("small", null, x[0])); st.append(c);
    });
    p.append(st);
    var seg = h("div", "nvmov-seg");
    [["pend","Pendientes"],["apro","Aprobados"],["todo","Todos"],["desc","Descartados"]].forEach(function(o){
      var b = h("button", FILTRO === o[0] ? "on" : "", o[1]); b.type = "button"; b.onclick = function(){ FILTRO = o[0]; RECIEN = {}; pintar(); }; seg.append(b);
    });
    p.append(seg);
    if (!LISTO){ p.append(h("div", "nvmov-vacio", "Cargando…")); return; }
    var lista = ROWS.filter(function(r){
      if (esBorradorVenta(r)) return false;
      if (FILTRO === "pend") return r.estado === "pendiente" || r.estado === "procesando" || RECIEN[r.id];
      if (FILTRO === "apro") return r.estado === "aprobado";
      if (FILTRO === "desc") return r.estado === "descartado";
      return r.estado !== "descartado";
    });
    if (!lista.length){
      var v = h("div", "nvmov-vacio");
      v.append(h("b", null, FILTRO === "pend" ? "No hay nada pendiente 🎉" : "No hay movimientos acá."),
        h("small", null, "Mandá en #movimientos el comprobante + una línea, por ejemplo: “Pago Licari por Euge”, “Venta Juana Pérez por Pau”, “Sueldo Damián $30.000 por Euge”."));
      p.append(v); window.scrollTo(0, y); return;
    }
    var dias = {};
    lista.forEach(function(r){ var k = diaDe(r.msg_at || r.creado); (dias[k] = dias[k] || []).push(r); });
    Object.keys(dias).sort().forEach(function(k){
      var rs = dias[k].slice().sort(function(a, b){ return String(a.msg_at || a.creado || "").localeCompare(String(b.msg_at || b.creado || "")); }), np = rs.filter(function(r){ return r.estado !== "aprobado"; }).length;
      var ing = 0, egr = 0; rs.forEach(function(r){ var s = signoDe(r); if (s === "+") ing += Number(r.monto) || 0; else if (s === "-") egr += Number(r.monto) || 0; });
      var g = h("div", "nvmov-dia");
      var gh = h("div", "nvmov-diah");
      gh.append(h("b", null, diaLargo(k)), h("span", "nvmov-cnt", np ? np + (np === 1 ? " pendiente" : " pendientes") : "todo aprobado"),
        h("span", "nvmov-tot", (ing ? "+" + plata(ing) : "") + (ing && egr ? "  ·  " : "") + (egr ? "−" + plata(egr) : "")));
      g.append(gh);
      var tb = h("div", "nvmov-tb"); tb.append(cabecera());
      rs.forEach(function(r){ var fr = fila(r); try { fr.dataset.msg = r.msg_id || ""; } catch(e){} tb.append(fr); });
      g.append(tb);
      p.append(g);
    });
    window.scrollTo(0, y);
  }
  function cargarFinanzas(r){
    var hoja = r.por === "pau" ? "fin_pau" : "fin_euge";
    var id = "mov" + r.id + "x" + Date.now().toString(36);
    var fecha = r.fecha || diaDe(r.msg_at || r.creado);
    var monto = Math.abs(Number(r.monto) || 0), total = signoDe(r) === "-" ? -monto : monto;
    var esV = /^venta:/.test(r.msg_id || "");
    var fila = { id: id, concepto: esV ? String(r.contraparte || "") : String(r.contraparte || r.concepto || tipoDe(r.tipo)[1]).toUpperCase(), fecha: fecha, cat: r.cat,
      total: total, cuenta: (r.cliente && r.cliente.finCuenta) || GRUPOS_FIN[String(r.cat).split(".")[0]] || "", notas: (r.concepto ? r.concepto + " · " : "") + (esV ? "Creado desde Movimientos (venta aprobada)" : "desde #movimientos") };
    return new Promise(function(ok, mal){
      google.script.run.withSuccessHandler(function(){ ok(id); }).withFailureHandler(mal).baseGuardarVarios(hoja, [fila]);
    });
  }
  /* una fila = los mismos casilleros que Finanzas: Concepto · Fecha · Categoría · Total · Cuenta · Notas (+ a quién se carga) */
  var COLS = ["", "Concepto", "Fecha", "Categoría", "Total", "Cuenta", "Notas", "Se carga a", "", ""];
  function cabecera(){ var t = h("div", "nvmov-tr nvmov-th"); COLS.forEach(function(x){ t.append(h("span", null, x)); }); return t; }
  function numAR(v){ var s = String(v || "").trim(); if (!s) return null; var neg = /^-|^−/.test(s) || /-\s*\$/.test(s); s = s.replace(/[^\d,]/g, "").replace(",", "."); var n = Number(s); if (!n) return null; return neg ? -n : n; }
  function fila(r){
    var w = h("div", "nvmov-it " + (r.estado === "aprobado" ? "ok" : r.estado === "procesando" ? "lee" : r.estado === "descartado" ? "des" : ""));
    var f = h("div", "nvmov-tr");
    var ck = h("input"); ck.type = "checkbox"; ck.className = "nvmov-ck"; ck.checked = r.estado === "aprobado"; ck.title = "Aprobar y cargar en Finanzas";
    ck.disabled = r.estado === "procesando" || r.estado === "descartado";
    ck.onchange = function(){
      if (ck.checked){
        if (!r.por){ ck.checked = false; toast("Elegí a quién se carga (Euge o Pau) antes de aprobar."); return; }
        if (!Number(r.monto)){ ck.checked = false; toast("Falta el total."); return; }
        if (!r.cat){ ck.checked = false; toast("Elegí la categoría antes de aprobar."); return; }
        if (signoDe(r) !== "+" && signoDe(r) !== "-"){ ck.checked = false; toast("Poné el total con signo: negativo si sale plata."); return; }
        RECIEN[r.id] = 1; ck.disabled = true;
        cargarFinanzas(r).then(function(idFin){
          return guardar(r, { estado: "aprobado", aprobado_por: SOY, aprobado_at: new Date().toISOString(), cargado: "fin_" + r.por + ":" + idFin });
        }).then(function(){ toast("Cargado en Finanzas " + NOM[r.por] + "."); }, function(e){
          ck.checked = false; ck.disabled = false; toast("No se pudo cargar en Finanzas: " + String(e && e.message || e));
        });
      } else {
        if (r.cargado){ ck.checked = true; toast("Ya está cargado en Finanzas " + (NOM[r.por] || "") + ". Si hay que corregirlo, hacelo ahí."); return; }
        guardar(r, { estado: "pendiente", aprobado_por: null, aprobado_at: null });
      }
    };
    var ckw = h("label", "nvmov-ckw"); ckw.append(ck, h("i"));
    /* Concepto (como en Finanzas: el nombre en mayúscula) */
    var co = h("input", "nvmov-in up"); co.value = String(r.contraparte || "").toUpperCase(); co.placeholder = "CONCEPTO";
    co.onchange = function(){ guardar(r, { contraparte: co.value.trim().toUpperCase() || null }); };
    var fe = h("input", "nvmov-in"); fe.type = "date"; fe.value = r.fecha || diaDe(r.msg_at || r.creado); fe.onchange = function(){ guardar(r, { fecha: fe.value || null }); };
    var ca = h("select", "nvmov-in cat" + (r.cat ? "" : " falta")); var o0 = h("option", null, "❓ Categoría"); o0.value = ""; ca.append(o0);
    CATS.forEach(function(c){ var o = h("option", null, c); o.value = c; ca.append(o); }); ca.value = r.cat || "";
    ca.dataset.g = r.cat ? String(r.cat).split(".")[0] : "";
    ca.onchange = function(){ guardar(r, { cat: ca.value || null, cliente: Object.assign({}, r.cliente || {}, { catManual: true }) }); };
    var s = signoDe(r), mon = Number(r.monto) || 0;
    var to = h("input", "nvmov-in tot " + (s === "+" ? "in" : s === "-" ? "eg" : "")); to.inputMode = "decimal";
    to.value = mon ? "$ " + (s === "-" ? "-" : "") + Math.round(mon).toLocaleString("es-AR") : ""; to.placeholder = "$ -0";
    to.title = "Negativo si sale plata, positivo si entra";
    to.onchange = function(){ var n = numAR(to.value); if (n == null){ guardar(r, { monto: null }); return; } guardar(r, { monto: Math.abs(n), signo: n < 0 ? "egreso" : "ingreso" }); };
    var cuSel = (r.cliente && r.cliente.finCuenta) || (r.cat ? (GRUPOS_FIN[String(r.cat).split(".")[0]] || "") : "");
    var cu = h("select", "nvmov-in nvmov-cuenta" + (cuSel ? "" : " falta")); var cu0 = h("option", null, "Cuenta"); cu0.value = ""; cu.append(cu0);
    Object.keys(GRUPOS_FIN).forEach(function(k){ var o = h("option", null, GRUPOS_FIN[k]); o.value = GRUPOS_FIN[k]; cu.append(o); }); cu.value = cuSel; cu.title = "Cuenta de Finanzas";
    cu.onchange = function(){ guardar(r, { cliente: Object.assign({}, r.cliente || {}, { finCuenta: cu.value || null }) }); };
    var no = h("input", "nvmov-in"); no.value = r.concepto || ""; no.placeholder = "Notas"; no.onchange = function(){ guardar(r, { concepto: no.value.trim() || null }); };
    var qu = h("select", "nvmov-in quien" + (r.por ? "" : " falta")); [["","❓"],["euge","Euge"],["pau","Pau"]].forEach(function(o){ var e = h("option", null, o[1]); e.value = o[0]; qu.append(e); }); qu.value = r.por || "";
    qu.onchange = function(){ guardar(r, { por: qu.value || null }); };
    var ad = h("span", "nvmov-adjs");
    (r.adj || []).forEach(function(a){
      if (!a || !a.id) return; var l = h("a", "nvmov-adj", /pdf/i.test(a.t || a.n || "") ? "PDF" : "📎"); l.title = a.n || "Ver comprobante";
      l.href = "https://drive.google.com/file/d/" + a.id + "/view"; l.target = "_blank"; l.rel = "noopener"; ad.append(l);
    });
    var x = h("button", "nvmov-x", r.estado === "descartado" ? "↺" : "✕"); x.type = "button"; x.title = r.estado === "descartado" ? "Recuperar" : "Descartar";
    x.onclick = function(){ guardar(r, { estado: r.estado === "descartado" ? "pendiente" : "descartado" }); };
    if (r.cargado) [co, fe, ca, cu, to, no, qu].forEach(function(e){ e.disabled = true; });
    [ckw, co, fe, ca, to, cu, no, qu, ad, x].forEach(function(e){ var cc = h("div", "nvmov-c"); cc.append(e); f.append(cc); });
    w.append(f);
    /* debajo, chiquito: el mensaje original y avisos */
    var sub = h("div", "nvmov-sub");
    var hora = new Date(r.msg_at || r.creado).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    sub.append(h("span", "nvmov-who", (NOM[r.autor] || r.autor || "") + " · " + hora), h("span", "nvmov-tx", "“" + (r.texto || "sin texto") + "”"));
    if (r.por && r.cuenta && r.por !== r.cuenta) sub.append(h("span", "nvmov-al", "⚠️ El comprobante es de la cuenta de " + NOM[r.cuenta]));
    (r.falta || []).forEach(function(t){ sub.append(h("span", "nvmov-al", "Falta: " + t)); });
    if (r.estado === "procesando") sub.append(h("span", "nvmov-al", "⏳ Leyendo…"));
    if (r.estado === "aprobado") sub.append(h("span", "nvmov-apro", "✓ En Finanzas " + (NOM[r.por] || "") + (r.aprobado_por ? " · aprobó " + (NOM[r.aprobado_por] || r.aprobado_por) : "")));
    if (r.estado === "pendiente"){
      var bo = h("button", "nvmov-ok", "✓ Aprobar"); bo.type = "button";
      bo.title = r.por ? "Lo carga en Finanzas " + NOM[r.por] : "Primero elegí a quién se carga";
      bo.onclick = function(){ ck.checked = true; ck.dispatchEvent(new Event("change")); };
      qu.addEventListener("change", function(){ bo.title = qu.value ? "Lo carga en Finanzas " + NOM[qu.value] : "Primero elegí a quién se carga"; });
      f.firstChild.append(bo);
    }
    w.append(sub);
    return w;
  }

  /* ---------- VENTAS: lo que entra de Tienda Nube (Pendiente de revisar) + lo que se manda por chat ---------- */
  var METODOS = ["PAGO NUBE", "Transferencia / Depósito", "Efectivo", "MERCADO PAGO"];
  var VCOLS = ["", "#", "Productos", "Cantidades", "Fecha de compra", "Cliente", "Datos personales", "Observaciones de envío", "Sucursal", "Etiqueta", "Total cobrado", "Total a facturar", "Costo de envío", "Pago", "Método de pago", "Método de envío", "Tipo de envío", "Cobro por", "", ""];
  function arr(v){ if (Array.isArray(v)) return v; try { var x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : [String(x)]; } catch(e){ return v ? [String(v)] : []; } }
  function quienDeCobro(v){ var s = arr(v).join(" ").toUpperCase(); return /PAU/.test(s) ? "pau" : /EUGE/.test(s) ? "euge" : null; }
  function cobroDeQuien(q){ return q === "pau" ? ["PAU"] : q === "euge" ? ["EUGE "] : []; }
  function catVenta(metodo, fact){
    var m = arr(metodo).join(" ").toUpperCase(), f = !!String(fact || "").trim();
    if (/EFECTIVO/.test(m)) return "1.1 VENTA MIN. EFTVO";
    if (/TRANSF|DEP/.test(m)) return f ? "1.4 VENTA MIN. TRANSFERENCIA FACTURADA" : "1.5 VENTA MIN. TRANSFERENCIA NO FACTURADA";
    return f ? "1.2 VENTA MIN. TARJETA FACTURADA" : "1.3 VENTA MIN. TARJETA NO FACTURADA";
  }
  function baseMin(){ var S = window.__nv && window.__nv.S; return (S && S.bzData && S.bzData.min) || []; }
  function ventasWeb(){ return baseMin().filter(function(r){ if (!/REVISAR/i.test(r.env || "")) return false; return true; }); }
  function ventasTodas(){
    var w = ventasWeb().map(function(r){ return { src: "web", id: "w" + r.id, row: r }; });
    var ch = ROWS.filter(function(r){ return esBorradorVenta(r) && (r.estado === "pendiente" || r.estado === "procesando"); }).map(function(m){
      var v = (m.cliente && m.cliente.venta) || null;
      if (!v){ v = { num: "", fecha: m.fecha || diaDe(m.msg_at || m.creado), cliente: m.contraparte || "", datos: (m.cliente && m.cliente.datos) || "", prods: "[]", cant: "", obs: "",
        facturar: m.monto || "", cobrado: m.monto || "", metodo: JSON.stringify(m.medio ? [/transf/i.test(m.medio) ? "Transferencia / Depósito" : /efect/i.test(m.medio) ? "Efectivo" : /mercado/i.test(m.medio) ? "MERCADO PAGO" : m.medio] : []),
        cobro: JSON.stringify(cobroDeQuien(m.por)), menv: "", tipo: "", suc: "", fact: "" }; }
      return { src: "chat", id: "c" + m.id, row: v, mov: m };
    });
    return w.concat(ch).sort(function(a, b){ return String(a.row.fecha || "").localeCompare(String(b.row.fecha || "")) || String(a.row.num || "").localeCompare(String(b.row.num || ""), "es", { numeric: true }); });
  }
  var tVen = {};
  function guardarVenta(it, campos){
    Object.assign(it.row, campos);
    if (it.src === "web"){
      clearTimeout(tVen[it.id]); tVen[it.id] = setTimeout(function(){
        var x = Object.assign({ id: it.row.id, cambiado: Date.now(), por: SOY }, campos);
        try { google.script.run.withFailureHandler(function(e){ toast("No se pudo guardar la venta: " + (e && e.message || e)); }).baseGuardarVarios("base_min", [x]); } catch(e){}
      }, 400);
    } else {
      var cl = Object.assign({}, it.mov.cliente || {}, { venta: it.row }); it.mov.cliente = cl;
      SB.from("movimientos").update({ cliente: cl, cambiado: new Date().toISOString(), cambiado_por: SOY }).eq("id", it.mov.id).then(function(r){ if (r.error) toast("No se pudo guardar: " + r.error.message); });
    }
  }
  function proxNumWhats(){
    var mx = 0; baseMin().forEach(function(r){ var m = /WHATS\s*(\d+)/i.exec(r.num || ""); if (m) mx = Math.max(mx, +m[1]); }); return "WHATS " + (mx + 1);
  }
  function crearPlata(v, f){
    var q = quienDeCobro(v.cobro), monto = Number(String(v.cobrado || "").replace(",", ".")) || null; f = f || {};
    return SB.from("movimientos").insert({ msg_id: "venta:" + v.id, msg_at: new Date().toISOString(), autor: SOY, texto: "Venta " + (v.num || "") + " · " + (v.cliente || ""), adj: [],
      tipo: "venta", signo: "ingreso", monto: f.total || monto, fecha: f.fecha || v.fecha || null, por: q, cuenta: q, contraparte: f.concepto || ("Venta #" + (v.num || "") + " · " + (v.cliente || "")),
      concepto: f.notas || null, cat: f.cat || catVenta(v.metodo, v.fact), falta: [], estado: "pendiente" }).select().then(function(r){
      if (r.error && !/duplicate|23505/i.test(r.error.message + r.error.code)) throw r.error; if (r.data && r.data[0]){ upsertLocal(r.data[0]); return r.data[0]; } return null;
    }).then(function(row){
      /* al aprobar la venta, el cobro entra directo en Finanzas (un solo paso) */
      if (!row || !row.por || !Number(row.monto) || row.cargado) return row;
      return cargarFinanzas(row).then(function(idFin){ return guardar(row, { estado: "aprobado", aprobado_por: SOY, aprobado_at: new Date().toISOString(), cargado: "fin_" + row.por + ":" + idFin }); }).then(function(){ return row; });
    });
  }
  function aprobarVenta(it){
    var v = it.row;
    if (!v.cliente){ toast("Falta el cliente."); return Promise.reject(); }
    if (!quienDeCobro(v.cobro)){ toast("Elegí quién cobró (Euge o Pau)."); return Promise.reject(); }
    if (!Number(v.cobrado)){ toast("Falta el total cobrado."); return Promise.reject(); }
    var dest = DEST[it.id] || "PARA HACER";
    var paso, conFin = FIN[it.id] !== false;
    if (it.src === "web"){
      paso = new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).baseGuardarVarios("base_min", [{ id: v.id, env: dest, cobrado: v.cobrado || "", cambiado: Date.now(), por: SOY }]); })
        .then(function(){ v.env = dest; return conFin ? crearPlata(v, finFinal(it)) : null; });
    } else {
      var id = "min" + Date.now(), num = v.num || proxNumWhats();
      var fila = { id: id, num: num, venta: num, env: dest, prods: v.prods || "[]", cant: v.cant || "", obs: v.obs || "", fecha: v.fecha || diaDe(Date.now()), cliente: v.cliente, datos: v.datos || "",
        etq: "[]", suc: v.suc || "", cobrado: v.cobrado || "", facturar: v.facturar || v.cobrado || "", costoEnv: "0", pago: "Finalizado", metodo: v.metodo || "[]", menv: v.menv || "", tipo: v.tipo || "",
        cobro: v.cobro || "[]", fact: v.fact || "", web: "", creado: Date.now(), cambiado: Date.now(), por: SOY };
      paso = new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).baseGuardarVarios("base_min", [fila]); })
        .then(function(){ baseMin().push(fila); return guardar(it.mov, { estado: "aprobado", aprobado_por: SOY, aprobado_at: new Date().toISOString(), cargado: "base_min:" + id }); })
        .then(function(){ return conFin ? crearPlata(Object.assign({}, fila), finFinal(it)) : null; });
    }
    return paso.then(function(){ toast(conFin ? "Venta aprobada: pasó a Ventas minoristas · " + dest + " y se cargó en Finanzas " + (NOM[quienDeCobro(v.cobro)] || "") + "." : "Venta aprobada: pasó a Ventas minoristas · " + dest + " (sin Finanzas)."); pintar(); });
  }
  function pintarVentas(p, lista){
    if (!lista.length){ var v = h("div", "nvmov-vacio"); v.append(h("b", null, "No hay ventas para revisar 🎉"), h("small", null, "Las de Tienda Nube aparecen solas. Las de WhatsApp o Instagram mandalas a #movimientos, por ejemplo: “Venta Juana Pérez $85.000 transferencia por Pau”.")); p.append(v); return; }
    var tb = h("div", "nvmov-dia nvmov-vt"); var t = h("div", "nvmov-tb");
    var th = h("div", "nvmov-tr nvmov-vr nvmov-th"); VCOLS.forEach(function(x){ th.append(h("span", null, x)); }); t.append(th);
    lista.forEach(function(it){ var fr = filaVenta(it); try { fr.dataset.msg = it.src === "web" ? "web-" + it.row.id : ((it.mov && it.mov.msg_id) || ""); } catch(e){} t.append(fr); });
    tb.append(t); p.append(tb);
  }
  function inp(val, ph, cls, on){ var e = h("input", "nvmov-in " + (cls || "")); e.value = val == null ? "" : val; e.placeholder = ph || ""; e.onchange = function(){ on(e.value.trim()); }; return e; }
  var FIN = {}, DEST = {};
  /* ===== Ventas: mismas columnas que el tablero de Ventas minoristas ===== */
  var PAGOS = ["Finalizado", "Pendiente", "PARCIAL", "FALTA ENVIO"];
  var MENVS = ["Vía Cargo", "Andreani", "Retira en Nervo", "Acordar envío", "Retira depósito cliente", "Retira depósito transporte", "BUSPACK", "Sendbox"];
  var ETQS = ["VIA CARGO", "CREADA", "ENVIO NUBE ANDREANI A DOMICILIO", "ENVIO NUBE A SUCURSAL ANDREANI", "COORDINAR POR OTRO TRANSPORTE (SENDBOX, BUSPACk)", "S/ ETIQUETA - POR DEPOSITO", "RETIRA EN NERVO", "PAQUETE ENVIADO"];
  var TIPOSENV = ["Domicilio", "Sucursal"];
  function sel(val, ops, ph, on){
    var e = h("select", "nvmov-in cat"); var o0 = h("option", null, ph || "—"); o0.value = ""; e.append(o0);
    ops.concat(val && ops.indexOf(val) < 0 ? [val] : []).forEach(function(m){ var o = h("option", null, m); o.value = m; e.append(o); });
    e.value = val || ""; e.dataset.g = val ? "1" : ""; e.onchange = function(){ e.dataset.g = e.value ? "1" : ""; on(e.value); }; return e;
  }
  function plataN(n){ return n && Number(n) ? Math.round(Number(n)).toLocaleString("es-AR") : ""; }
  function caja(val, ph, on){ var t = h("textarea", "nvmov-in nvmov-ta"); t.value = val || ""; t.placeholder = ph || ""; t.rows = 2; t.title = val || ""; t.onchange = function(){ t.title = t.value; on(t.value); }; return t; }
  /* productos y cantidades: dos columnas alineadas, una línea por producto (como en la tabla de ventas) */
  function partirCant(l){ var m = /^\s*\[(.?)\]\s*/.exec(l || ""); return m ? { ck: m[1], tx: String(l).slice(m[0].length) } : { ck: " ", tx: String(l || "") }; }
  /* buscador de productos: mismos nombres que el catálogo / stock / ventas anteriores (así se cuentan bien) */
  function listaCatalogo(){
    var id = "nvmov-catl", dl = document.getElementById(id); if (dl) return id;
    dl = document.createElement("datalist"); dl.id = id; var S = (window.__nv && window.__nv.S) || {}, vis = {};
    function add(n){ n = String(n || "").trim(); if (!n || vis[n.toLowerCase()]) return; vis[n.toLowerCase()] = 1; var o = document.createElement("option"); o.value = n; dl.appendChild(o); }
    baseMin().forEach(function(r){ arr(r.prods).forEach(add); });
    (S.stock || []).forEach(function(x){ add(x.producto); }); (S.catalogo || []).forEach(function(x){ add(x.nombre); });
    document.body.appendChild(dl); return id;
  }
  function prodsYCants(it, alCambiar){
    var v = it.row, cp = h("div", "nvmov-prods"), cc = h("div", "nvmov-prods");
    var ps = arr(v.prods).slice(), cs = String(v.cant || "").split("\n");
    while (cs.length < ps.length) cs.push("[ ] 1");
    function guardar2(){ guardarVenta(it, { prods: JSON.stringify(ps), cant: cs.slice(0, ps.length).join("\n") }); if (alCambiar) alCambiar(); }
    function pintarL(){
      cp.innerHTML = ""; cc.innerHTML = "";
      ps.forEach(function(p, i){
        var r = h("div", "nvmov-pl");
        var pi = h("span", "nvmov-chip", p || ""); pi.title = p || "";
        var del = h("button", "nvmov-pdel", "✕"); del.type = "button"; del.title = "Sacar este producto";
        del.onclick = function(){ ps.splice(i, 1); cs.splice(i, 1); guardar2(); pintarL(); };
        r.append(pi, del); cp.append(r);
        var pc = partirCant(cs[i]);
        var ci = h("input", "nvmov-in nvmov-pn"); ci.value = pc.tx; ci.placeholder = "1"; ci.title = "Cantidad / detalle";
        ci.onchange = function(){ cs[i] = "[" + (pc.ck || " ") + "] " + ci.value.trim(); guardar2(); };
        var rc = h("div", "nvmov-pl nvmov-plc"); rc.append(ci); cc.append(rc);
      });
      var bus = h("input", "nvmov-in nvmov-bus"); bus.placeholder = "🔍 Buscar producto…"; bus.setAttribute("list", listaCatalogo());
      bus.onchange = function(){ var t = bus.value.trim(); if (!t) return; ps.push(t); cs.splice(ps.length - 1, 0, "[ ] 1"); guardar2(); pintarL(); var u = cp.querySelector(".nvmov-bus"); if (u) u.focus(); };
      cp.append(bus);
    }
    pintarL(); return [cp, cc];
  }
  /* cómo queda en Finanzas */
  /* lo que va a Finanzas se puede corregir a mano en la venta (se guarda hasta que se aprueba) */
  /* correcciones de Finanzas: se guardan en la base, así las ven todas en todos los dispositivos */
  var OV = null, OVH = "";
  function ovDe(id){ var o = OV && OV[String(id)]; if (o) return JSON.parse(JSON.stringify(o)); try { return JSON.parse(localStorage.getItem("nvfinov_" + id) || "{}") || {}; } catch(e){ return {}; } }
  function ovSet(id, o){ OV = OV || {}; OV[String(id)] = o; try { localStorage.removeItem("nvfinov_" + id); } catch(e){} SB.from("fin_ajustes").upsert({ id: String(id), datos: o, cambiado: new Date().toISOString(), cambiado_por: (typeof SOY !== "undefined" ? SOY : null) }).then(function(){}, function(){}); }
  function ovTraer(){ SB.from("fin_ajustes").select("id,datos").then(function(r){ if (!r || r.error) return; var nu = {}; (r.data || []).forEach(function(x){ nu[x.id] = x.datos || {}; }); var hh = JSON.stringify(nu); if (hh === OVH) return; OVH = hh; OV = nu; var a = document.activeElement; if (document.body.classList.contains("nvmov-on") && !(a && a.closest && a.closest(".nvmovp"))) { try { pintar(); } catch(e){} } }, function(){}); }
  setTimeout(ovTraer, 1500); setInterval(function(){ if (!document.hidden) ovTraer(); }, 15000);
  function finAuto(it){
    var v = it.row, cat = catVenta(v.metodo, v.fact), mon = Number(v.cobrado) || 0;
    return { concepto: ("Venta #" + (v.num || "") + " · " + (v.cliente || "")).toUpperCase(), fecha: v.fecha || "", cat: cat, total: mon, notas: "" };
  }
  function finFinal(it){ var a = finAuto(it), o = ovDe(it.id); return { concepto: o.concepto || a.concepto, fecha: o.fecha || a.fecha, cat: o.cat || a.cat, total: o.total != null && o.total !== "" ? Number(o.total) : a.total, notas: o.notas != null ? o.notas : a.notas }; }
  function datosFin(it){
    var v = it.row, q = quienDeCobro(v.cobro), f = finFinal(it);
    return { q: q, quien: q === "pau" ? "Pau" : q === "euge" ? "Euge" : "", f: f, cols: [["Concepto", f.concepto], ["Fecha", f.fecha ? f.fecha.split("-").reverse().join("/") : "—"], ["Categoría", f.cat], ["Total", f.total ? "$ " + Math.round(f.total).toLocaleString("es-AR") : "—"], ["Cuenta", GRUPOS_FIN[String(f.cat).split(".")[0]] || ""], ["Notas", f.notas || "Creado desde Movimientos (venta aprobada)"]] };
  }
  /* ver la venta completa en un recuadro, todo entero y fácil de leer */
  function verCompleta(it){
    var v = it.row, d = datosFin(it);
    var cap = h("div", "nvvc-cap"), p = h("div", "nvvc"); cap.append(p);
    var x = h("button", "nvvc-x", "✕"); x.type = "button";
    function cerrar(){ cap.remove(); document.removeEventListener("keydown", esc); }
    function esc(e){ if (e.key === "Escape") cerrar(); }
    x.onclick = cerrar; cap.onclick = function(e){ if (e.target === cap) cerrar(); }; document.addEventListener("keydown", esc);
    var tit = h("div", "nvvc-t"); tit.append(h("b", null, (v.num || "Venta") + " · " + (v.cliente || "—")), h("small", null, (it.src === "web" ? "Tienda Nube" : "WhatsApp / IG") + (v.fecha ? " · " + v.fecha.split("-").reverse().join("/") : "")));
    p.append(x, tit);
    function sec(nom, filas){ var s = h("div", "nvvc-s"); s.append(h("h4", null, nom)); var g = h("div", "nvvc-g"); filas.forEach(function(f){ if (!f) return; var e = h("div", f[2] ? "full" : ""); e.append(h("small", null, f[0])); var sp = h("span", null, f[1] == null || f[1] === "" ? "—" : String(f[1])); if (!f[1]) sp.className = "vac"; e.append(sp); g.append(e); }); s.append(g); p.append(s); }
    var ps = arr(v.prods), cs = String(v.cant || "").replace(/\[.?\]\s*/g, "").split(/\n/);
    var lp = h("div", "nvvc-s"); lp.append(h("h4", null, "Productos"));
    if (!ps.length) lp.append(h("p", "vac", "Sin productos cargados"));
    ps.forEach(function(pr, i){ var r = h("div", "nvvc-p"); r.append(h("span", "q", (String(cs[i] || "1").trim() || "1") + " ×"), h("span", null, pr)); lp.append(r); });
    p.append(lp);
    var pesos = function(n){ return Number(n) ? "$ " + plataN(n) : ""; };
    sec("Cliente", [["Nombre", v.cliente], ["Datos personales", v.datos, 1]]);
    sec("Plata", [["Total cobrado", pesos(v.cobrado)], ["Total a facturar", pesos(v.facturar)], ["Costo de envío", pesos(v.costoEnv)], ["Pago", v.pago], ["Método de pago", arr(v.metodo).join(", ")], ["Cobró", d.quien]]);
    sec("Envío", [["Método de envío", v.menv], ["Tipo de envío", v.tipo], ["Etiqueta", arr(v.etq).join(", ")], ["Estado", v.env], ["Sucursal / retiro", v.suc, 1], ["Observaciones", v.obs, 1]]);
    if (v.fact) sec("Factura", [["Datos de factura", v.fact, 1]]);
    sec("Así entra en Finanzas " + (d.quien || ""), d.cols.map(function(c){ return [c[0], c[1]]; }));
    if (!document.getElementById("nvvc-css")){ var st = h("style"); st.id = "nvvc-css"; st.textContent = ".nvvc-cap{position:fixed;inset:0;background:rgba(43,32,28,.35);z-index:9999;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:40px 16px}.nvvc{position:relative;background:#fff;border-radius:8px;max-width:640px;width:100%;padding:22px 24px 18px;box-shadow:0 10px 40px rgba(0,0,0,.18);font-size:14px;color:#2B201C}.nvvc-x{position:absolute;right:12px;top:10px;border:0;background:none;font-size:18px;cursor:pointer;color:#8D827C}.nvvc-t b{display:block;font-size:18px;font-weight:600}.nvvc-t small{color:#8D827C}.nvvc-s{border-top:1px solid #ECE5E0;margin-top:14px;padding-top:12px}.nvvc-s h4{margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6B5047;font-weight:600}.nvvc-g{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}.nvvc-g>div.full{grid-column:1/-1}.nvvc-g small{display:block;font-size:11px;color:#8D827C;margin-bottom:2px}.nvvc-g span{white-space:pre-wrap;word-break:break-word}.nvvc .vac{color:#B9AFA9}.nvvc-p{display:flex;gap:8px;padding:5px 0;border-bottom:1px dashed #F0EAE6}.nvvc-p .q{min-width:34px;color:#6B5047;font-weight:600}@media(max-width:560px){.nvvc-g{grid-template-columns:1fr}}"; document.head.append(st); }
    document.body.append(cap);
  }
  function filaVenta(it){
    var row = (it.src !== "web" && tipoVentaDe(it) === "may") ? filaMayorista(it) : filaVenta0(it);
    if (it.src === "web") return row;
    var sw = h("div", "nvmay-sw"), act = tipoVentaDe(it);
    [["min", "🛍️ Minorista"], ["may", "📦 Mayorista"]].forEach(function(o){
      var b = h("button", o[0] === act ? "on" : "", o[1]); b.type = "button";
      b.onclick = function(){ if (o[0] === act) return; guardarCliVenta(it, { tipoV: o[0] }); pintar(); };
      sw.append(b);
    });
    row.prepend(sw);
    return row;
  }
  function tipoVentaDe(it){ var c = (it.mov && it.mov.cliente) || {}; if (c.tipoV) return c.tipoV; return it.mov && it.mov.tipo === "mayorista" ? "may" : "min"; }
  function guardarCliVenta(it, campos){
    if (!it.mov) return;
    var cl = Object.assign({}, it.mov.cliente || {}, campos); it.mov.cliente = cl;
    SB.from("movimientos").update({ cliente: cl, cambiado: new Date().toISOString(), cambiado_por: SOY }).eq("id", it.mov.id).then(function(r){ if (r.error) toast("No se pudo guardar: " + r.error.message); });
  }
  (function(){
    if (document.getElementById("nvmay-css")) return;
    var s = document.createElement("style"); s.id = "nvmay-css";
    s.textContent = ".nvmay-sw{display:inline-flex;gap:4px;margin:8px 0 6px 10px;padding:3px;border-radius:999px;background:#ECE6DF;box-shadow:inset 2px 2px 5px rgba(120,100,85,.16),inset -2px -2px 5px rgba(255,255,255,.8)}" +
      ".nvmay-sw button{border:0;background:transparent;font:inherit;font-size:12.5px;padding:5px 12px;border-radius:999px;color:#8C7D71;cursor:pointer}.nvmay-sw button.on{background:#fff;color:#4A3F37;font-weight:600;box-shadow:0 1px 3px rgba(74,63,55,.12)}" +
      ".nvmay-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px 10px;padding:6px 10px 12px}.nvmay-g label{display:flex;flex-direction:column;gap:3px;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#9C7B62}" +
      ".nvmay-g label.ancho{grid-column:span 2}.nvmay-g textarea{min-height:58px;resize:vertical;font:inherit;text-transform:none}.nvmay-g .nvmov-in{width:100%;box-sizing:border-box;text-transform:none;letter-spacing:0}" +
      ".nvmay-pie{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 10px 12px;font-size:13px;color:#8C7D71}.nvmay-ok{border:0;border-radius:999px;padding:8px 16px;font:inherit;font-size:13px;background:#9C7B62;color:#fff;cursor:pointer}.nvmay-ok[disabled]{background:#D8CEC4;cursor:default}" +
      "@media(max-width:700px){.nvmay-g{grid-template-columns:repeat(2,minmax(0,1fr))}}";
    document.head.appendChild(s);
  })();
  function filaMayorista(it){
    var v = it.row || {}, c = (it.mov && it.mov.cliente) || {};
    var hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    var m = Object.assign({ cliente: v.cliente || "", pedido: v.cant || "", total: Number(v.cobrado) || Number(v.facturar) || (it.mov && Number(it.mov.monto)) || "", sena: "", cobra: quienDeCobro(v.cobro) || "", fecha: v.fecha || hoy, limite: "", facturas: "no", canal: "WHATS" }, c.may || {});
    var w = h("div", "nvmov-it nvmay");
    function set(k, val){ m[k] = val; guardarCliVenta(it, { may: Object.assign({}, m) }); revisar(); }
    function campo(t, el, ancho){ var l = h("label", ancho ? "ancho" : ""); l.append(h("span", null, t), el); return l; }
    var cl = inp(m.cliente, "Nombre del mayorista", "", function(x){ set("cliente", x); });
    var pe = h("textarea", "nvmov-in"); pe.value = m.pedido; pe.placeholder = "*2 firenze xl kraft tostado\n*1 toscana 65x40…"; pe.onchange = function(){ set("pedido", pe.value.trim()); };
    var to = inp(plataN(m.total), "$ total del pedido", "tot", function(x){ set("total", numAR(x) || ""); });
    var se = inp(plataN(m.sena), "$ seña (si dejó)", "tot in", function(x){ set("sena", numAR(x) || ""); });
    var qu = sel(m.cobra === "pau" ? "Pau" : m.cobra === "euge" ? "Euge" : "", ["Euge", "Pau"], "¿Quién cobró la seña?", function(x){ set("cobra", x.toLowerCase()); });
    var fe = h("input", "nvmov-in"); fe.type = "date"; fe.value = m.fecha; fe.onchange = function(){ set("fecha", fe.value); };
    var li = h("input", "nvmov-in"); li.type = "date"; li.value = m.limite; li.onchange = function(){ set("limite", li.value); };
    var fa = sel(m.facturas === "si" ? "Sí" : "No", ["Sí", "No"], "¿Factura?", function(x){ set("facturas", x === "Sí" ? "si" : "no"); });
    var ca = inp(m.canal, "WHATS / INSTA / LOCAL", "up", function(x){ set("canal", x); });
    var g = h("div", "nvmay-g");
    g.append(campo("Mayorista", cl, true), campo("Fecha del pedido", fe), campo("Entregar antes del", li),
      campo("Pedido", pe, true), campo("Total", to), campo("Seña", se),
      campo("Cobró la seña", qu), campo("¿Lleva factura?", fa), campo("Canal", ca));
    var pie = h("div", "nvmay-pie"), msg = h("span"), ok = h("button", "nvmay-ok", "✓ Aprobar como mayorista"); ok.type = "button";
    pie.append(msg, ok); w.append(g, pie);
    function faltan(){
      var f = []; if (!m.cliente) f.push("mayorista"); if (!m.pedido) f.push("pedido"); if (!Number(m.total)) f.push("total"); if (!m.limite) f.push("fecha de entrega");
      if (Number(m.sena) > 0 && !m.cobra) f.push("quién cobró la seña"); return f;
    }
    function revisar(){ var f = faltan(); ok.disabled = !!f.length; msg.textContent = f.length ? "Falta: " + f.join(", ") : (Number(m.sena) > 0 ? "Pasa a Mayoristas y la seña queda abajo para aprobar en Finanzas " + (m.cobra === "pau" ? "Pau" : "Euge") : "Pasa a Mayoristas (sin seña)"); }
    revisar();
    ok.onclick = function(){
      if (faltan().length) return; ok.disabled = true; ok.textContent = "Guardando…";
      var total = Number(m.total) || 0, sena = Math.min(Number(m.sena) || 0, total), now = Date.now(), id = "may" + now;
      var fila = { id: id, fecha: m.fecha, cliente: m.cliente, pedido: m.pedido, sena: sena ? String(sena) : "", saldo: String(total - sena), limite: m.limite,
        estado: JSON.stringify(["PARA HACER"]), pago: JSON.stringify(sena >= total ? ["COMPLETO"] : sena > 0 ? ["SÓLO SEÑA"] : ["NO ABONADO"]),
        cobrado: JSON.stringify(sena > 0 ? [m.cobra === "pau" ? "PAU" : "EUGE"] : []), canal: m.canal || "", facturas: m.facturas, obs: "", orden: "", at: "", creado: String(now), cambiado: String(now), por: SOY };
      new Promise(function(res, mal){ google.script.run.withSuccessHandler(res).withFailureHandler(mal).baseGuardarVarios("base_may", [fila]); })
        .then(function(){ return guardar(it.mov, { estado: "aprobado", aprobado_por: SOY, aprobado_at: new Date().toISOString(), cargado: "base_may:" + id }); })
        .then(function(){ if (!(sena > 0)) return null;
          return crearPlata({ id: id, num: "MAY", cliente: m.cliente, cobro: JSON.stringify([m.cobra === "pau" ? "PAU" : "EUGE"]), cobrado: String(sena), fecha: m.fecha },
            { cat: m.facturas === "si" ? "1.7 VENTA MAY. FACTURADA" : "1.6 VENTA MAY. NO FACTURADA", total: sena, fecha: m.fecha, concepto: (sena >= total ? "Venta mayorista · " : "Seña mayorista · ") + m.cliente }); })
        .then(function(){ toast("Listo: pasó a Mayoristas" + (sena > 0 ? ". La seña quedó abajo para aprobar en Finanzas." : ".")); pintar(); },
              function(e){ ok.disabled = false; ok.textContent = "✓ Aprobar como mayorista"; toast("No se pudo aprobar: " + (e && e.message || e)); });
    };
    return w;
  }
  function filaVenta0(it){
    var v = it.row, w = h("div", "nvmov-it"), f = h("div", "nvmov-tr nvmov-vr");
    var ck = h("input"); ck.type = "checkbox"; ck.className = "nvmov-ck"; ck.title = "Aprobar venta";
    ck.onchange = function(){ if (!ck.checked) return; ck.disabled = true; aprobarVenta(it).catch(function(e){ ck.checked = false; ck.disabled = false; if (e) toast("No se pudo aprobar: " + (e.message || e)); }); };
    var ckw = h("label", "nvmov-ckw"); ckw.append(ck, h("i"));
    var refrescar = function(){};
    var nu = h("div", "nvmov-num"); var nui = inp(v.num, it.src === "web" ? "" : "WHATS / INSTA", "up", function(x){ guardarVenta(it, { num: x, venta: x }); refrescar(); });
    nu.append(nui, h("small", null, it.src === "web" ? "Tienda Nube" : "WhatsApp / IG"));
    var pc = prodsYCants(it, function(){ refrescar(); });
    var fe = h("input", "nvmov-in"); fe.type = "date"; fe.value = v.fecha || ""; fe.onchange = function(){ guardarVenta(it, { fecha: fe.value }); refrescar(); };
    var cl = inp(v.cliente, "Cliente", "fuerte", function(x){ guardarVenta(it, { cliente: x }); refrescar(); });
    var dp = caja(v.datos, "DNI, mail, celular, dirección", function(x){ guardarVenta(it, { datos: x }); });
    var ob = caja(v.obs, "Observaciones de envío", function(x){ guardarVenta(it, { obs: x }); });
    var su = caja(v.suc, "Sucursal", function(x){ guardarVenta(it, { suc: x }); });
    var et0 = String(arr(v.etq)[0] || "").trim(), et1 = ETQS.filter(function(o){ return o.toLowerCase() === et0.toLowerCase(); })[0] || et0;
    var et = sel(et1, ETQS, "Etiqueta", function(x){ guardarVenta(it, { etq: JSON.stringify(x ? [x] : []) }); refrescar(); });
    var co = inp(plataN(v.cobrado), "$ cobrado", "tot in", function(x){ guardarVenta(it, { cobrado: String(numAR(x) || "") }); refrescar(); });
    var to = inp(plataN(v.facturar), "$ a facturar", "tot", function(x){ guardarVenta(it, { facturar: String(numAR(x) || "") }); refrescar(); });
    var ce = inp(plataN(v.costoEnv), "$ envío", "tot", function(x){ guardarVenta(it, { costoEnv: String(numAR(x) || "0") }); });
    var pa = sel(v.pago, PAGOS, "Pago", function(x){ guardarVenta(it, { pago: x }); refrescar(); });
    var me = sel(arr(v.metodo)[0] || "", METODOS, "❓ Medio", function(x){ guardarVenta(it, { metodo: JSON.stringify(x ? [x] : []) }); refrescar(); });
    var mn = sel(v.menv, MENVS, "Método de envío", function(x){ guardarVenta(it, { menv: x }); refrescar(); });
    var ti = sel(v.tipo, TIPOSENV, "Domicilio / Sucursal", function(x){ guardarVenta(it, { tipo: x }); refrescar(); });
    var qu = h("select", "nvmov-in quien" + (quienDeCobro(v.cobro) ? "" : " falta")); [["","❓"],["euge","Euge"],["pau","Pau"]].forEach(function(o){ var e = h("option", null, o[1]); e.value = o[0]; qu.append(e); });
    qu.value = quienDeCobro(v.cobro) || ""; qu.onchange = function(){ guardarVenta(it, { cobro: JSON.stringify(cobroDeQuien(qu.value)) }); qu.classList.toggle("falta", !qu.value); refrescar(); };
    var ab = h("button", "nvmov-mas", "Abrir"); ab.type = "button";
    var x = h("button", "nvmov-x", "✕"); x.type = "button"; x.title = it.src === "web" ? "No se puede descartar una venta de la tienda (se revisa y aprueba)" : "Descartar";
    if (it.src === "web") x.disabled = true; else x.onclick = function(){ guardar(it.mov, { estado: "descartado" }); };
    [ckw, nu, pc[0], pc[1], fe, cl, dp, ob, su, et, co, to, ce, pa, me, mn, ti, qu, ab, x].forEach(function(e){ var cc = h("div", "nvmov-c"); cc.append(e); f.append(cc); }); w.append(f);
    /* debajo: a Finanzas sí/no + cómo queda + aprobar */
    var sub = h("div", "nvmov-sub");
    var fw = h("label", "nvmov-fin"); var fc = h("input"); fc.type = "checkbox"; fc.checked = FIN[it.id] !== false; var ft = h("span");
    fw.title = "Si está tildado, al aprobar la venta el cobro entra directo en Finanzas."; fw.append(fc, ft);
    var lf = h("div", "nvmov-lfin"); var fa = h("span", "nvmov-al nvmov-falt");
    var lfEm = h("em"), lfCon = h("input", "nvmov-in"), lfFe = h("input", "nvmov-in"), lfCat = h("select", "nvmov-in"), lfTot = h("input", "nvmov-in"), lfCta = h("b"), lfNot = h("input", "nvmov-in"), lfVol = h("button", "nvmov-lfvol", "↺"), lfArm = false;
    lfFe.type = "date"; lfTot.inputMode = "decimal"; lfNot.placeholder = "Notas"; lfVol.type = "button"; lfVol.title = "Volver a lo que sale de la venta";
    CATS.forEach(function(c){ var op = h("option", null, c); op.value = c; lfCat.append(op); });
    function lfCelda(lab, el, cls){ var e = h("span", cls || ""); e.append(h("small", null, lab), el); lf.append(e); }
    function lfGuardar(k, val){ var a = finAuto(it), o = ovDe(it.id); if (val === "" || val == null || String(val) === String(a[k])) delete o[k]; else o[k] = val; ovSet(it.id, o); refrescar(); }
    lfCon.onchange = function(){ lfGuardar("concepto", lfCon.value.trim().toUpperCase()); };
    lfFe.onchange = function(){ lfGuardar("fecha", lfFe.value); };
    lfCat.onchange = function(){ lfGuardar("cat", lfCat.value); };
    lfTot.onchange = function(){ var n = numAR(lfTot.value); lfGuardar("total", n == null ? "" : Math.abs(n)); };
    lfNot.onchange = function(){ lfGuardar("notas", lfNot.value.trim()); };
    lfVol.onclick = function(){ ovSet(it.id, {}); refrescar(); };
    function pintarLf(d){
      if (!lfArm){ lfArm = true; lf.append(lfEm); lfCelda("Concepto", lfCon, "w"); lfCelda("Fecha", lfFe); lfCelda("Categoría", lfCat, "w"); lfCelda("Total", lfTot); lfCelda("Cuenta", lfCta); lfCelda("Notas", lfNot); lf.append(lfVol); }
      var f = d.f, o = ovDe(it.id), a = document.activeElement;
      lfEm.textContent = "Entra en Finanzas " + (d.quien || "—") + " así:";
      if (a !== lfCon) lfCon.value = f.concepto; if (a !== lfFe) lfFe.value = f.fecha || ""; if (a !== lfCat) lfCat.value = f.cat;
      if (a !== lfTot) lfTot.value = f.total ? "$ " + Math.round(f.total).toLocaleString("es-AR") : ""; if (a !== lfNot) lfNot.value = f.notas || "";
      lfCta.textContent = GRUPOS_FIN[String(f.cat).split(".")[0]] || "";
      [[lfCon, "concepto"], [lfFe, "fecha"], [lfCat, "cat"], [lfTot, "total"], [lfNot, "notas"]].forEach(function(z){ z[0].classList.toggle("ed", o[z[1]] != null); });
      lfVol.hidden = !Object.keys(o).length;
    }
    var bv = h("button", "nvmov-ok", "✓ Aprobar"); bv.type = "button"; bv.onclick = function(){ ck.checked = true; ck.dispatchEvent(new Event("change")); };
    sub.append(fa, fw, lf);
    if (it.src === "chat") sub.append(h("span", "nvmov-tx", "“" + (it.mov.texto || "") + "”"));
    if (v.cobrado && v.facturar && Number(v.cobrado) && Math.abs(Number(v.cobrado) - Number(v.facturar)) > 1) sub.append(h("span", "nvmov-al", "Cobrado distinto de lo a facturar"));
    var de = h("select", "nvmov-dest"); de.title = "A qué estado pasa en Ventas minoristas al aprobar";
    ["PARA HACER", "EN PROCESO", "PARA EMBALAR", "LISTO PARA ENVIAR"].forEach(function(e){ var o = h("option", null, e.charAt(0) + e.slice(1).toLowerCase()); o.value = e; de.append(o); });
    de.value = DEST[it.id] || "PARA HACER"; de.onchange = function(){ DEST[it.id] = de.value; };
    var c1 = f.firstChild; c1.append(bv); c1.append(h("small", "nvmov-destl", "pasa a")); c1.append(de); w.append(sub);
    /* al abrir: todo el detalle + cómo queda en Finanzas */
    var det = h("div", "nvmov-det"); det.hidden = true;
    function area(lab, val, on){ var l = h("label", "nvmov-f"); var t = h("textarea", "nvmov-in"); t.value = val || ""; t.rows = 4; t.onchange = function(){ on(t.value); }; l.append(h("span", null, lab), t); return l; }
    var vf = h("div", "nvmov-vfin");
    det.append(vf, area("Datos personales", v.datos, function(x){ guardarVenta(it, { datos: x }); dp.value = x; }),
      area("Observaciones de envío", v.obs, function(x){ guardarVenta(it, { obs: x }); ob.value = x; }),
      area("Sucursal", v.suc, function(x){ guardarVenta(it, { suc: x }); su.value = x; }),
      area("Factura", v.fact, function(x){ guardarVenta(it, { fact: x }); refrescar(); }));
    w.append(det);
    refrescar = function(){
      var d = datosFin(it), si = fc.checked;
      var falt = [[!v.cliente, "Cliente", cl], [!arr(v.prods).length, "Productos", null], [!Number(v.cobrado), "Total cobrado", co], [!Number(v.facturar), "Total a facturar", to], [!v.pago, "Pago", pa], [!arr(v.metodo).length, "Método de pago", me], [!v.menv, "Método de envío", mn], [!v.tipo, "Tipo de envío", ti], [!quienDeCobro(v.cobro), "Cobro por", qu]];
      falt.forEach(function(z){ if (z[2]) z[2].classList.toggle("falta", !!z[0]); });
      var fl = falt.filter(function(z){ return z[0]; }).map(function(z){ return z[1]; });
      fa.textContent = fl.length ? "Campos faltantes: " + fl.join(", ") : ""; fa.hidden = !fl.length;
      bv.disabled = !!fl.length; bv.classList.toggle("off", !!fl.length); bv.textContent = fl.length ? "Faltan datos" : "✓ Aprobar";
      ft.textContent = si ? "💰 También a Finanzas " + (d.quien || "(elegí quién cobró)") : "Solo a Ventas minoristas";
      fw.classList.toggle("off", !si);
      lf.hidden = !si; pintarLf(d);
      bv.title = "Pasa a Ventas minoristas" + (si ? " y crea el cobro para Finanzas " + d.quien : "");
      vf.innerHTML = "";
      if (!si){ vf.append(h("b", null, "Esta venta no va a Finanzas"), h("p", null, "Tildá “También a Finanzas” si querés que se cargue.")); return; }
      vf.append(h("b", null, "Así se carga en Finanzas " + (d.quien || "(elegí quién cobró)")));
      var g = h("div", "nvmov-vfg"); d.cols.forEach(function(c){ var e = h("div"); e.append(h("small", null, c[0]), h("span", null, c[1])); g.append(e); });
      vf.append(g, h("p", null, "Al aprobar la venta, este cobro entra directo en Finanzas."));
    };
    fc.onchange = function(){ FIN[it.id] = fc.checked; refrescar(); };
    refrescar();
    ab.onclick = function(){ det.hidden = !det.hidden; ab.classList.toggle("on", !det.hidden); ab.textContent = det.hidden ? "Abrir" : "Cerrar"; };
    var vc = h("button", "nvmov-mas nvmov-vc", "Ver venta"); vc.type = "button"; vc.title = "Ver la venta completa en un recuadro"; vc.onclick = function(){ verCompleta(it); };
    if (ab.parentNode){ ab.parentNode.append(vc); vc.style.marginTop = "6px"; vc.style.display = "block"; }
    return w;
  }

  /* ---------- canal en el chat ---------- */
  var canalOk = false;
  function asegurarCanal(){
    if (canalOk) return; var N = window.__nv; if (!N || !N.getCH) return;
    var ch; try { ch = N.getCH(); } catch(e){ return; } if (!Array.isArray(ch)) return;
    if (!ch.some(function(c){ return c[0] === CANAL; })){ ch.unshift([CANAL, "Movimientos", "#7FA88A", "💰"]); try { N.render(); } catch(e){} }
    canalOk = true;
  }

  /* ---------- arranque ---------- */
  SB.auth.getSession().then(function(s){
    var em = s && s.data && s.data.session && s.data.session.user.email; SOY = QUIEN[String(em || "").toLowerCase()] || null;
    cargar(); enVivo();
  });
  SB.auth.onAuthStateChange(function(ev, s){ if (s && s.user && !SOY){ SOY = QUIEN[String(s.user.email || "").toLowerCase()] || null; cargar(); } });
  var pend = false;
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; try { asegurarCanal(); tabBtn(); decorarChat(); } catch(e){} }); })
    .observe(document.documentElement, { childList: true, subtree: true });
  setInterval(function(){ try { asegurarCanal(); procesar(); } catch(e){ console.warn(e); } }, 4000);
})();

/* ---------- columnas estirables: arrastrá el borde del título de cada columna ---------- */
(function(){
  if (window.__nvEstirar) return; window.__nvEstirar = 1;
  function clave(th){ return th.classList.contains("nvmov-vr") ? "ven" : "pla"; }
  function leer(k){ if (k === "ven") { try { var z = JSON.parse(localStorage.getItem("nvcols_ven") || "null"); if (z && z[0] < 80) localStorage.removeItem("nvcols_ven"); } catch(e){} } try { return JSON.parse(localStorage.getItem("nvcols_" + k) || "null"); } catch(e){ return null; } }
  function grabar(k, w){ try { localStorage.setItem("nvcols_" + k, JSON.stringify(w)); } catch(e){} }
  function aplicar(k, w){
    var tpl = w.map(function(x){ return Math.round(x) + "px"; }).join(" ");
    document.querySelectorAll(".nvmov-tb").forEach(function(tb){ var th = tb.querySelector(".nvmov-th"); if (th && clave(th) === k) tb.style.setProperty("--nvcols", tpl); });
  }
  function preparar(th){
    if (th.dataset.est) return; th.dataset.est = "1";
    var k = clave(th), g = leer(k); if (g && g.length === th.children.length) aplicar(k, g);
    Array.prototype.forEach.call(th.children, function(c, i){
      if (!c.textContent.trim()) return;
      var a = document.createElement("i"); a.className = "nvmov-asa"; a.title = "Arrastrá para agrandar o achicar la columna"; c.append(a);
      a.addEventListener("pointerdown", function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var ws = Array.prototype.map.call(th.children, function(x){ return x.getBoundingClientRect().width; });
        var x0 = ev.clientX, w0 = ws[i]; document.body.classList.add("nvmov-estirando");
        function mv(e){ ws[i] = Math.max(44, w0 + e.clientX - x0); aplicar(k, ws); }
        function up(){ document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); document.body.classList.remove("nvmov-estirando"); grabar(k, ws); }
        document.addEventListener("pointermove", mv); document.addEventListener("pointerup", up);
      });
      a.addEventListener("dblclick", function(){ try { localStorage.removeItem("nvcols_" + k); } catch(e){} document.querySelectorAll(".nvmov-tb").forEach(function(tb){ var t2 = tb.querySelector(".nvmov-th"); if (t2 && clave(t2) === k) tb.style.removeProperty("--nvcols"); }); });
    });
  }
  var pend = false;
  new MutationObserver(function(){ if (pend) return; pend = true; requestAnimationFrame(function(){ pend = false; document.querySelectorAll(".nvmov-th:not([data-est])").forEach(function(th){ try { preparar(th); } catch(e){} }); }); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();

/* ---------- Ventas minoristas: lo "Pendiente de revisar" ya se revisa en Movimientos, así que acá no se muestra ---------- */
(function(){
  if (window.__nvOcultarRev) return; window.__nvOcultarRev = 1;
  function ocultar(){
    var host = document.querySelector(".bz-host"), r = host && host.shadowRoot; if (!r) return;
    if (!r.getElementById("nvocu")){ var st = document.createElement("style"); st.id = "nvocu"; st.textContent = "[data-nvocu]{display:none!important}"; r.appendChild(st); }
    r.querySelectorAll(".gs").forEach(function(g){ var b = g.querySelector(".gsh"); if (b && /PENDIENTE DE REVISAR/i.test(b.textContent) && !g.hasAttribute("data-nvocu")) g.setAttribute("data-nvocu", ""); });
    r.querySelectorAll("tr").forEach(function(tr){ var p = tr.querySelector(".pill"); if (p && /^PENDIENTE DE REVISAR$/i.test(p.textContent.trim()) && !tr.hasAttribute("data-nvocu")) tr.setAttribute("data-nvocu", ""); });
    var cand = Array.prototype.filter.call(r.querySelectorAll("div,p,section"), function(e){ return /entraron solas/.test(e.textContent) && e.textContent.length < 400; });
    cand.sort(function(a, b){ return a.textContent.length - b.textContent.length; });
    var ban = cand[0]; if (ban){ while (ban.parentElement && ban.parentElement.textContent.length < 400 && /entraron solas/.test(ban.parentElement.textContent) && ban.parentElement.childElementCount <= 3) ban = ban.parentElement; if (!ban.hasAttribute("data-nvocu")) ban.setAttribute("data-nvocu", ""); }
  }
  setInterval(function(){ try { ocultar(); } catch(e){} }, 1200);
})();

/* ---------- Configuración: qué avisos recibir, horarios, por persona (se guarda en la cuenta de cada una) ---------- */
(function(){
  if (window.__nvCfg) return; window.__nvCfg = 1;
  var DEF = { mov: true, ventas: true, buendia: true, chat: true, canales: {}, tareas: true, tareasNuevas: true, tareasHora: "09:00", vencidas: true, pagos: true, pagosDias: 2, silencio: false, silDesde: "22:00", silHasta: "08:00" };
  var AJ = Object.assign({}, DEF), CARGADO = false;
  function sb(){ return window.__sb; }
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function aplicar(){ document.body.classList.toggle("nvcfg-sinmov", !AJ.mov && !AJ.ventas); window.__nvAjustes = AJ; }
  function cargar(){
    if (!sb()) return Promise.resolve();
    return sb().auth.getUser().then(function(r){
      var u = r && r.data && r.data.user, a = u && u.user_metadata && u.user_metadata.ajustes;
      AJ = Object.assign({}, DEF, a || {}); AJ.canales = Object.assign({}, (a && a.canales) || {}); CARGADO = true; aplicar();
    }).catch(function(){});
  }
  var tG = null;
  function guardar(){
    aplicar(); clearTimeout(tG);
    tG = setTimeout(function(){ if (sb()) sb().auth.updateUser({ data: { ajustes: AJ } }).then(function(r){ marcar(r && r.error ? "No se pudo guardar" : "Guardado ✓"); }); }, 500);
  }
  var est = null; function marcar(t){ if (est){ est.textContent = t; est.classList.add("on"); setTimeout(function(){ est.classList.remove("on"); }, 1600); } }
  function sw(on, f){ var l = h("label", "nvcfg-sw"); var i = h("input"); i.type = "checkbox"; i.checked = !!on; i.onchange = function(){ f(i.checked); }; l.append(i, h("i")); return l; }
  function fila(tit, sub, ctrl){ var r = h("div", "nvcfg-f"); var t = h("div"); t.append(h("b", null, tit)); if (sub) t.append(h("small", null, sub)); r.append(t, ctrl); return r; }
  function hora(v, f){ var i = h("input", "nvcfg-in"); i.type = "time"; i.value = v || ""; i.onchange = function(){ f(i.value); }; return i; }
  function canales(){ try { var c = window.__nv && window.__nv.getCH && window.__nv.getCH(); return Array.isArray(c) ? c : []; } catch(e){ return []; } }
  var caja = null;
  function abrir(){
    if (caja) return; caja = h("div", "nvcfg"); var p = h("div", "nvcfg-p"); caja.append(p);
    caja.onclick = function(e){ if (e.target === caja) cerrar(); };
    var cab = h("div", "nvcfg-cab"); cab.append(h("h2", null, "Configuración")); est = h("span", "nvcfg-est"); var x = h("button", "nvcfg-x", "✕"); x.type = "button"; x.onclick = cerrar; cab.append(est, x); p.append(cab);
    function pintar(){
      while (p.children.length > 1) p.removeChild(p.lastChild);
      /* al celu */
      var s0 = h("section", "nvcfg-s"); s0.append(h("h3", null, "Avisos al celu"));
      var perm = ("Notification" in window) ? Notification.permission : "no";
      var txt = perm === "granted" ? "Este dispositivo tiene permiso para avisos ✓" : perm === "denied" ? "Este dispositivo bloqueó los avisos (se cambia en los ajustes del navegador)" : "Todavía no le diste permiso a este dispositivo";
      var bt = h("button", "nvcfg-bt", perm === "granted" ? "Probar un aviso" : "Activar avisos en este dispositivo"); bt.type = "button";
      if (window.__nvPushListo && window.__nvPushListo()){ txt = "Avisos activados en este dispositivo ✓"; bt.textContent = "Mandarme un aviso de prueba"; }
      bt.onclick = function(){
        if (!window.__nvPushActivar){ marcar("Recargá la app y probá de nuevo"); return; }
        bt.disabled = true; bt.textContent = "Un segundo…";
        var p = window.__nvPushListo() ? window.__nvPushProbar() : window.__nvPushActivar().then(function(){ return window.__nvPushProbar(); });
        p.then(function(){ marcar("Te mandé un aviso de prueba ✓"); pintar(); }).catch(function(e){ var m = String((e && e.message) || e); marcar(m === "ios" ? "Primero agregá la app a la pantalla de inicio" : m === "permiso" ? "No diste permiso para los avisos" : "No se pudo activar"); pintar(); });
      };
      s0.append(fila("Este dispositivo", txt, bt));
      s0.append(h("p", "nvcfg-nota", "Para que lleguen con la app cerrada en el iPhone: abrí la app en Safari → Compartir → “Agregar a inicio”, entrá desde ese ícono y tocá “Activar avisos”."));
      p.append(s0);
      /* qué avisos */
      var s1 = h("section", "nvcfg-s"); s1.append(h("h3", null, "Qué quiero recibir"));
      s1.append(fila("Movimientos para revisar", "Cuando alguien carga un pago o cobro en #movimientos", sw(AJ.mov, function(v){ AJ.mov = v; guardar(); })));
      s1.append(fila("Ventas nuevas", "Cuando entra una venta de Tienda Nube o por WhatsApp / IG", sw(AJ.ventas, function(v){ AJ.ventas = v; guardar(); })));
      s1.append(fila("Mensajes del chat", "Mensajes nuevos de los canales que elijas abajo", sw(AJ.chat, function(v){ AJ.chat = v; guardar(); pintar(); })));
      if (AJ.chat){
        var lc = h("div", "nvcfg-can");
        canales().forEach(function(c){ var id = c[0], nom = c[1]; var on = AJ.canales[id] !== false; var b = h("button", "nvcfg-chip" + (on ? " on" : ""), (c[3] ? c[3] + " " : "") + nom); b.type = "button"; b.onclick = function(){ AJ.canales[id] = !on; guardar(); pintar(); }; lc.append(b); });
        s1.append(lc);
      }
      p.append(s1);
      /* tareas */
      var s2 = h("section", "nvcfg-s"); s2.append(h("h3", null, "Tareas"));
      s2.append(fila("Resumen de tareas del día", "Un aviso con lo que tenés para hoy", sw(AJ.tareas, function(v){ AJ.tareas = v; guardar(); pintar(); })));
      if (AJ.tareas) s2.append(fila("¿A qué hora?", null, hora(AJ.tareasHora, function(v){ AJ.tareasHora = v; guardar(); })));
      s1.append(fila("Buen día ✨", "Lunes a viernes a las 9: “Hoy es día de muchas ventas 🔥”", sw(AJ.buendia, function(v){ AJ.buendia = v; guardar(); })));
      s2.append(fila("Cuando me cargan una tarea", "Te avisa al celu si te asignan una tarea nueva", sw(AJ.tareasNuevas !== false, function(v){ AJ.tareasNuevas = v; guardar(); })));
      s2.append(fila("Tareas vencidas", "Te avisa si quedó algo sin hacer", sw(AJ.vencidas, function(v){ AJ.vencidas = v; guardar(); })));
      p.append(s2);
      /* pagos */
      var s3 = h("section", "nvcfg-s"); s3.append(h("h3", null, "Pagos a proveedores"));
      s3.append(fila("Avisarme de vencimientos", "Lo que hay que pagar en “A pagar”", sw(AJ.pagos, function(v){ AJ.pagos = v; guardar(); pintar(); })));
      if (AJ.pagos){ var d = h("select", "nvcfg-in"); [[0, "El mismo día"], [1, "1 día antes"], [2, "2 días antes"], [3, "3 días antes"], [7, "Una semana antes"]].forEach(function(o){ var op = h("option", null, o[1]); op.value = o[0]; d.append(op); }); d.value = AJ.pagosDias; d.onchange = function(){ AJ.pagosDias = Number(d.value); guardar(); }; s3.append(fila("¿Cuándo?", null, d)); }
      p.append(s3);
      /* silencio */
      var s4 = h("section", "nvcfg-s"); s4.append(h("h3", null, "Horario de silencio"));
      s4.append(fila("No molestar", "En este horario no te llega ningún aviso", sw(AJ.silencio, function(v){ AJ.silencio = v; guardar(); pintar(); })));
      if (AJ.silencio){ var hh = h("div", "nvcfg-hh"); hh.append(h("span", null, "de"), hora(AJ.silDesde, function(v){ AJ.silDesde = v; guardar(); }), h("span", null, "a"), hora(AJ.silHasta, function(v){ AJ.silHasta = v; guardar(); })); s4.append(fila("Horario", null, hh)); }
      p.append(s4);
      p.append(h("p", "nvcfg-nota", "Cada una tiene su propia configuración: lo que elijas acá no cambia lo de Pau (o lo de Euge)."));
    }
    (CARGADO ? Promise.resolve() : cargar()).then(pintar);
    document.body.append(caja); requestAnimationFrame(function(){ caja.classList.add("on"); });
  }
  function cerrar(){ if (!caja) return; var c = caja; caja = null; c.classList.remove("on"); setTimeout(function(){ c.remove(); }, 250); }
  window.__nvAbrirCfg = abrir;
  /* botón ⚙ arriba, al lado del perfil */
  function boton(){
    var top = document.querySelector("header.top"); if (!top || top.querySelector(".nvcfg-btn")) return;
    var b = h("button", "nvcfg-btn"); b.type = "button"; b.title = "Configuración";
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
    b.onclick = abrir;
    var ref = top.querySelector(".nvyo, .av, [class*=avatar]");
    var srch = Array.prototype.find.call(top.querySelectorAll("button"), function(x){ return /buscar|⌘K/i.test(x.textContent) || x.querySelector("svg circle"); });
    if (srch && srch.parentNode) srch.parentNode.insertBefore(b, srch.nextSibling); else top.append(b);
  }
  setInterval(function(){ try { boton(); } catch(e){} }, 1500);
  setTimeout(cargar, 3000);
})();

/* ---------- Celu: menú "Más" nuevo (mismo orden y grupos que el menú de la compu, sin repetir lo que ya está abajo) ---------- */
(function(){
  if (window.__nvMas) return; window.__nvMas = 1;
  var NUNCA = { "tab-env": 1, "tab-ven": 1, "tab-tej": 1, "tab-promo": 1, "tab-mas": 1 };
  var TONO = { "Día a día": "cel", "Ventas": "ros", "Gestión": "ver", "Contenido": "are" };
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var CHEV = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>';
  function rehacer(sh){
    if (sh.__nvMas) return; sh.__nvMas = 1;
    var menu = sh.querySelector(".menu"), cerrarBt = sh.querySelector(".btn.ghost"); if (!menu) return;
    var nav = document.querySelector("nav.tabs"); if (!nav) return;
    function cerrar(){ if (cerrarBt) cerrarBt.click(); else { var s = sh.closest(".scrim"); if (s) s.remove(); } }
    var usados = {}, cont = h("div", "nvmas"), grupo = null, card = null, tono = "cel";
    Array.prototype.forEach.call(nav.children, function(e){
      if (e.classList.contains("navsec")){ grupo = e.textContent.trim(); tono = TONO[grupo] || "cel"; card = null; return; }
      if (!e.classList.contains("tab") || NUNCA[e.id] || e.classList.contains("nvcfg-tab")) return;
      if (getComputedStyle(e).display !== "none") return; /* ya está en el menú de abajo */
      var lb = e.querySelector(".lb"), ic = e.querySelector(".ic"), n = e.querySelector(".n");
      var nom = (lb ? lb.textContent : e.textContent).trim(); if (!nom) return;
      usados[nom.split(" ")[0].toLowerCase()] = 1;
      if (!card){ cont.append(h("div", "nvmas-g", grupo || "")); card = h("div", "nvmas-c"); cont.append(card); }
      var b = h("button", "nvmas-i"); b.type = "button";
      var i = h("i", "nvmas-ic " + tono); if (ic){ var cl = ic.cloneNode(true); Array.prototype.forEach.call(cl.querySelectorAll(".n"), function(z){ z.remove(); }); var sv = cl.querySelector("svg"); if (sv) i.append(sv); } b.append(i, h("span", "nvmas-t", nom));
      var num = n && n.textContent.trim(); if (num && num !== "0") b.append(h("b", "nvmas-n", num));
      var ch = h("span", "nvmas-ch"); ch.innerHTML = CHEV; b.append(ch);
      b.onclick = function(){ cerrar(); setTimeout(function(){ e.click(); }, 30); };
      card.append(b);
    });
    /* lo que el menú viejo tenía y no está en la barra (ej. archivo de tareas) */
    var todos = {}; Array.prototype.forEach.call(nav.querySelectorAll(".tab"), function(t){ var l = t.querySelector(".lb"); (l ? l.textContent : t.textContent).trim().split(/\s+/).forEach(function(w){ todos[w.toLowerCase()] = 1; }); });
    var extra = Array.prototype.filter.call(menu.querySelectorAll("button"), function(b){ var t = (b.querySelector("span") || b).textContent.trim().split(" ")[0].toLowerCase(); return t && !todos[t]; });
    var otros = h("div", "nvmas-c");
    extra.forEach(function(b){ b.className = "nvmas-i"; var sv = b.querySelector("svg"); var i = h("i", "nvmas-ic are"); if (sv) i.append(sv); b.prepend(i); var sp = b.querySelector("span"); if (sp) sp.className = "nvmas-t"; var sm = b.querySelector("small"); if (sm) sm.className = "nvmas-n"; var ch = h("span", "nvmas-ch"); ch.innerHTML = CHEV; b.append(ch); otros.append(b); });
    var cf = h("button", "nvmas-i"); cf.type = "button"; var ci = h("i", "nvmas-ic cho"); ci.innerHTML = GEAR; cf.append(ci, h("span", "nvmas-t", "Configuración")); var cc = h("span", "nvmas-ch"); cc.innerHTML = CHEV; cf.append(cc);
    cf.onclick = function(){ cerrar(); setTimeout(function(){ if (window.__nvAbrirCfg) window.__nvAbrirCfg(); }, 60); };
    otros.append(cf);
    cont.append(h("div", "nvmas-g", "Más"), otros);
    menu.replaceWith(cont);
    sh.classList.add("nvmas-sh");
    var tt = sh.querySelector("h2"); if (tt) tt.textContent = "Todo lo demás";
  }
  new MutationObserver(function(){
    document.querySelectorAll(".scrim .sheet").forEach(function(sh){ var t = sh.querySelector("h2"); if (t && /Más secciones/.test(t.textContent)) rehacer(sh); });
  }).observe(document.body, { childList: true, subtree: true });
})();

/* ---------- Tienda web: más clara y más proactiva ---------- */
(function(){
  if (window.__nvWeb) return; window.__nvWeb = 1;
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function dias(card){ var c = Array.prototype.find.call(card.querySelectorAll(".web-chip"), function(x){ return /^hace /.test(x.textContent.trim()); }); if (!c) return 0; var m = c.textContent.match(/(\d+)\s*d/); return m ? Number(m[1]) : 0; }
  var WA = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9 8.6c.2 2.9 2.6 5.5 5.6 6l1.2-1.3-1.7-1-1 .7a4.3 4.3 0 0 1-2.4-2.4l.7-1-1-1.7z"/></svg>';
  function mejorar(){
    var m = document.querySelector("main#list"); if (!m || !m.querySelector(".web-top")) return;
    m.classList.add("nvweb");
    var cards = m.querySelectorAll(".web-card.web-v");
    var help = m.querySelector(".web-help");
    var ban = m.querySelector(".nvweb-ban");
    if (cards.length){
      if (help && /PENDIENTE DE REVISAR/.test(help.textContent)) help.hidden = true;
      var max = 0; Array.prototype.forEach.call(cards, function(c){ var d = dias(c); if (d > max) max = d; });
      if (!ban){
        ban = h("div", "nvweb-ban"); var tx = h("div", "nvweb-bt"); var b1 = h("b"), s1 = h("span"); tx.append(b1, s1);
        var go = h("button", "nvweb-go", "Revisar en Movimientos →"); go.type = "button"; go.onclick = function(){ var t = document.getElementById("tab-mov"); if (t) t.click(); };
        ban.append(h("i", "nvweb-dot"), tx, go); m.querySelector(".web-top").after(ban);
      }
      ban.querySelector("b").textContent = cards.length === 1 ? "1 venta web esperando aprobación" : cards.length + " ventas web esperando aprobación";
      ban.querySelector("span").textContent = (max >= 1 ? "La más vieja entró hace " + max + (max === 1 ? " día" : " días") + ". " : "") + "Se aprueban en Movimientos, junto con lo que va a Finanzas.";
      ban.classList.toggle("tarde", max >= 2);
    } else if (ban) ban.remove();
    Array.prototype.forEach.call(cards, function(c){
      if (c.__nv) return; c.__nv = 1;
      var d = dias(c); if (d >= 2) c.classList.add("nvweb-tarde");
      Array.prototype.forEach.call(c.querySelectorAll(".web-chip"), function(x){ if (/^hace /.test(x.textContent.trim()) && d >= 2) x.classList.add("nvweb-urg"); });
      Array.prototype.forEach.call(c.querySelectorAll(".web-items li"), function(li){ if (/^\s*\d+\s*$/.test(li.textContent)) { li.classList.add("nvweb-sin"); li.append(h("small", null, " · producto sin nombre en la tienda")); } });
      var tel = c.querySelector(".web-tel"), ct = c.querySelector(".web-contact");
      var dig = tel ? tel.textContent.replace(/\D/g, "") : "";
      if (ct && dig.length >= 10 && !ct.querySelector(".nvweb-wa")){
        var a = h("a", "nvweb-wa"); a.href = "https://wa.me/" + dig; a.target = "_blank"; a.rel = "noopener"; a.innerHTML = WA; a.append(document.createTextNode(" WhatsApp")); ct.append(a);
      }
    });
    var k = m.querySelector(".web-kpi"); if (k){ var n = k.querySelector(".web-kn"); k.classList.toggle("nvweb-ok", !!n && n.textContent.trim() === "0"); }
  }
  setInterval(function(){ try { mejorar(); } catch(e){} }, 800);
})();

/* ---------- Canal #movimientos: resumen arriba (cuántos hay, en qué estado, y si falta pasar algún mensaje) ---------- */
(function(){
  if (window.__nvMovRes) return; window.__nvMovRes = 1;
  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var DATA = null, ULT = 0, CARG = false;
  function traer(){
    if (CARG || !window.__sb) return; CARG = true;
    window.__sb.from("movimientos").select("msg_id,estado,signo,monto,tipo").then(function(r){ CARG = false; if (r && !r.error){ DATA = r.data || []; ULT = Date.now(); pintar(); } }, function(){ CARG = false; });
  }
  function f2(n){ return String(n).padStart(2, "0"); }
  function pintar(){
    var ay = document.querySelector(".chw .nvmov-ayuda"); var w = document.querySelector(".chw");
    var box = w && w.querySelector(".nvmov-res");
    if (!ay){ if (box) box.remove(); return; }
    if (!box){ box = h("div", "nvmov-res"); var lst = w.querySelector(".chlist"); (lst || ay).parentNode.insertBefore(box, lst || ay); }
    if (!DATA){ box.textContent = "Cargando resumen…"; return; }
    var rows = DATA.filter(function(r){ return !/^venta:/.test(r.msg_id || ""); });
    var pend = rows.filter(function(r){ return r.estado === "pendiente"; }).length;
    var apr = rows.filter(function(r){ return r.estado === "aprobado"; }).length;
    var ids = {}; DATA.forEach(function(r){ ids[r.msg_id] = 1; });
    var msgs = Array.prototype.filter.call(w.querySelectorAll(".chmsg[data-id]"), function(m){ return !/TODO ACTUALIZADO/i.test(m.textContent || ""); }).map(function(m){ return m.getAttribute("data-id"); });
    var falt = msgs.filter(function(id){ return !ids[id]; }).length;
    var d = new Date(ULT);
    box.innerHTML = "";
    var t = h("div", "nvmov-rt"); t.append(h("b", null, "Resumen de movimientos"), h("small", null, "Actualizado al " + f2(d.getDate()) + "/" + f2(d.getMonth() + 1) + " · " + f2(d.getHours()) + ":" + f2(d.getMinutes())));
    var k = h("div", "nvmov-rk");
    function kp(n, l, c){ var e = h("span", "nvmov-kp " + (c || "")); e.append(h("b", null, String(n)), h("small", null, l)); k.append(e); }
    kp(rows.length, rows.length === 1 ? "cargado" : "cargados");
    kp(pend, pend === 1 ? "pendiente" : "pendientes", pend ? "pe" : "");
    kp(apr, apr === 1 ? "aprobado" : "aprobados", "ok");
    var ok = h("span", "nvmov-chk " + (falt ? "mal" : "bien"), falt ? (falt === 1 ? "1 mensaje del canal no pasó a Movimientos" : falt + " mensajes del canal no pasaron a Movimientos") : "✓ Todos los mensajes del canal están en Movimientos");
    box.append(t, k, ok);
    if (pend){ var go = h("button", "nvmov-rgo", "Revisar →"); go.type = "button"; go.onclick = function(){ var x = document.getElementById("tab-mov"); if (x) x.click(); }; box.append(go); }
  }
  setInterval(function(){
    try {
      var ay = document.querySelector(".chw .nvmov-ayuda");
      if (ay && Date.now() - ULT > 20000) traer();
      pintar();
    } catch(e){}
  }, 1500);
})();

/* ---------- Compu: "Configuración" abajo en el menú de la izquierda ---------- */
(function(){
  if (window.__nvCfgSide) return; window.__nvCfgSide = 1;
  setInterval(function(){
    try {
      var nav = document.querySelector("nav.tabs"), yo = nav && nav.querySelector(".nvyo"); if (!yo || nav.querySelector(".nvcfg-tab")) return;
      var sec = document.createElement("div"); sec.className = "navsec nvcfg-sec"; sec.textContent = "Ajustes";
      var b = document.createElement("button"); b.type = "button"; b.className = "tab desk nvcfg-tab";
      b.innerHTML = '<span class="ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg></span><span class="lb">Configuración</span>';
      b.onclick = function(){ if (window.__nvAbrirCfg) window.__nvAbrirCfg(); };
      nav.insertBefore(sec, yo); nav.insertBefore(b, yo);
    } catch(e){}
  }, 1500);
})();

/* ---------- Avisos al celu (con la app cerrada): activar en este dispositivo, avisar mensajes del chat ---------- */
(function(){
  if (window.__nvPush) return; window.__nvPush = 1;
  function b64(s){ var p = "=".repeat((4 - s.length % 4) % 4); var r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); var a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  function llamar(body){ return window.__sb.functions.invoke("avisos", { body: body }).then(function(r){ if (r.error) throw r.error; return r.data || {}; }); }
  function esIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent); }
  function instalada(){ try { return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch(e){ return false; } }
  function activar(){
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return Promise.reject(new Error(esIOS() && !instalada() ? "ios" : "no"));
    return Notification.requestPermission().then(function(p){
      if (p !== "granted") throw new Error("permiso");
      return Promise.all([navigator.serviceWorker.register("avisos-sw.js", { scope: "./" }).then(function(){ return navigator.serviceWorker.ready; }), llamar({ accion: "clave" })]);
    }).then(function(x){
      var reg = x[0], k = x[1].publica; if (!k) throw new Error("no");
      return reg.pushManager.getSubscription().then(function(s){ return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k) }); });
    }).then(function(sub){ return llamar({ accion: "suscribir", sub: sub.toJSON(), dispositivo: navigator.userAgent }); })
      .then(function(r){ if (r && r.error) throw new Error(r.error); try { localStorage.setItem("nv-push", "1"); } catch(e){} return r; });
  }
  window.__nvPushActivar = activar;
  window.__nvPushProbar = function(){ return llamar({ accion: "probar" }); };
  window.__nvPushListo = function(){ try { return localStorage.getItem("nv-push") === "1" && Notification.permission === "granted"; } catch(e){ return false; } };
  /* si ya estaba activado en este dispositivo, se renueva solo */
  setTimeout(function(){ if (window.__nvPushListo()) activar().catch(function(){}); }, 6000);

  /* chat: cuando mandás un mensaje, les llega el aviso a las demás */
  var ult = "";
  function canalActual(){
    var b = document.querySelector(".chw .chtt b"), nom = b ? b.textContent.trim() : "";
    var id = nom.toLowerCase();
    try { (window.__nv.getCH() || []).forEach(function(c){ if (String(c[1]).toLowerCase() === nom.toLowerCase()) id = String(c[0]); }); } catch(e){}
    return { id: id, nom: nom };
  }
  function avisarChat(form){ if (window.__nvChatAvisoDatos) return;
    var ta = form.querySelector("textarea, input[type=text]"); var tx = ta ? ta.value.trim() : "";
    var c = canalActual(); if (!c.id || /movimiento/i.test(c.nom)) return;
    var clave = c.id + "|" + tx; if (clave === ult) return; ult = clave; setTimeout(function(){ if (ult === clave) ult = ""; }, 3000);
    if (!tx && !form.querySelector(".chatt, .chadj, [data-adj]")) return;
    llamar({ accion: "chat", canal: c.id, canalNombre: c.nom, texto: tx }).catch(function(){});
  }
  document.addEventListener("submit", function(e){ var f = e.target; if (f && f.matches && f.matches(".chw form.chf")) avisarChat(f); }, true);
  document.addEventListener("keydown", function(e){ if (e.key === "Enter" && !e.shiftKey && !e.isComposing){ var f = e.target && e.target.closest && e.target.closest(".chw form.chf"); if (f) avisarChat(f); } }, true);
  document.addEventListener("click", function(e){ var b = e.target && e.target.closest && e.target.closest(".chw form.chf button[type=submit], .chw form.chf .chsend"); if (b) avisarChat(b.closest("form")); }, true);

  /* al tocar un aviso, abrir donde corresponde */
  try { var ir = new URLSearchParams(location.search).get("ir"); if (ir) { var n = 0, t = setInterval(function(){ var el = document.getElementById(ir === "mov" ? "tab-mov" : "tab-chat"); if (el || ++n > 30){ clearInterval(t); if (el) el.click(); } }, 500); } } catch(e){}
})();

/* ---------- Ventas y Finanzas al día en todos los dispositivos: si alguien carga algo en otro celu o compu, aparece solo ---------- */
(function(){
  if (window.__nvBaseSync) return; window.__nvBaseSync = 1;
  var SB = window.__sb; if (!SB) return;
  var VISTO = null, ULT = "", PEND = false, corriendo = false;
  function editando(){
    var a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return true;
    if (document.querySelector("#sheetHost .scrim, .scrim .sheet, .nvcfg")) return true;
    return false;
  }
  function aplicar(){
    var nv = window.__nv; if (!nv || !nv.S || !nv.S.bzData) { PEND = false; return; }
    if (editando()){ PEND = true; return; }
    PEND = false; ULT = "";
    var y = window.scrollY;
    nv.S.bzData = null;
    try { nv.render(); } catch(e){}
    var n = 0, t = setInterval(function(){ if (nv.S.bzData || ++n > 60){ clearInterval(t); setTimeout(function(){ window.scrollTo(0, y); }, 60); } }, 250);
  }
  /* aviso liviano: cada vez que alguien guarda algo de la Base, queda la hora en "cambios" */
  window.__nvBaseCambio = function(){ var ahora = new Date().toISOString(); VISTO = ahora; SB.from("cambios").upsert({ id: "base", cuando: ahora }).then(function(){}, function(){}); };
  function mirar(){
    if (document.hidden) return;
    SB.from("cambios").select("cuando").eq("id", "base").maybeSingle().then(function(r){
      var c = r && r.data && r.data.cuando; if (!c) return;
      if (VISTO === null){ VISTO = c; return; }
      if (Date.parse(c) > Date.parse(VISTO)){ VISTO = c; aplicar(); }
    }, function(){});
  }
  /* al volver a la app: revisión completa (por si entró algo solo, como una venta de Tienda Nube) */
  function completa(){
    var nv = window.__nv; if (!nv || !nv.S || !nv.S.bzData || corriendo) return; corriendo = true;
    try {
      google.script.run.withSuccessHandler(function(d){
        corriendo = false; var h = ""; try { h = JSON.stringify(d); } catch(e){}
        if (!h) return; if (!ULT){ ULT = h; return; }
        if (h !== ULT){ ULT = h; aplicar(); }
      }).withFailureHandler(function(){ corriendo = false; }).baseLeer();
    } catch(e){ corriendo = false; }
  }
  setTimeout(mirar, 3000); setTimeout(completa, 12000);
  setInterval(function(){ mirar(); if (PEND && !editando()) aplicar(); }, 12000);
  var oculto = 0;
  document.addEventListener("visibilitychange", function(){ if (document.hidden){ oculto = Date.now(); return; } mirar(); if (oculto && Date.now() - oculto > 60000) completa(); });
})();

/* ---------- Movimientos: las filas siempre alineadas con los títulos de columna (también al estirar) ---------- */
(function(){
  if (window.__nvAlinear) return; window.__nvAlinear = 1;
  function alinear(){
    document.querySelectorAll(".nvmov-tb").forEach(function(tb){
      var th = tb.querySelector(".nvmov-th"); if (!th) return;
      var g = getComputedStyle(th).gridTemplateColumns; if (!g || g === "none") return;
      tb.querySelectorAll(".nvmov-tr").forEach(function(r){ if (r.style.getPropertyValue("grid-template-columns") !== g) r.style.setProperty("grid-template-columns", g, "important"); });
    });
  }
  setInterval(function(){ if (document.body.classList.contains("nvmov-on")) alinear(); }, 300);
  document.addEventListener("pointermove", function(e){ if (e.buttons && document.body.classList.contains("nvmov-on")) alinear(); }, true);
  window.addEventListener("resize", alinear);
})();

/* ---------- Facturación (archivo aparte) ---------- */
(function(){ if (window.__nvFactCarga) return; window.__nvFactCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "fact.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* ---------- Mayoristas: diseño y WhatsApp (archivo aparte) ---------- */
(function(){ if (window.__nvMayCarga) return; window.__nvMayCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "may.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* ---------- Si se borra un mensaje en #movimientos (desde cualquier celu o compu), se borra también en Movimientos ---------- */
(function(){
  if (window.__nvMovBorrados) return; window.__nvMovBorrados = 1;
  var hechos = {};
  function limpiar(){
    try {
      var S = window.__nv && window.__nv.S, SB = window.__sb; if (!S || !S.chat || !S.chat.m || !SB) return;
      var ids = S.chat.m.filter(function(m){ return m.canal === "mov" && m.borrado && !hechos[m.id]; }).map(function(m){ return String(m.id); });
      if (!ids.length) return;
      SB.from("movimientos").select("id,msg_id,estado").in("msg_id", ids).then(function(r){
        if (r.error) return;
        var aBorrar = (r.data || []).filter(function(x){ return x.estado !== "aprobado"; });
        (r.data || []).forEach(function(x){ if (x.estado === "aprobado") hechos[x.msg_id] = 1; });
        ids.forEach(function(id){ if (!(r.data || []).some(function(x){ return x.msg_id === id; })) hechos[id] = 1; });
        if (!aBorrar.length) return;
        SB.from("movimientos").delete().in("id", aBorrar.map(function(x){ return x.id; })).then(function(d){
          if (!d.error) aBorrar.forEach(function(x){ hechos[x.msg_id] = 1; });
        });
      });
    } catch(e){}
  }
  setInterval(limpiar, 8000); setTimeout(limpiar, 3000);
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) setTimeout(limpiar, 1500); });
})();

/* ---------- Mayoristas · Mails (archivo aparte) ---------- */
(function(){ if (window.__nvMailsCarga) return; window.__nvMailsCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "mails.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* ---------- Tareas: días que se repite + aviso de tarea nueva (archivo aparte) ---------- */
(function(){ if (window.__nvTareasCarga) return; window.__nvTareasCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "tareas.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* resumen de la semana (lunes) */
(function(){ if (window.__nvLunesCarga) return; window.__nvLunesCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "lunes.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* buscador de categoría y cuenta */
(function(){ if (window.__nvBCCarga) return; window.__nvBCCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "buscacat.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();

/* mayoristas: clientes */
(function(){ if (window.__nvCliCarga) return; window.__nvCliCarga = 1; var cs = document.currentScript, v = cs && /[?&]v=(\d+)/.exec(cs.src); var sc = document.createElement("script"); sc.src = "clientes.js" + (v ? "?v=" + v[1] : "?t=" + Date.now()); document.head.appendChild(sc); })();


/* ===== Movimientos: chat al lado + comandos con / ===== */
(function(){
  if (window.__nvMovChat) return; window.__nvMovChat = 1;
  var SB = function(){ return window.__sb; };
  var QUIEN = { "eugeabdon@gmail.com": "euge", "mpauabdon@gmail.com": "pau", "nervodesigncordoba@gmail.com": "euge" };
  var NOM = { euge: "Euge", pau: "Pau", web: "🛒 Venta web" };
  var SOY = "";
  try { SB().auth.getUser().then(function(r){ var e = r && r.data && r.data.user && r.data.user.email; SOY = QUIEN[e] || ""; }); } catch(e){}

  /* ---------- comandos ---------- */
  var CMDS = [
    { c: "/pago Euge", d: "Euge pagó algo (transferencia o efectivo)", top: 1 },
    { c: "/pago Pau", d: "Pau pagó algo (transferencia o efectivo)", top: 1 },
    { c: "/nueva venta", d: "Pasar una venta minorista", top: 1 },
    { c: "/ojo", d: "Hay que corregir un dato de una venta o compra" },
    { c: "/cobro Euge", d: "Entró plata a la cuenta de Euge" },
    { c: "/cobro Pau", d: "Entró plata a la cuenta de Pau" },
    { c: "/seña", d: "Un cliente dejó una seña" },
    { c: "/mayorista", d: "Venta mayorista" },
    { c: "/sueldo", d: "Pago de sueldo (Damián, tejedoras…)" },
    { c: "/envío", d: "Pago de un envío o flete" }
  ];
  function N(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function leerCmd(txt){
    var t = String(txt || ""), m = /^\s*\/\s*([a-záéíóúñ]+)(?:\s+(venta))?(?:\s+(euge|pau))?\b\s*/i.exec(t);
    if (!m) return null;
    var k = N(m[1]), quien = m[3] ? m[3].toLowerCase() : "", resto = t.slice(m[0].length);
    if (k === "nueva" && m[2]) k = "venta";
    var ok = { pago: 1, venta: 1, ojo: 1, cobro: 1, sena: 1, mayorista: 1, sueldo: 1, envio: 1 };
    if (!ok[k]) return null;
    return { k: k, quien: quien, resto: resto };
  }
  window.__nvLeerCmd = leerCmd;
  // envuelve al lector: el comando manda sobre lo que adivina el lector
  function envolver(){
    var L = window.__nvLector; if (!L || !L.leer || L.leer.__cmd) return;
    var orig = L.leer;
    L.leer = function(m, pres){
      var c = leerCmd(m && m.texto);
      if (!c) return orig.apply(this, arguments);
      if (c.k === "ojo") return Promise.resolve({ tipo: "otro", signo: null, monto: null, por: null, cuenta: null, concepto: "⚠ OJO: " + c.resto.trim(), falta: ["corregir lo que dice el mensaje"], leido: "comando /ojo" });
      var m2 = Object.assign({}, m, { texto: c.resto });
      return Promise.resolve(orig.call(this, m2, pres)).then(function(res){
        res = res || {};
        if (c.k === "pago"){ res.tipo = "pago"; res.signo = "egreso"; }
        if (c.k === "venta"){ res.tipo = "venta"; res.signo = "ingreso"; }
        if (c.k === "mayorista"){ res.tipo = "mayorista"; res.signo = "ingreso"; }
        if (c.k === "sena"){ res.tipo = "sena"; res.signo = "ingreso"; }
        if (c.k === "sueldo"){ res.tipo = "sueldo"; res.signo = "egreso"; }
        if (c.k === "envio"){ res.tipo = "envio"; res.signo = "egreso"; }
        if (c.k === "cobro"){ res.tipo = res.tipo && res.tipo !== "pago" ? res.tipo : "otro"; res.signo = "ingreso"; }
        if (c.quien){ res.por = c.quien; res.cuenta = c.quien; if (res.falta) res.falta = res.falta.filter(function(f){ return !/qui[eé]n|cuenta|carga/i.test(f); }); }
        return res;
      });
    };
    L.leer.__cmd = 1;
  }
  setInterval(envolver, 800);

  /* ---------- sugerencias al escribir / ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".nvsl{position:fixed;z-index:9500;background:#FFFDFB;border:1px solid #E8DED4;border-radius:16px;box-shadow:0 14px 36px rgba(58,36,28,.18);padding:6px;width:300px;max-width:calc(100vw - 20px);font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    ".nvsl button{display:flex;flex-direction:column;align-items:flex-start;width:100%;border:0;background:none;border-radius:11px;padding:8px 10px;font:inherit;text-align:left;cursor:pointer}",
    ".nvsl button:hover,.nvsl button.sel{background:#F3EBE3}",
    ".nvsl b{font-size:14px;font-weight:600}.nvsl small{font-size:12px;color:#8C7D71}",
    ".nvsl .mas{font-size:12px;color:#9C7B62;padding:6px 10px 4px;border-top:1px solid #F0E8E0;margin-top:4px}",
    ".nvcmd-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:4px}",
    ".nvcmd-bar button{border:1px solid #E4D9CE;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12.5px;color:#5A4638;cursor:pointer}",
    ".nvcmd-bar button:hover{background:#F3EBE3}"
  ].join("\n");
  document.head.appendChild(css);
  var POP = null, POPT = null, SEL = 0;
  function cerrarPop(){ if (POP){ POP.remove(); POP = null; POPT = null; } }
  function enMov(ta){
    if (ta.closest("#nvmc")) return true;
    var chw = ta.closest(".chw"); if (!chw) return false;
    var t = chw.querySelector(".chtt b"); return !!t && /movimientos/i.test(t.textContent);
  }
  function poner(ta, c){
    ta.value = c + " "; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
    ta.dispatchEvent(new Event("input", { bubbles: true })); cerrarPop();
  }
  function sugerir(ta){
    var v = ta.value;
    if (!/^\/[^\n]*$/.test(v) || v.length > 16 || / \S+ \S/.test(v) || !enMov(ta)){ cerrarPop(); return; }
    var q = N(v.slice(1)).trim();
    var L = q ? CMDS.filter(function(x){ return N(x.c.slice(1)).indexOf(q) === 0 || N(x.c).indexOf(q) >= 0; }) : CMDS.filter(function(x){ return x.top; });
    if (!L.length){ cerrarPop(); return; }
    if (!POP){ POP = document.createElement("div"); POP.className = "nvsl"; document.body.appendChild(POP); }
    POPT = ta; SEL = Math.min(SEL, L.length - 1); POP.innerHTML = "";
    L.forEach(function(x, i){ var b = document.createElement("button"); b.type = "button"; if (i === SEL) b.className = "sel"; b.innerHTML = "<b></b><small></small>"; b.firstChild.textContent = x.c; b.lastChild.textContent = x.d; b.onmousedown = function(e){ e.preventDefault(); poner(ta, x.c); }; POP.appendChild(b); });
    if (!q){ var m = document.createElement("div"); m.className = "mas"; m.textContent = "Seguí escribiendo para ver más: /ojo, /cobro, /seña, /sueldo…"; POP.appendChild(m); }
    var r = ta.getBoundingClientRect();
    POP.style.left = Math.max(10, Math.min(r.left, innerWidth - POP.offsetWidth - 10)) + "px";
    var vt = window.visualViewport ? visualViewport.offsetTop : 0; POP.style.top = Math.max(vt + 10, r.top - POP.offsetHeight - 8) + "px";
  }
  document.addEventListener("input", function(e){ var ta = e.target; if (ta && ta.tagName === "TEXTAREA") sugerir(ta); }, true);
  document.addEventListener("keydown", function(e){
    if (!POP || e.target !== POPT) return;
    var bs = POP.querySelectorAll("button");
    if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); SEL = (SEL + (e.key === "ArrowDown" ? 1 : bs.length - 1)) % bs.length; sugerir(POPT); }
    else if (e.key === "Enter" || e.key === "Tab"){ e.preventDefault(); e.stopPropagation(); poner(POPT, bs[SEL].firstChild.textContent); }
    else if (e.key === "Escape") cerrarPop();
  }, true);
  document.addEventListener("focusout", function(){ setTimeout(function(){ if (POPT && document.activeElement !== POPT) cerrarPop(); }, 150); });

  // en el chat de Movimientos: lista de comandos en lugar de los ejemplos
  setInterval(function(){
    var a = document.querySelector(".chw .nvmov-ayuda");
    if (a && !a.__cmd){
      a.__cmd = 1; a.innerHTML = "<b>Comandos</b>";
      var bar = document.createElement("div"); bar.className = "nvcmd-bar";
      CMDS.slice(0, 6).forEach(function(x){ var b = document.createElement("button"); b.type = "button"; b.textContent = x.c; b.title = x.d; b.onclick = function(){ var ta = document.querySelector(".chw .chf textarea"); if (ta) poner(ta, x.c); }; bar.appendChild(b); });
      a.appendChild(bar);
    }
    var ta = document.querySelector(".chw .chf textarea");
    if (ta && enMov(ta) && !ta.__ph){ ta.__ph = 1; ta.placeholder = "Escribí… (con / ves los comandos)"; }
  }, 700);

  /* ---------- chat al lado en Movimientos ---------- */
  var st = document.createElement("style");
  st.textContent = [
    "#nvmc{position:fixed;z-index:30;display:none;flex-direction:column;background:#FFFDFB;border:1px solid #EDE5DC;border-radius:20px;box-shadow:0 10px 30px rgba(58,36,28,.08);overflow:hidden;font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    "body.nvmov-on.nvmc-on #nvmc{display:flex}",
    "@media(min-width:901px){body.nvmov-on.nvmc-on .wrap{max-width:none!important}}",
    "@media(max-width:900px){html.nv-kb body.nvmc-on #nvmc{top:var(--vvt,0px)!important;height:var(--vvh,100vh)!important;bottom:auto!important;z-index:6000;border-radius:0}}",
    "@media(min-width:901px){body.nvmov-on.nvmc-on section.nvmovp{margin-right:calc(min(420px,34vw) + 22px)!important}}",
    "#nvmc .h{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #F0E8E0}",
    "#nvmc .h b{font-size:15px}#nvmc .h small{display:block;font-size:12px;color:#8C7D71;font-weight:400}",
    "#nvmc .f{display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid #F0E8E0;flex-wrap:wrap}",
    "#nvmc .f button{border:0;border-radius:999px;padding:4px 11px;font:inherit;font-size:12.5px;background:#F1EAE2;color:#6B5A4E;cursor:pointer}",
    "#nvmc .f button.on{background:#3B2418;color:#fff}",
    "#nvmc .l{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;display:flex;flex-direction:column;gap:9px;overscroll-behavior:contain}",
    "#nvmc .m{background:#fff;border:1px solid #EDE5DC;border-radius:14px;padding:8px 11px;font-size:13.5px;line-height:1.45;max-width:94%;white-space:pre-wrap;word-break:break-word}",
    "#nvmc .m.yo{align-self:flex-end;background:#F8EDEA}",
    "#nvmc .m.falta{border:1.5px dashed #E0A994}",
    "#nvmc .m .w{display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:600;color:#9C7B62;margin-bottom:2px}#nvmc .m .w i{font-style:normal;font-weight:400;color:#A99A8E}",
    "#nvmc .dia{align-self:center;font-size:11.5px;background:#F3EEE8;border-radius:999px;padding:3px 10px;color:#8C7D71}",
    "#nvmc .chip{display:inline-block;margin-top:6px;font-size:11.5px;padding:3px 9px;border-radius:999px;white-space:normal}",
    "#nvmc .c-ok{background:#E3EEDF;color:#3E6B3A}#nvmc .c-pen{background:#F6ECD5;color:#8A6420}#nvmc .c-no{background:#F3E2DC;color:#9A4B36}#nvmc .c-gr{background:#F1EAE2;color:#8C7D71}",
    "#nvmc .cta{display:flex;gap:6px;margin-top:6px}#nvmc .cta button{border:1px solid #DCCFC2;background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;cursor:pointer}#nvmc .cta button.p{background:#3B2418;color:#fff;border-color:#3B2418}",
    "#nvmc form{display:flex;gap:8px;align-items:flex-end;padding:10px;border-top:1px solid #F0E8E0;background:#fff;margin:0}",
    "#nvmc textarea{flex:1;min-width:0;border:0;outline:0;background:#F3EEE8;border-radius:20px;padding:10px 14px;font:inherit;font-size:14px;color:#3B2418;resize:none;height:40px;max-height:120px;line-height:1.35}",
    "#nvmc form button{width:40px;height:40px;border-radius:50%;border:0;background:#3B2418;color:#fff;font-size:15px;cursor:pointer;flex:none}",
    ".nvmc-sw{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:#ECE6DF;margin-left:auto}",
    ".nvmc-sw button{border:0;background:transparent;border-radius:999px;padding:6px 13px;font:inherit;font-size:13px;color:#7A5E50;cursor:pointer}",
    ".nvmc-sw button.on{background:#fff;color:#3B2418;font-weight:600;box-shadow:0 1px 3px rgba(58,36,28,.1)}",
    ".nvmov-cab{display:flex!important;align-items:center;gap:12px;flex-wrap:wrap}",
    "@media(max-width:900px){",
    "  #nvmc{left:0!important;right:0!important;border-radius:18px 18px 0 0;border-left:0;border-right:0}",
    "  body.nvmov-on.nvmc-solo section.nvmovp > :not(.nvmov-cab){display:none!important}",
    "  .nvmc-sw{margin-left:0;width:100%;justify-content:space-between}.nvmc-sw button{flex:1;padding:8px 6px;font-size:13.5px}",
    "  #nvmc .m{font-size:14px}",
    "  #nvmc .h{display:none}",
    "}"
  ].join("\n");
  document.head.appendChild(st);

  var MODO = (function(){ try { return localStorage.getItem("nv-mc-modo") || ""; } catch(e){ return ""; } })();
  function modo(){ if (MODO) return MODO; return innerWidth > 900 ? "dos" : "lista"; }
  function setModo(m){ MODO = m; try { localStorage.setItem("nv-mc-modo", m); } catch(e){} pintarSw(); acomodar(); if (m !== "lista") setTimeout(alFondo, 50); }
  var FIL = "todo", ROWS = {}, ULTR = 0, BOX = null, LISTA = null, CL = "";

  function caja(){
    if (BOX) return BOX;
    BOX = document.createElement("div"); BOX.id = "nvmc";
    BOX.innerHTML = '<div class="h"><div><b># Movimientos</b><small>El chat entero, en orden</small></div></div><div class="f"></div><div class="l"></div>' +
      '<form><textarea rows="1" placeholder="Escribí… (con / ves los comandos)"></textarea><button type="submit" aria-label="Enviar">➤</button></form>';
    document.body.appendChild(BOX);
    LISTA = BOX.querySelector(".l");
    var f = BOX.querySelector(".f");
    [["todo", "Todo"], ["rev", "Sin revisar"], ["falta", "⚠ Falta cargar"]].forEach(function(x){ var b = document.createElement("button"); b.type = "button"; b.textContent = x[1]; b.dataset.k = x[0]; b.onclick = function(){ FIL = x[0]; pintar(true); }; f.appendChild(b); });
    var fm = BOX.querySelector("form"), ta = fm.querySelector("textarea");
    ta.addEventListener("input", function(){ ta.style.height = "40px"; ta.style.height = Math.min(120, ta.scrollHeight) + "px"; });
    ta.addEventListener("keydown", function(e){ if (e.key === "Enter" && !e.shiftKey && !POP && innerWidth > 900){ e.preventDefault(); fm.requestSubmit ? fm.requestSubmit() : fm.dispatchEvent(new Event("submit", { cancelable: true })); } });
    fm.onsubmit = function(e){
      e.preventDefault(); var t = ta.value.trim(); if (!t) return;
      if (!window.__nvLocal || !window.__nvLocal.chatEnviar){ alert("Todavía está cargando, probá en un segundo"); return; }
      ta.value = ""; ta.style.height = "40px";
      window.__nvLocal.chatEnviar([{ canal: "mov", texto: t, por: SOY || "euge" }]).then(function(){ setTimeout(function(){ pintar(); alFondo(); }, 300); }, function(err){ ta.value = t; alert("No se pudo mandar: " + (err && err.message || err)); });
    };
    return BOX;
  }
  function msgs(){
    var S = window.__nv && window.__nv.S, M = (S && S.chat && S.chat.m) || [];
    var desde = Date.now() - 45 * 864e5;
    return M.filter(function(m){ return m.canal === "mov" && !m.borrado && !m.padre && !(m.reac && m.reac.__p) && Number(m.creado) >= desde; })
      .sort(function(a, b){ return a.creado - b.creado; });
  }
  function cargarRows(){
    if (Date.now() - ULTR < 8000) return; ULTR = Date.now();
    SB().from("movimientos").select("msg_id,estado,tipo,monto,por,texto,cambiado").gte("msg_at", new Date(Date.now() - 46 * 864e5).toISOString()).then(function(r){
      if (r.error) return; var o = {}; (r.data || []).forEach(function(x){ if (x.msg_id) o[x.msg_id] = x; }); ROWS = o; pintar();
    });
  }
  function plata(n){ return "$" + String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function estado(m){ if (/^\s*✅\s*TODO ACTUALIZADO/i.test(m.texto || "")) return ["✅ Revisión cerrada hasta acá", "c-ok", "ok"];
    var r = ROWS[m.id];
    if (/^web-/.test(m.id)){ var w = ((window.__nv && window.__nv.S && window.__nv.S.bzData && window.__nv.S.bzData.min) || []).find(function(x){ return "web-" + x.id === m.id; }); return w && !/REVISAR/i.test(w.env || "") ? ["✓ Venta web revisada", "c-ok", "ok"] : ["● Venta web · para revisar", "c-pen", "rev"]; }
    if (/^\s*\/ojo/i.test(m.texto || "")) return r && (r.estado === "aprobado" || r.estado === "descartado") ? ["✓ Ojo resuelto", "c-ok", "ok"] : ["⚠ Ojo · para corregir", "c-no", "rev"];
    if (!r) return Date.now() - m.creado < 60000 ? ["⏳ Leyendo…", "c-gr", "rev"] : ["⚠ Falta cargar", "c-no", "falta"];
    if (r.estado === "procesando") return ["⏳ Leyendo…", "c-gr", "rev"];
    if (r.estado === "descartado") return ["✖ Descartado", "c-gr", "ok"];
    var t = (r.monto ? " · " + plata(r.monto) : "") + (r.por ? " · " + (NOM[r.por] || r.por) : "");
    return r.estado === "aprobado" ? ["✓ Aprobado" + t, "c-ok", "ok"] : ["● Pendiente" + t, "c-pen", "rev"];
  }
  /* si se edita un mensaje del canal, el movimiento pendiente se vuelve a leer con el texto nuevo */
  window.__nvMovReleer = function(id, texto){
    function aviso(t){ var d = document.createElement("div"); d.className = "nvtoast"; d.textContent = t; d.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#4A3630;color:#fff;padding:10px 16px;border-radius:8px;z-index:10000;font-size:14px;max-width:90vw"; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 5000); }
    return SB().from("movimientos").select("*").eq("msg_id", id).then(function(r){
      var row = r && r.data && r.data[0]; if (!row) return;
      if (row.estado === "descartado") return;
      if (row.estado === "aprobado" || row.cargado){ aviso("Ese movimiento ya estaba aprobado y está en Finanzas: el cambio hay que hacerlo en Finanzas."); return; }
      var L = window.__nvLector, S = window.__nv && window.__nv.S;
      var m = { id: id, texto: texto, por: row.autor, creado: Date.parse(row.msg_at) || Date.now(), adj: row.adj || [] };
      var lee = L && L.leer ? Promise.resolve(L.leer(m, (S && S.presupuestos) || [])) : Promise.resolve({});
      return lee.catch(function(){ return {}; }).then(function(res){
        res = res || {}; var T = ["venta","mayorista","sena","pago","sueldo","envio","otro"], cm = row.cliente || {};
        var up = { texto: texto, falta: res.falta || [], cambiado: new Date().toISOString() };
        if (T.indexOf(res.tipo) >= 0) up.tipo = res.tipo;
        if (/^(ingreso|egreso)$/.test(res.signo)) up.signo = res.signo;
        if (Number(res.monto)) up.monto = Number(res.monto);
        if (res.cat && !cm.catManual) up.cat = res.cat;
        if (/^(euge|pau)$/.test(res.por)) up.por = res.por;
        if (/^(euge|pau)$/.test(res.cuenta)) up.cuenta = res.cuenta;
        if (res.contraparte) up.contraparte = res.contraparte;
        if (res.concepto) up.concepto = res.concepto;
        if (res.medio) up.medio = res.medio;
        if (/^\d{4}-\d{2}-\d{2}$/.test(res.fecha || "")) up.fecha = res.fecha;
        if (res.datos) up.cliente = Object.assign({}, cm, { datos: res.datos });
        return SB().from("movimientos").update(up).eq("id", row.id).then(function(x){ if (x && x.error) aviso("No se pudo actualizar el movimiento: " + x.error.message); else aviso("Movimiento actualizado con el mensaje editado ✓"); });
      });
    });
  };
  function cargarAhora(m, btn){
    btn.disabled = true; btn.textContent = "Leyendo…";
    var L = window.__nvLector, S = window.__nv && window.__nv.S;
    var lee = L && L.leer ? Promise.resolve(L.leer(m, (S && S.presupuestos) || [])) : Promise.resolve({});
    lee.catch(function(){ return {}; }).then(function(res){
      res = res || {}; var T = ["venta","mayorista","sena","pago","sueldo","envio","otro"];
      return SB().from("movimientos").insert({ msg_id: m.id, msg_at: new Date(m.creado).toISOString(), autor: m.por, texto: m.texto || "", adj: m.adj || [], estado: "pendiente",
        tipo: T.indexOf(res.tipo) >= 0 ? res.tipo : "otro", cat: res.cat || null, signo: /^(ingreso|egreso)$/.test(res.signo) ? res.signo : null, monto: Number(res.monto) || null,
        fecha: /^\d{4}-\d{2}-\d{2}$/.test(res.fecha || "") ? res.fecha : new Date(Number(m.creado)).toISOString().slice(0, 10),
        por: /^(euge|pau)$/.test(res.por) ? res.por : null, cuenta: /^(euge|pau)$/.test(res.cuenta) ? res.cuenta : null,
        contraparte: res.contraparte || null, concepto: res.concepto || null, medio: res.medio || null, falta: res.falta || [], ia: { lector: res.leido || null, aMano: true } });
    }).then(function(r){
      if (r && r.error && !/duplicate|23505/i.test(r.error.message + r.error.code)){ btn.disabled = false; btn.textContent = "+ Cargar"; alert("No se pudo: " + r.error.message); return; }
      ULTR = 0; cargarRows(); btn.textContent = "Listo: quedó en Movimientos para revisar";
    });
  }
  function noEs(m, btn){
    btn.disabled = true;
    SB().from("movimientos").insert({ msg_id: m.id, msg_at: new Date(m.creado).toISOString(), autor: m.por, texto: m.texto || "", estado: "descartado" }).then(function(){ ULTR = 0; cargarRows(); });
  }
  function alFondo(){ if (LISTA) LISTA.scrollTop = LISTA.scrollHeight; }
  function pintar(forzar){
    if (!BOX || !document.body.classList.contains("nvmov-on")) return;
    var M = msgs(), clave = FIL + "|" + M.length + "|" + M.map(function(m){ return estado(m)[0]; }).join(",");
    if (clave === CL && !forzar) return; CL = clave;
    [].forEach.call(BOX.querySelectorAll(".f button"), function(b){ b.classList.toggle("on", b.dataset.k === FIL); });
    var abajo = LISTA.scrollHeight - LISTA.scrollTop - LISTA.clientHeight < 60;
    LISTA.innerHTML = ""; var dia = "";
    var V = M.filter(function(m){ var e = estado(m)[2]; return FIL === "todo" || (FIL === "rev" && e === "rev") || (FIL === "falta" && e === "falta"); });
    if (!V.length){ var v = document.createElement("div"); v.className = "dia"; v.textContent = FIL === "todo" ? "Todavía no hay mensajes" : "Nada por acá ✓"; LISTA.appendChild(v); }
    V.forEach(function(m){
      var d = new Date(Number(m.creado)), dk = d.toDateString();
      if (dk !== dia){ dia = dk; var x = document.createElement("div"); x.className = "dia"; x.textContent = dk === new Date().toDateString() ? "Hoy" : d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" }); LISTA.appendChild(x); }
      var e = estado(m), b = document.createElement("div");
      b.className = "m" + (m.por === SOY ? " yo" : "") + (e[2] === "falta" ? " falta" : ""); b.dataset.msg = m.id;
      var w = document.createElement("div"); w.className = "w"; w.innerHTML = "<span></span><i></i>";
      w.firstChild.textContent = NOM[m.por] || m.por || ""; w.lastChild.textContent = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      var tx = document.createElement("div"); tx.textContent = m.texto || ((m.adj || []).length ? "📎 Archivo" : "");
      var ch = document.createElement("span"); ch.className = "chip " + e[1]; ch.textContent = e[0];
      b.appendChild(w); b.appendChild(tx); b.appendChild(ch);
      if (e[2] === "falta"){
        var c = document.createElement("div"); c.className = "cta";
        var b1 = document.createElement("button"); b1.type = "button"; b1.className = "p"; b1.textContent = "+ Cargar"; b1.onclick = function(){ cargarAhora(m, b1); };
        var b2 = document.createElement("button"); b2.type = "button"; b2.textContent = "No es un movimiento"; b2.onclick = function(){ noEs(m, b2); };
        c.appendChild(b1); c.appendChild(b2); b.appendChild(c);
      }
      LISTA.appendChild(b);
    });
    if (abajo || forzar) alFondo();
  }
  var SW = null;
  function pintarSw(){ if (!SW) return; [].forEach.call(SW.children, function(b){ b.classList.toggle("on", b.dataset.m === modo()); }); }
  function acomodar(){
    var on = document.body.classList.contains("nvmov-on"), m = modo(), chico = innerWidth <= 900;
    document.body.classList.toggle("nvmc-on", on && m !== "lista");
    document.body.classList.toggle("nvmc-solo", on && chico && m === "chat");
    if (!on || !BOX) return;
    var sec = document.querySelector("section.nvmovp");
    if (!chico){
      var wrap = sec && sec.parentElement, r = wrap ? wrap.getBoundingClientRect() : { right: innerWidth - 20 };
      var w = Math.min(420, innerWidth * 0.34);
      BOX.style.width = w + "px"; BOX.style.left = "auto"; BOX.style.right = Math.max(12, innerWidth - r.right + 8) + "px";
      BOX.style.top = "84px"; BOX.style.bottom = "80px"; BOX.style.height = "auto";
      if (sec) sec.style.paddingBottom = "";
    } else {
      var nav = document.querySelector("nav.tabs"), bot = nav && nav.getBoundingClientRect().height ? innerHeight - nav.getBoundingClientRect().top : 0;
      var cab = document.querySelector(".nvmov-cab"), top = cab ? Math.max(60, cab.getBoundingClientRect().bottom + 8) : 120;
      BOX.style.width = "auto"; BOX.style.bottom = bot + "px";
      if (m === "chat"){ BOX.style.top = top + "px"; BOX.style.height = "auto"; }
      else { BOX.style.top = "auto"; BOX.style.height = Math.round((innerHeight - bot) * 0.5) + "px"; }
      if (sec) sec.style.paddingBottom = m === "dos" ? Math.round((innerHeight - bot) * 0.5 + 20) + "px" : "";
    }
  }
  function montar(){
    var on = document.body.classList.contains("nvmov-on");
    if (!on){ document.body.classList.remove("nvmc-on", "nvmc-solo"); return; }
    caja();
    var cab = document.querySelector("section.nvmovp .nvmov-cab");
    if (cab && !cab.querySelector(".nvmc-sw")){
      SW = document.createElement("div"); SW.className = "nvmc-sw";
      [["lista", "Lista"], ["chat", "Chat"], ["dos", innerWidth > 900 ? "💬 Chat al lado" : "Las dos"]].forEach(function(x){
        if (innerWidth > 900 && x[0] === "chat") return;
        var b = document.createElement("button"); b.type = "button"; b.dataset.m = x[0]; b.textContent = x[1]; b.onclick = function(){ setModo(x[0]); }; SW.appendChild(b);
      });
      cab.appendChild(SW); pintarSw(); setTimeout(alFondo, 100);
    }
    if (innerWidth > 900 && MODO === "chat") MODO = "dos";
    acomodar(); cargarRows(); pintar();
  }
  setInterval(montar, 700);
  window.addEventListener("resize", function(){ if (SW){ SW.remove(); SW = null; } montar(); });
})();

/* ---------- Movimientos: filas más fáciles de leer + chat enlazado con la lista ---------- */
(function(){
  if (window.__nvMovLink) return; window.__nvMovLink = 1;
  var st = document.createElement("style");
  st.textContent = [
    "section.nvmovp .nvmov-blqh em{white-space:nowrap!important;flex:none!important;display:inline-flex!important;align-items:center;line-height:1.2!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it{border-top:2px solid #EBDDD2!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it:nth-child(odd){background:#FAF4EE!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it:nth-child(even){background:#FFFFFF!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it[data-msg]:not([data-msg='']){cursor:pointer}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it.nvlk{background:#FBE9E0!important;box-shadow:inset 4px 0 0 #B7704F!important}",
    "#nvmc .m[data-msg]{cursor:pointer;transition:box-shadow .2s}",
    "#nvmc .m.nvlk{box-shadow:0 0 0 2px #B7704F;background:#FFF6F1}",
    "#nvmc .m .nvlk-n{display:block;margin-top:5px;font-size:11.5px;color:#9A7B66}",
    "#nvmc .l{scrollbar-width:thin;scrollbar-color:#CDB8A8 transparent}",
    "#nvmc .l::-webkit-scrollbar{width:9px}",
    "#nvmc .l::-webkit-scrollbar-track{background:#F6F0EA;border-radius:9px}",
    "#nvmc .l::-webkit-scrollbar-thumb{background:#CDB8A8;border-radius:9px;border:2px solid #F6F0EA}",
    "#nvmc .l::-webkit-scrollbar-thumb:hover{background:#B39A88}",
    "@media(min-width:901px){",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on{padding-left:84px!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs::before{font-size:0!important;color:transparent!important;margin:0 auto 14px!important;width:60px!important;background-position:center top!important;background-size:auto 36px!important;padding-top:42px!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs{width:84px!important;padding-left:8px!important;padding-right:8px!important;overflow-x:hidden!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .lb,html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .navsec{display:none!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .tab{justify-content:center!important;padding-left:0!important;padding-right:0!important;width:100%!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .tab .ic{margin:0!important;position:relative}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .tab .n{position:absolute!important;top:-7px;right:-11px;margin:0!important;transform:scale(.85)}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .nvyo{width:100%!important;padding:6px 0!important;justify-content:center!important}",
    "html:not(#nv1):not(#nv2) body.nvmov-on.nvmc-on nav.tabs .nvyo > :not(:first-child){display:none!important}",
    "}"
  ].join("\n");
  document.head.appendChild(st);
  function titulos(){ [].forEach.call(document.querySelectorAll("nav.tabs .tab"), function(t){ if (!t.title){ var l = t.querySelector(".lb"); t.title = (l || t).textContent.trim(); } }); }
  titulos(); setTimeout(titulos, 3000);
  var SEL = "";
  function esc(v){ return String(v).replace(/["\\]/g, "\\$&"); }
  function fila(id){ var p = document.querySelector("section.nvmovp"); return p && id ? p.querySelector('.nvmov-it[data-msg="' + esc(id) + '"]') : null; }
  function burbuja(id){ return id ? document.querySelector('#nvmc .m[data-msg="' + esc(id) + '"]') : null; }
  function visible(e){ return e && e.getClientRects().length; }
  function marcar(){
    [].forEach.call(document.querySelectorAll(".nvlk"), function(e){ if (e.dataset.msg !== SEL) e.classList.remove("nvlk"); });
    [].forEach.call(document.querySelectorAll(".nvlk-n"), function(e){ if (!e.parentNode || e.parentNode.dataset.msg !== SEL) e.remove(); });
    if (!SEL) return; var f = fila(SEL), b = burbuja(SEL);
    if (f) f.classList.add("nvlk"); if (b) b.classList.add("nvlk");
  }
  function verBurbuja(b){
    var l = document.querySelector("#nvmc .l"); if (!l || !b) return;
    var lr = l.getBoundingClientRect(), br = b.getBoundingClientRect();
    l.scrollTo({ top: l.scrollTop + (br.top - lr.top) - (l.clientHeight - br.height) / 2, behavior: "smooth" });
  }
  function nota(b, txt){ var n = b.querySelector(".nvlk-n"); if (!n){ n = document.createElement("span"); n.className = "nvlk-n"; b.appendChild(n); } n.textContent = txt; }
  document.addEventListener("click", function(ev){
    if (!document.body.classList.contains("nvmov-on")) return;
    var t = ev.target; if (t.closest("button,input,select,textarea,a,label,.nvmov-prods")) return;
    var b = t.closest("#nvmc .m[data-msg]");
    if (b){
      var id = b.dataset.msg; if (SEL === id){ SEL = ""; marcar(); return; } SEL = id; marcar();
      var f = fila(id);
      if (!f){ var cer = document.querySelectorAll("section.nvmovp .nvmov-blq.cerr .nvmov-blqh"); if (cer.length && !b.dataset.nvab){ b.dataset.nvab = "1"; [].forEach.call(cer, function(x){ x.click(); }); setTimeout(function(){ delete b.dataset.nvab; SEL = ""; b.click(); }, 250); return; } nota(b, "Esta ya está revisada: no queda nada pendiente en la lista."); return; }
      var blq = f.closest(".nvmov-blq");
      if (blq && blq.classList.contains("cerr")){ var hd = blq.querySelector(".nvmov-blqh"); if (hd) hd.click(); setTimeout(function(){ var g = fila(id); marcar(); if (visible(g)) g.scrollIntoView({ behavior: "smooth", block: "center" }); }, 120); return; }
      if (visible(f)) f.scrollIntoView({ behavior: "smooth", block: "center" });
      else nota(b, "Está en la lista · tocá «Lista» o «Las dos» para verlo.");
      return;
    }
    var r = t.closest("section.nvmovp .nvmov-it[data-msg]");
    if (r && r.dataset.msg){
      var id2 = r.dataset.msg; if (SEL === id2){ SEL = ""; marcar(); return; } SEL = id2; marcar();
      var bb = burbuja(id2); if (bb && visible(bb)) verBurbuja(bb);
    }
  }, true);
  var tm = 0;
  new MutationObserver(function(){ if (!SEL) return; clearTimeout(tm); tm = setTimeout(marcar, 60); }).observe(document.body, { childList: true, subtree: true });
})();

/* ---------- Movimientos: cada lista se desliza sola, sin "Nueva tarea", logo Tienda Nube en el chat de al lado y botón "Todo actualizado" ---------- */
(function(){
  if (window.__nvMovUx3) return; window.__nvMovUx3 = 1;
  var TN = "https://www.google.com/s2/favicons?domain=tiendanube.com&sz=128";
  var FIN = /^\s*✅\s*TODO ACTUALIZADO/i;
  var st = document.createElement("style");
  st.textContent = [
    "html body.nvmov-on .fab{display:none!important}",
    "@media(min-width:901px){html body.nvmov-on.nvmc-on #nvmc{bottom:16px!important}}",
    "@media(min-width:901px){",
    "  section.nvmovp .nvmov-blq:first-of-type .nvmov-vt .nvmov-tb{max-height:calc(100vh - 290px)!important;overflow:auto!important;overscroll-behavior:contain}",
    "  section.nvmovp .nvmov-blq:first-of-type .nvmov-vt .nvmov-tb > .nvmov-th{position:sticky!important;top:0;z-index:5;background:#FBF7F4!important}",
    "  section.nvmovp .nvmov-blq:not(:first-of-type) .nvmov-blqb{max-height:calc(100vh - 230px)!important;overflow-y:auto!important;overscroll-behavior:contain}",
    "}",
    "section.nvmovp .nvmov-tb,section.nvmovp .nvmov-blqb{scrollbar-width:auto;scrollbar-color:#C9B3A3 #F3ECE5}",
    "section.nvmovp .nvmov-tb::-webkit-scrollbar,section.nvmovp .nvmov-blqb::-webkit-scrollbar{width:12px;height:12px}",
    "section.nvmovp .nvmov-tb::-webkit-scrollbar-track,section.nvmovp .nvmov-blqb::-webkit-scrollbar-track{background:#F3ECE5;border-radius:12px}",
    "section.nvmovp .nvmov-tb::-webkit-scrollbar-thumb,section.nvmovp .nvmov-blqb::-webkit-scrollbar-thumb{background:#C9B3A3;border-radius:12px;border:3px solid #F3ECE5}",
    "section.nvmovp .nvmov-tb::-webkit-scrollbar-thumb:hover,section.nvmovp .nvmov-blqb::-webkit-scrollbar-thumb:hover{background:#A88C78}",
    "#nvmc .nvtn-av{display:inline-block;width:16px;height:16px;border-radius:50%;vertical-align:-3px;margin-right:6px;background:#fff url(" + TN + ") center/80% no-repeat;box-shadow:0 0 0 1px #DCE6F3}",
    "#nvmc .m .w span.nvtn{color:#2E5C9E}",
    ".chmsg.nvfin,#nvmc .m.nvfin{background:#E7F1E3!important;border:1px solid #BCD6B4!important;border-radius:14px!important;align-self:stretch!important;max-width:none!important}",
    ".chmsg.nvfin .chx,#nvmc .m.nvfin > div:nth-child(2){font-weight:600!important;color:#2F5A2A!important}",
    ".chmsg.nvfin .nvmovchip,#nvmc .m.nvfin .chip,#nvmc .m.nvfin .cta{display:none!important}",
    ".nvfin-btn{border:1px solid #BCD6B4;background:#E7F1E3;color:#2F5A2A;border-radius:999px;padding:7px 14px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer}",
    ".nvfin-btn:hover{background:#D9EAD3}",
    "html body section.nvmovp .nvmov-blq,html body section.nvmovp .nvmov-blqb,html body section.nvmovp .nvmov-dia,html body section.nvmovp .nvmov-tb,html body section.nvmovp .nvmov-vt,html body section.nvmovp .nvmov-it,html body section.nvmovp .nvmov-tr{border-radius:0!important}",
    "html body section.nvmovp .nvmov-tb{border:1px solid #D8C3B3!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-th{border-bottom:2px solid #C9AE9B!important}",
    "html body section.nvmovp .nvmov-tb > .nvmov-it{border-top:2px solid #D8C3B3!important}",
    "html body section.nvmovp .nvmov-tr > *{border-right:1px solid #EADCD0!important}",
    "html body section.nvmovp .nvmov-tr > *:last-child{border-right:0!important}"
  ].join("\n");
  document.head.appendChild(st);

  function quien(){
    var b = [].find.call(document.querySelectorAll("button"), function(x){ return /^\s*Sos\s/.test(x.textContent || ""); });
    var n = b ? b.textContent.replace(/^\s*Sos\s*/, "").trim() : "";
    return n || "Euge";
  }
  function terminar(btn){
    var n = quien(), d = new Date();
    var cuando = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    if (!confirm("¿Mandar al chat de movimientos “✅ TODO ACTUALIZADO”?\nAsí queda marcado que revisaste todo hasta acá.")) return;
    if (!window.__nvLocal || !window.__nvLocal.chatEnviar){ alert("Todavía está cargando, probá en un segundo"); return; }
    btn.disabled = true;
    window.__nvLocal.chatEnviar([{ canal: "mov", texto: "✅ TODO ACTUALIZADO — revisado hasta acá por " + n + " · " + cuando, por: n.toLowerCase() }])
      .then(function(){ btn.disabled = false; btn.textContent = "✅ Listo, quedó marcado"; setTimeout(function(){ btn.textContent = "✅ Todo actualizado"; }, 4000); },
            function(e){ btn.disabled = false; alert("No se pudo mandar: " + (e && e.message || e)); });
  }
  var POS = {};
  function clave(e){
    var blq = e.closest("section.nvmovp .nvmov-blq"); if (!blq) return null;
    var i = [].indexOf.call(blq.parentNode.querySelectorAll(".nvmov-blq"), blq);
    return i + (e.classList.contains("nvmov-blqb") ? "b" : "t");
  }
  document.addEventListener("scroll", function(ev){
    var e = ev.target; if (!e || !e.classList || !(e.classList.contains("nvmov-tb") || e.classList.contains("nvmov-blqb"))) return;
    var k = clave(e); if (k && (e.classList.contains("nvmov-blqb") || e.closest(".nvmov-vt"))) POS[k] = [e.scrollTop, e.scrollLeft];
  }, true);
  function restaurar(){
    [].forEach.call(document.querySelectorAll("section.nvmovp .nvmov-blqb, section.nvmovp .nvmov-vt .nvmov-tb"), function(e){
      if (e.dataset.nvpos) return; e.dataset.nvpos = "1";
      var k = clave(e), p = k && POS[k]; if (p){ e.scrollTop = p[0]; e.scrollLeft = p[1]; }
    });
  }
  function marcar(){
    var cab = document.querySelector("section.nvmovp .nvmov-cab");
    if (cab && !cab.querySelector(".nvfin-btn")){
      var b = document.createElement("button"); b.type = "button"; b.className = "nvfin-btn"; b.textContent = "✅ Todo actualizado";
      b.title = "Manda un mensaje al chat de movimientos marcando que revisaste todo hasta acá";
      b.onclick = function(){ terminar(b); };
      var sw = cab.querySelector(".nvmc-sw"); if (sw) cab.insertBefore(b, sw); else cab.appendChild(b);
    }
    [].forEach.call(document.querySelectorAll(".chmsg:not(.nvfin) .chx"), function(x){ if (FIN.test(x.textContent || "")) x.closest(".chmsg").classList.add("nvfin"); });
    [].forEach.call(document.querySelectorAll("#nvmc .m:not(.nvfin)"), function(m){ var t = m.children[1]; if (t && FIN.test(t.textContent || "")) m.classList.add("nvfin"); });
    [].forEach.call(document.querySelectorAll("#nvmc .m .w span:not(.nvtn)"), function(s){
      if (/^(🛒\s*)?(venta web|web|tienda nube)$/i.test((s.textContent || "").trim())){ s.classList.add("nvtn"); s.innerHTML = '<i class="nvtn-av"></i>Tienda Nube'; }
    });
    restaurar();
  }
  var t = 0;
  new MutationObserver(function(){ clearTimeout(t); t = setTimeout(marcar, 40); }).observe(document.body, { childList: true, subtree: true });
  setTimeout(marcar, 600);
})();

/* ---------- Chat de movimientos: tilde grande cuando el movimiento o la venta ya está aprobado ---------- */
(function(){
  if (window.__nvCheckOk) return; window.__nvCheckOk = 1;
  var st = document.createElement("style");
  st.textContent = "#nvmc .m{position:relative}" +
    "#nvmc .m:has(.chip.c-ok):not(.nvfin){background:#F2F8EF!important;border-color:#CFE3C8!important}" +
    "#nvmc .m:has(.chip.c-ok):not(.nvfin)::after{content:\"✓\";position:absolute;right:-8px;top:-8px;width:24px;height:24px;border-radius:50%;background:#4E8A45;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.15)}" +
    ".chmsg:has(.nvmovchip.ok):not(.nvfin){position:relative}" +
    ".chmsg:has(.nvmovchip.ok):not(.nvfin) .chx::before{content:\"✓ \";color:#4E8A45;font-weight:800}" +
    ".nvmovchip.ok{background:#E3EEDF!important;color:#3E6B3A!important;font-weight:600}" +
    "html:not(#nv):not(#a) .chw .chlist .chmsg:has(.nvmovchip.ok):not(.nvfin)::after,html:not(#nv):not(#a) .chmsg:has(.nvmovchip.ok):not(.nvfin)::after{content:\"\u2713\"!important;display:flex!important;left:auto!important;right:-8px!important;top:-8px!important;bottom:auto!important;width:24px!important;height:24px!important}";
  document.head.appendChild(st);
})();
