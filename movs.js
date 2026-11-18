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
  var ROWS = [], SOY = null, LISTO = false, ENCURSO = {}, FILTRO = "pend", RECIEN = {}, COLAP = (function(){ try { return JSON.parse(localStorage.getItem("nvmov-colap")) || {}; } catch(e){ return {}; } })();
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
            contraparte: res.contraparte || null, concepto: null, medio: res.medio || null, presupuesto: res.presupuesto || null,
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
    var S = window.__nv && window.__nv.S; if (!S || !S.chat || S.chat.canal !== CANAL) return;
    document.querySelectorAll(".chw .chmsg[data-id]").forEach(function(el){
      var r = ROWS.find(function(x){ return x.msg_id === el.dataset.id; }); if (!r) return;
      var e = etiqueta(r), b = el.querySelector(".nvmovchip");
      if (!b){ b = h("button", "nvmovchip"); b.type = "button"; b.onclick = function(ev){ ev.stopPropagation(); abrir(); }; (el.querySelector(".chx") || el).after(b); }
      if (b.dataset.t !== e[0]){ b.dataset.t = e[0]; b.textContent = e[0]; b.className = "nvmovchip " + e[1]; }
    });
  }

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
    ca.onchange = function(){ guardar(r, { cat: ca.value || null }); };
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
    f.append(ckw, co, fe, ca, to, cu, no, qu, ad, x);
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
      sub.append(bo);
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
  function crearPlata(v){
    var q = quienDeCobro(v.cobro), monto = Number(String(v.cobrado || v.facturar || "").replace(",", ".")) || null;
    return SB.from("movimientos").insert({ msg_id: "venta:" + v.id, msg_at: new Date().toISOString(), autor: SOY, texto: "Venta " + (v.num || "") + " · " + (v.cliente || ""), adj: [],
      tipo: "venta", signo: "ingreso", monto: monto, fecha: v.fecha || null, por: q, cuenta: q, contraparte: "Venta #" + (v.num || "") + " · " + (v.cliente || ""),
      concepto: null, cat: catVenta(v.metodo, v.fact), falta: [], estado: "pendiente" }).select().then(function(r){
      if (r.error && !/duplicate|23505/i.test(r.error.message + r.error.code)) throw r.error; if (r.data && r.data[0]) upsertLocal(r.data[0]);
    });
  }
  function aprobarVenta(it){
    var v = it.row;
    if (!v.cliente){ toast("Falta el cliente."); return Promise.reject(); }
    if (!quienDeCobro(v.cobro)){ toast("Elegí quién cobró (Euge o Pau)."); return Promise.reject(); }
    if (!Number(v.cobrado || v.facturar)){ toast("Falta el total."); return Promise.reject(); }
    var paso, conFin = FIN[it.id] !== false;
    if (it.src === "web"){
      paso = new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).baseGuardarVarios("base_min", [{ id: v.id, env: "PARA HACER", cambiado: Date.now(), por: SOY }]); })
        .then(function(){ v.env = "PARA HACER"; return conFin ? crearPlata(v) : null; });
    } else {
      var id = "min" + Date.now(), num = v.num || proxNumWhats();
      var fila = { id: id, num: num, venta: num, env: "PARA HACER", prods: v.prods || "[]", cant: v.cant || "", obs: v.obs || "", fecha: v.fecha || diaDe(Date.now()), cliente: v.cliente, datos: v.datos || "",
        etq: "[]", suc: v.suc || "", cobrado: v.cobrado || "", facturar: v.facturar || v.cobrado || "", costoEnv: "0", pago: "Finalizado", metodo: v.metodo || "[]", menv: v.menv || "", tipo: v.tipo || "",
        cobro: v.cobro || "[]", fact: v.fact || "", web: "", creado: Date.now(), cambiado: Date.now(), por: SOY };
      paso = new Promise(function(ok, mal){ google.script.run.withSuccessHandler(ok).withFailureHandler(mal).baseGuardarVarios("base_min", [fila]); })
        .then(function(){ baseMin().push(fila); return guardar(it.mov, { estado: "aprobado", aprobado_por: SOY, aprobado_at: new Date().toISOString(), cargado: "base_min:" + id }); })
        .then(function(){ return conFin ? crearPlata(Object.assign({}, fila)) : null; });
    }
    return paso.then(function(){ toast(conFin ? "Venta aprobada: pasó a Ventas minoristas. El cobro quedó abajo para aprobarlo en Finanzas." : "Venta aprobada: pasó a Ventas minoristas (sin Finanzas)."); pintar(); });
  }
  function pintarVentas(p, lista){
    if (!lista.length){ var v = h("div", "nvmov-vacio"); v.append(h("b", null, "No hay ventas para revisar 🎉"), h("small", null, "Las de Tienda Nube aparecen solas. Las de WhatsApp o Instagram mandalas a #movimientos, por ejemplo: “Venta Juana Pérez $85.000 transferencia por Pau”.")); p.append(v); return; }
    var tb = h("div", "nvmov-dia nvmov-vt"); var t = h("div", "nvmov-tb");
    var th = h("div", "nvmov-tr nvmov-vr nvmov-th"); VCOLS.forEach(function(x){ th.append(h("span", null, x)); }); t.append(th);
    lista.forEach(function(it){ t.append(filaVenta(it)); });
    tb.append(t); p.append(tb);
  }
  function inp(val, ph, cls, on){ var e = h("input", "nvmov-in " + (cls || "")); e.value = val == null ? "" : val; e.placeholder = ph || ""; e.onchange = function(){ on(e.value.trim()); }; return e; }
  var FIN = {};
  /* ===== Ventas: mismas columnas que el tablero de Ventas minoristas ===== */
  var PAGOS = ["Finalizado", "Pendiente", "PARCIAL", "FALTA ENVIO"];
  var MENVS = ["Vía Cargo", "Andreani", "Acordar envío", "Retira depósito cliente", "Retira depósito transporte", "BUSPACK"];
  var TIPOS = ["Domicilio", "Sucursal"];
  function sel(val, ops, ph, on){
    var e = h("select", "nvmov-in cat"); var o0 = h("option", null, ph || "—"); o0.value = ""; e.append(o0);
    ops.concat(val && ops.indexOf(val) < 0 ? [val] : []).forEach(function(m){ var o = h("option", null, m); o.value = m; e.append(o); });
    e.value = val || ""; e.dataset.g = val ? "1" : ""; e.onchange = function(){ e.dataset.g = e.value ? "1" : ""; on(e.value); }; return e;
  }
  function plata(n){ return n && Number(n) ? Math.round(Number(n)).toLocaleString("es-AR") : ""; }
  function caja(val, ph, on){ var t = h("textarea", "nvmov-in nvmov-ta"); t.value = val || ""; t.placeholder = ph || ""; t.rows = 2; t.title = val || ""; t.onchange = function(){ t.title = t.value; on(t.value); }; return t; }
  /* productos y cantidades: dos columnas alineadas, una línea por producto (como en la tabla de ventas) */
  function partirCant(l){ var m = /^\s*\[(.?)\]\s*/.exec(l || ""); return m ? { ck: m[1], tx: String(l).slice(m[0].length) } : { ck: " ", tx: String(l || "") }; }
  function prodsYCants(it, alCambiar){
    var v = it.row, cp = h("div", "nvmov-prods"), cc = h("div", "nvmov-prods");
    var ps = arr(v.prods).slice(), cs = String(v.cant || "").split("\n");
    while (cs.length < ps.length) cs.push("[ ] 1");
    function guardar2(){ guardarVenta(it, { prods: JSON.stringify(ps), cant: cs.slice(0, ps.length).join("\n") }); if (alCambiar) alCambiar(); }
    function pintarL(){
      cp.innerHTML = ""; cc.innerHTML = "";
      ps.forEach(function(p, i){
        var r = h("div", "nvmov-pl");
        var pi = h("input", "nvmov-in nvmov-pn"); pi.value = p || ""; pi.placeholder = "Producto"; pi.title = p || "";
        pi.onchange = function(){ ps[i] = pi.value.trim(); pi.title = ps[i]; if (!ps[i]){ ps.splice(i, 1); cs.splice(i, 1); pintarL(); } guardar2(); };
        var del = h("button", "nvmov-pdel", "✕"); del.type = "button"; del.title = "Sacar este producto";
        del.onclick = function(){ ps.splice(i, 1); cs.splice(i, 1); guardar2(); pintarL(); };
        r.append(pi, del); cp.append(r);
        var pc = partirCant(cs[i]);
        var ci = h("input", "nvmov-in nvmov-pn"); ci.value = pc.tx; ci.placeholder = "1"; ci.title = "Cantidad / detalle";
        ci.onchange = function(){ cs[i] = "[" + (pc.ck || " ") + "] " + ci.value.trim(); guardar2(); };
        var rc = h("div", "nvmov-pl nvmov-plc"); rc.append(ci); cc.append(rc);
      });
      var mas = h("button", "nvmov-pmas", "+ producto"); mas.type = "button";
      mas.onclick = function(){ ps.push(""); cs.splice(ps.length - 1, 0, "[ ] 1"); pintarL(); var u = cp.querySelectorAll(".nvmov-pn"); if (u.length) u[u.length - 1].focus(); };
      cp.append(mas);
    }
    pintarL(); return [cp, cc];
  }
  /* cómo queda en Finanzas */
  function datosFin(it){
    var v = it.row, q = quienDeCobro(v.cobro), cat = catVenta(v.metodo, v.fact), mon = Number(v.cobrado || v.facturar) || 0;
    return { q: q, quien: q === "pau" ? "Pau" : q === "euge" ? "Euge" : "", cols: [["Concepto", ("Venta #" + (v.num || "") + " · " + (v.cliente || "")).toUpperCase()], ["Fecha", v.fecha ? v.fecha.split("-").reverse().join("/") : "—"], ["Categoría", cat], ["Total", mon ? "$ " + Math.round(mon).toLocaleString("es-AR") : "—"], ["Cuenta", GRUPOS_FIN[cat.split(".")[0]] || ""], ["Notas", "Creado desde Movimientos (venta aprobada)"]] };
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
    var co = inp(plata(v.cobrado), "$ cobrado", "tot in", function(x){ guardarVenta(it, { cobrado: String(numAR(x) || "") }); refrescar(); });
    var to = inp(plata(v.facturar), "$ a facturar", "tot", function(x){ guardarVenta(it, { facturar: String(numAR(x) || "") }); refrescar(); });
    var ce = inp(plata(v.costoEnv), "$ envío", "tot", function(x){ guardarVenta(it, { costoEnv: String(numAR(x) || "0") }); });
    var pa = sel(v.pago, PAGOS, "Pago", function(x){ guardarVenta(it, { pago: x }); refrescar(); });
    var me = sel(arr(v.metodo)[0] || "", METODOS, "❓ Medio", function(x){ guardarVenta(it, { metodo: JSON.stringify(x ? [x] : []) }); refrescar(); });
    var mn = sel(v.menv, MENVS, "Método de envío", function(x){ guardarVenta(it, { menv: x }); refrescar(); });
    var ti = sel(v.tipo, TIPOS, "Domicilio / Sucursal", function(x){ guardarVenta(it, { tipo: x }); refrescar(); });
    var qu = h("select", "nvmov-in quien" + (quienDeCobro(v.cobro) ? "" : " falta")); [["","❓"],["euge","Euge"],["pau","Pau"]].forEach(function(o){ var e = h("option", null, o[1]); e.value = o[0]; qu.append(e); });
    qu.value = quienDeCobro(v.cobro) || ""; qu.onchange = function(){ guardarVenta(it, { cobro: JSON.stringify(cobroDeQuien(qu.value)) }); qu.classList.toggle("falta", !qu.value); refrescar(); };
    var ab = h("button", "nvmov-mas", "Abrir"); ab.type = "button";
    var x = h("button", "nvmov-x", "✕"); x.type = "button"; x.title = it.src === "web" ? "No se puede descartar una venta de la tienda (se revisa y aprueba)" : "Descartar";
    if (it.src === "web") x.disabled = true; else x.onclick = function(){ guardar(it.mov, { estado: "descartado" }); };
    f.append(ckw, nu, pc[0], pc[1], fe, cl, dp, ob, su, et, co, to, ce, pa, me, mn, ti, qu, ab, x); w.append(f);
    /* debajo: a Finanzas sí/no + cómo queda + aprobar */
    var sub = h("div", "nvmov-sub");
    var fw = h("label", "nvmov-fin"); var fc = h("input"); fc.type = "checkbox"; fc.checked = FIN[it.id] !== false; var ft = h("span");
    fw.title = "Si está tildado, al aprobar también se crea el cobro para Finanzas (queda abajo para aprobarlo)."; fw.append(fc, ft);
    var lf = h("div", "nvmov-lfin"); var fa = h("span", "nvmov-al nvmov-falt");
    var bv = h("button", "nvmov-ok", "✓ Aprobar"); bv.type = "button"; bv.onclick = function(){ ck.checked = true; ck.dispatchEvent(new Event("change")); };
    sub.append(fa, fw, lf);
    if (it.src === "chat") sub.append(h("span", "nvmov-tx", "“" + (it.mov.texto || "") + "”"));
    if (v.cobrado && v.facturar && Number(v.cobrado) && Math.abs(Number(v.cobrado) - Number(v.facturar)) > 1) sub.append(h("span", "nvmov-al", "Cobrado distinto de lo a facturar"));
    sub.append(bv); w.append(sub);
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
      bv.disabled = !!fl.length; bv.classList.toggle("off", !!fl.length);
      ft.textContent = si ? "💰 También a Finanzas " + (d.quien || "(elegí quién cobró)") : "Solo a Ventas minoristas";
      fw.classList.toggle("off", !si);
      lf.innerHTML = ""; lf.hidden = !si;
      if (si){ lf.append(h("em", null, "Entra en Finanzas " + (d.quien || "—") + " así:")); d.cols.slice(0, 5).forEach(function(c){ var e = h("span"); e.append(h("small", null, c[0]), h("b", null, c[1])); lf.append(e); }); }
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
  function leer(k){ try { return JSON.parse(localStorage.getItem("nvcols_" + k) || "null"); } catch(e){ return null; } }
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
