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
      return m.canal === CANAL && !m.borrado && !m.padre && !(m.reac && m.reac.__p) && m.creado >= DESDE && ahora - m.creado > 6000 && !ENCURSO[m.id];
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
    Object.keys(dias).sort().reverse().forEach(function(k){
      var rs = dias[k], np = rs.filter(function(r){ return r.estado !== "aprobado"; }).length;
      var ing = 0, egr = 0; rs.forEach(function(r){ var s = signoDe(r); if (s === "+") ing += Number(r.monto) || 0; else if (s === "-") egr += Number(r.monto) || 0; });
      var g = h("div", "nvmov-dia");
      var gh = h("div", "nvmov-diah");
      gh.append(h("b", null, diaLargo(k)), h("span", "nvmov-cnt", np ? np + (np === 1 ? " pendiente" : " pendientes") : "todo aprobado"),
        h("span", "nvmov-tot", (ing ? "+" + plata(ing) : "") + (ing && egr ? "  ·  " : "") + (egr ? "−" + plata(egr) : "")));
      g.append(gh);
      var tb = h("div", "nvmov-tb"); tb.append(cabecera());
      rs.forEach(function(r){ tb.append(fila(r)); });
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
      total: total, cuenta: GRUPOS_FIN[String(r.cat).split(".")[0]] || "", notas: (r.concepto ? r.concepto + " · " : "") + (esV ? "Creado desde Movimientos (venta aprobada)" : "desde #movimientos") };
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
    var cu = h("span", "nvmov-cuenta", r.cat ? (GRUPOS_FIN[String(r.cat).split(".")[0]] || "") : "—");
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
    if (r.cargado) [co, fe, ca, to, no, qu].forEach(function(e){ e.disabled = true; });
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
  function ventasWeb(){ return baseMin().filter(function(r){ return /REVISAR/i.test(r.env || ""); }); }
  function ventasTodas(){
    var w = ventasWeb().map(function(r){ return { src: "web", id: "w" + r.id, row: r }; });
    var ch = ROWS.filter(function(r){ return esBorradorVenta(r) && (r.estado === "pendiente" || r.estado === "procesando"); }).map(function(m){
      var v = (m.cliente && m.cliente.venta) || null;
      if (!v){ v = { num: "", fecha: m.fecha || diaDe(m.msg_at || m.creado), cliente: m.contraparte || "", datos: (m.cliente && m.cliente.datos) || "", prods: "[]", cant: "", obs: "",
        facturar: m.monto || "", cobrado: m.monto || "", metodo: JSON.stringify(m.medio ? [/transf/i.test(m.medio) ? "Transferencia / Depósito" : /efect/i.test(m.medio) ? "Efectivo" : /mercado/i.test(m.medio) ? "MERCADO PAGO" : m.medio] : []),
        cobro: JSON.stringify(cobroDeQuien(m.por)), menv: "", tipo: "", suc: "", fact: "" }; }
      return { src: "chat", id: "c" + m.id, row: v, mov: m };
    });
    return w.concat(ch).sort(function(a, b){ return String(b.row.fecha || "").localeCompare(String(a.row.fecha || "")); });
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
      if (r.error && !/duplicate|23505/i.test(r.error.message + r.error.code)) throw r.error; if (r.data && r.data[0]) upsertLocal(r.data[0]);
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
      paso = new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).baseGuardarVarios("base_min", [{ id: v.id, env: dest, cambiado: Date.now(), por: SOY }]); })
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
    return paso.then(function(){ toast(conFin ? "Venta aprobada: pasó a Ventas minoristas · " + dest + ". El cobro quedó abajo para aprobarlo en Finanzas." : "Venta aprobada: pasó a Ventas minoristas · " + dest + " (sin Finanzas)."); pintar(); });
  }
  function pintarVentas(p, lista){
    if (!lista.length){ var v = h("div", "nvmov-vacio"); v.append(h("b", null, "No hay ventas para revisar 🎉"), h("small", null, "Las de Tienda Nube aparecen solas. Las de WhatsApp o Instagram mandalas a #movimientos, por ejemplo: “Venta Juana Pérez $85.000 transferencia por Pau”.")); p.append(v); return; }
    var tb = h("div", "nvmov-dia nvmov-vt"); var t = h("div", "nvmov-tb");
    var th = h("div", "nvmov-tr nvmov-vr nvmov-th"); VCOLS.forEach(function(x){ th.append(h("span", null, x)); }); t.append(th);
    lista.forEach(function(it){ t.append(filaVenta(it)); });
    tb.append(t); p.append(tb);
  }
  function inp(val, ph, cls, on){ var e = h("input", "nvmov-in " + (cls || "")); e.value = val == null ? "" : val; e.placeholder = ph || ""; e.onchange = function(){ on(e.value.trim()); }; return e; }
  var FIN = {}, DEST = {};
  /* ===== Ventas: mismas columnas que el tablero de Ventas minoristas ===== */
  var PAGOS = ["Finalizado", "Pendiente", "PARCIAL", "FALTA ENVIO"];
  var MENVS = ["Vía Cargo", "Andreani", "Acordar envío", "Retira depósito cliente", "Retira depósito transporte", "BUSPACK"];
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
  function filaVenta(it){
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
    var et = inp(arr(v.etq).join(", "), "Etiqueta", "", function(x){ guardarVenta(it, { etq: JSON.stringify(x.split(/\s*,\s*/).filter(Boolean)) }); });
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
    fw.title = "Si está tildado, al aprobar también se crea el cobro para Finanzas (queda abajo para aprobarlo)."; fw.append(fc, ft);
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
      vf.append(g, h("p", null, "Al aprobar la venta, este cobro queda abajo en “Movimientos de plata”; cuando lo aprobás, entra en Finanzas."));
    };
    fc.onchange = function(){ FIN[it.id] = fc.checked; refrescar(); };
    refrescar();
    ab.onclick = function(){ det.hidden = !det.hidden; ab.classList.toggle("on", !det.hidden); ab.textContent = det.hidden ? "Abrir" : "Cerrar"; };
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
  var DEF = { mov: true, ventas: true, buendia: true, chat: true, canales: {}, tareas: true, tareasHora: "09:00", vencidas: true, pagos: true, pagosDias: 2, silencio: false, silDesde: "22:00", silHasta: "08:00" };
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
    var msgs = Array.prototype.map.call(w.querySelectorAll(".chmsg[data-id]"), function(m){ return m.getAttribute("data-id"); });
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
  function avisarChat(form){
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
