/* #movimientos: cada mensaje del canal pasa por la IA y queda "pendiente de aprobación" en la solapa Movimientos */
(function(){
  if (window.__nvMov) return; window.__nvMov = 1;
  var SB = window.__sb; if (!SB) return;
  var CANAL = "mov", DESDE = Date.parse("2026-11-18T00:00:00-03:00");
  var TIPOS = [["venta","Venta minorista","+"],["mayorista","Venta mayorista","+"],["sena","Seña","+"],["pago","Pago","-"],["sueldo","Sueldo","-"],["envio","Envío","-"],["otro","Otro",""]];
  var QUIEN = { "eugeabdon@gmail.com": "euge", "mpauabdon@gmail.com": "pau", "nervodesigncordoba@gmail.com": "nervo" };
  var NOM = { euge: "Euge", pau: "Pau", nervo: "Nervo" };
  var CATS = ["1.1 VENTA MIN. EFTVO", "1.2 VENTA MIN. TARJETA FACTURADA", "1.3 VENTA MIN. TARJETA NO FACTURADA", "1.4 VENTA MIN. TRANSFERENCIA FACTURADA", "1.5 VENTA MIN. TRANSFERENCIA NO FACTURADA", "1.6 VENTA MAY. NO FACTURADA", "1.7 VENTA MAY. FACTURADA", "1.8 DEVOLUCIÓN RECIBIDA", "2.1 SUELDO - SUELDO PAU", "2.2 SUELDO - SUELDO EUGE", "2.3 MO - HERRERO GABRIEL", "2.4 MO - TEJEDORA LAURA", "2.5 MO - EMP DEPÓSITO DAMIÁN", "2.6 MO - TEJEDORA RAQUEL", "2.7 MO - TEJEDORA IRIS", "2.8 PEDRO CARPINTERO", "3.1 COMPRA PRODUCTOS - REVENTA", "3.2 INSUMO - HIERRO", "3.3 INSUMO - HILOS Y TEJIDOS", "3.4 INSUMO - KITS ELÉCTRICOS", "3.5 INSUMO- ADHESIVOS Y TERMINACIONES", "3.6 INSUMO - FERRETERÍA Y OTROS", "4.1 LOGISTICA - ET. DE TRANSP. PAG. X NERVO", "4.2 LOGISTICA - ET. DE TRANSP. PAG. X CLIENTE", "4.3 EMBALAJE - MATERIALES", "4.4 EMBALAJE- PACKAGING DE MARCA", "4.5 GASTOS DE ENVIOS PROVEEDORES", "5.1 FIJO - CONTADOR", "5.2 FIJO- MONOTRIBUTO E IMPUESTOS", "5.3 FIJO - ALQUILER DEPÓSITO", "5.4 FIJO - PLATAFORMAS DIGITALES", "5.5 FIJO - SERVICIOS DEPOSITO", "6.1 MKT - PUBLICIDAD DIGITAL", "6.2 MANTENIMIENTO - DEPÓSITO Y EQUIPOS", "6.3 OPERATIVO - COMIDAS Y VIÁTICOS", "6.4 OPERATIVO - REGALOS Y EVENTOS", "6.5 OPERATIVO -  LIMPIEZA Y DEPÓSITO", "6.6 DEVOLUCION AL CLIENTE", "7.4 FINANCIERO - SALDO INICIAL"];
  var GRUPOS_FIN = { "1": "1.0 INGRESOS", "2": "2.0 MANO DE OBRA", "3": "3.0 PRODUCCIÓN E INSUMOS", "4": "4.0 LOGÍSTICA Y ENVÍOS", "5": "5.0 GASTOS FIJOS", "6": "6.0 GASTOS VARIABLES OPERATIVOS", "7": "7.0 MOVIMIENTOS FINANCIEROS" };
  function catLimpia(c){ c = String(c || "").trim(); if (!c) return null; var k = c.split(" ")[0]; return CATS.find(function(x){ return x === c; }) || CATS.find(function(x){ return x.split(" ")[0] === k; }) || null; }
  function catCorta(c){ return String(c || "").replace(/^\d+\.\d+\s*/, ""); }
  var ROWS = [], SOY = null, LISTO = false, ENCURSO = {}, FILTRO = "pend", RECIEN = {};
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
        return ia(m).then(function(res){
          res = res || {};
          var por = /^(euge|pau)$/.test(res.por) ? res.por : (/^(euge|pau)$/.test(res.cuenta) ? res.cuenta : null);
          var falta = Array.isArray(res.falta) ? res.falta.slice(0, 6) : [];
          return guardar(x, { tipo: tipoDe(res.tipo)[0], cat: catLimpia(res.cat), signo: /^(ingreso|egreso)$/.test(res.signo) ? res.signo : null, monto: Number(res.monto) || null,
            fecha: /^\d{4}-\d{2}-\d{2}$/.test(res.fecha || "") ? res.fecha : null, por: por, cuenta: /^(euge|pau)$/.test(res.cuenta) ? res.cuenta : null,
            contraparte: res.contraparte || null, concepto: res.concepto || null, medio: res.medio || null, presupuesto: res.presupuesto || null,
            cliente: res.cliente || null, falta: falta, ia: res, estado: "pendiente" });
        }, function(e){
          var n = ((x.ia && x.ia.intentos) || 0) + 1;
          if (n < 4) return guardar(x, { ia: { intentos: n, error: String(e && e.message || e).slice(0, 200) } });
          return guardar(x, { estado: "pendiente", tipo: x.tipo || "otro", falta: ["La IA no lo pudo leer: completalo a mano"], ia: { intentos: n } });
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
    var n = ROWS.filter(function(r){ return r.estado === "pendiente" || r.estado === "procesando"; }).length;
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
  function pintarSuave(){ clearTimeout(tSuave); tSuave = setTimeout(function(){
    var a = document.activeElement; if (a && a.closest && a.closest(".nvmovp") && /INPUT|SELECT|TEXTAREA/.test(a.tagName)){ tabBtn(); decorarChat(); return; }
    pintar();
  }, 250); }
  function pintar(){
    tabBtn(); decorarChat();
    if (!document.body.classList.contains("nvmov-on")) return;
    var p = panel(); if (!p) return; var y = window.scrollY;
    p.replaceChildren();
    var vivos = ROWS.filter(function(r){ return r.estado !== "descartado"; });
    var pend = vivos.filter(function(r){ return r.estado === "pendiente" || r.estado === "procesando"; });
    var apro = vivos.filter(function(r){ return r.estado === "aprobado"; });
    var cab = h("div", "nvmov-cab");
    var tt = h("div"); tt.append(h("h1", null, "Movimientos"), h("p", null, "Todo lo que se manda en #movimientos queda acá hasta que lo aprueben."));
    cab.append(tt); p.append(cab);
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
      rs.forEach(function(r){ g.append(fila(r)); });
      p.append(g);
    });
    window.scrollTo(0, y);
  }
  function cargarFinanzas(r){
    var hoja = r.por === "pau" ? "fin_pau" : "fin_euge";
    var id = "mov" + r.id + "x" + Date.now().toString(36);
    var fecha = r.fecha || diaDe(r.msg_at || r.creado);
    var monto = Math.abs(Number(r.monto) || 0), total = signoDe(r) === "-" ? -monto : monto;
    var fila = { id: id, concepto: String(r.contraparte || r.concepto || tipoDe(r.tipo)[1]).toUpperCase(), fecha: fecha, cat: r.cat,
      total: total, cuenta: GRUPOS_FIN[String(r.cat).split(".")[0]] || "", notas: (r.concepto ? r.concepto + " · " : "") + "desde #movimientos" };
    return new Promise(function(ok, mal){
      google.script.run.withSuccessHandler(function(){ ok(id); }).withFailureHandler(mal).baseGuardarVarios(hoja, [fila]);
    });
  }
  function campo(lab, el){ var l = h("label", "nvmov-f"); l.append(h("span", null, lab), el); return l; }
  function fila(r){
    var f = h("div", "nvmov-row " + (r.estado === "aprobado" ? "ok" : r.estado === "procesando" ? "lee" : r.estado === "descartado" ? "des" : ""));
    var ck = h("input"); ck.type = "checkbox"; ck.className = "nvmov-ck"; ck.checked = r.estado === "aprobado"; ck.title = "Aprobar";
    ck.disabled = r.estado === "procesando" || r.estado === "descartado";
    ck.onchange = function(){
      if (ck.checked){
        if (!r.por){ ck.checked = false; toast("Elegí a quién se carga (Euge o Pau) antes de aprobar."); return; }
        if (!Number(r.monto)){ ck.checked = false; toast("Falta el monto."); return; }
        if (!r.cat){ ck.checked = false; toast("Elegí la categoría antes de aprobar."); return; }
        if (signoDe(r) !== "+" && signoDe(r) !== "-"){ ck.checked = false; toast("Marcá si entra o sale."); return; }
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
    var ckw = h("label", "nvmov-ckw"); ckw.append(ck, h("i")); f.append(ckw);
    var cu = h("div", "nvmov-cu");
    var g1 = h("div", "nvmov-g");
    var tp = h("select"); TIPOS.forEach(function(t){ var o = h("option", null, t[1]); o.value = t[0]; tp.append(o); }); tp.value = tipoDe(r.tipo)[0];
    tp.onchange = function(){ var s = tipoDe(tp.value)[2]; guardar(r, { tipo: tp.value, signo: s === "+" ? "ingreso" : s === "-" ? "egreso" : r.signo }); };
    var sg = h("button", "nvmov-sg " + (signoDe(r) === "+" ? "in" : signoDe(r) === "-" ? "eg" : ""), signoDe(r) === "+" ? "Entra" : signoDe(r) === "-" ? "Sale" : "±"); sg.type = "button";
    sg.onclick = function(){ guardar(r, { signo: signoDe(r) === "+" ? "egreso" : "ingreso" }); };
    var mo = h("input"); mo.inputMode = "numeric"; mo.value = r.monto ? Math.round(r.monto).toLocaleString("es-AR") : ""; mo.placeholder = "$ monto";
    mo.onchange = function(){ var n = Number(String(mo.value).replace(/[^\d,]/g, "").replace(",", ".")) || null; guardar(r, { monto: n }); };
    var qu = h("select", r.por ? "" : "falta"); [["","❓ ¿A quién?"],["euge","Euge"],["pau","Pau"]].forEach(function(o){ var e = h("option", null, o[1]); e.value = o[0]; qu.append(e); }); qu.value = r.por || "";
    qu.onchange = function(){ guardar(r, { por: qu.value || null }); };
    var fe = h("input"); fe.type = "date"; fe.value = r.fecha || ""; fe.onchange = function(){ guardar(r, { fecha: fe.value || null }); };
    g1.append(campo("Tipo", tp), campo("Entra / sale", sg), campo("Monto", mo), campo("Se carga a", qu), campo("Fecha", fe));
    var g2 = h("div", "nvmov-g dos");
    var co = h("input"); co.value = r.contraparte || ""; co.placeholder = "Cliente, proveedor o empleado"; co.onchange = function(){ guardar(r, { contraparte: co.value.trim() || null }); };
    var cc = h("input"); cc.value = r.concepto || ""; cc.placeholder = "Qué es"; cc.onchange = function(){ guardar(r, { concepto: cc.value.trim() || null }); };
    var ca = h("select", r.cat ? "" : "falta"); var o0 = h("option", null, "❓ Elegí categoría"); o0.value = ""; ca.append(o0);
    CATS.forEach(function(c){ var o = h("option", null, c); o.value = c; ca.append(o); }); ca.value = r.cat || "";
    ca.onchange = function(){ guardar(r, { cat: ca.value || null }); };
    g2.append(campo("Quién", co), campo("Concepto", cc), campo("Categoría", ca));
    if (r.cargado) [tp, sg, mo, qu, fe, co, cc, ca].forEach(function(x){ x.disabled = true; });
    cu.append(g1, g2);
    var pie = h("div", "nvmov-pie");
    pie.append(h("span", "nvmov-dest", "→ " + destino(r)));
    var al = [];
    if (r.por && r.cuenta && r.por !== r.cuenta) al.push("⚠️ El comprobante es de la cuenta de " + NOM[r.cuenta] + " y el mensaje dice " + NOM[r.por]);
    (r.falta || []).forEach(function(x){ al.push("Falta: " + x); });
    al.forEach(function(x){ pie.append(h("span", "nvmov-al", x)); });
    cu.append(pie);
    var orig = h("div", "nvmov-orig");
    var hora = new Date(r.msg_at || r.creado).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    orig.append(h("span", "nvmov-who", (NOM[r.autor] || r.autor || "") + " · " + hora), h("span", "nvmov-tx", r.texto || "(sin texto)"));
    (r.adj || []).forEach(function(a){
      if (!a || !a.id) return; var l = h("a", "nvmov-adj", /pdf/i.test(a.t || a.n || "") ? "📄 Ver PDF" : /image/i.test(a.t || "") ? "🖼 Ver comprobante" : "📎 " + (a.n || "Archivo"));
      l.href = "https://drive.google.com/file/d/" + a.id + "/view"; l.target = "_blank"; l.rel = "noopener"; orig.append(l);
    });
    if (r.estado === "aprobado" && r.aprobado_por) orig.append(h("span", "nvmov-apro", "✓ Aprobó " + (NOM[r.aprobado_por] || r.aprobado_por)));
    cu.append(orig);
    f.append(cu);
    var x = h("button", "nvmov-x", r.estado === "descartado" ? "↺" : "✕"); x.type = "button"; x.title = r.estado === "descartado" ? "Recuperar" : "Descartar";
    x.onclick = function(){ guardar(r, { estado: r.estado === "descartado" ? "pendiente" : "descartado" }); };
    f.append(x);
    return f;
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
