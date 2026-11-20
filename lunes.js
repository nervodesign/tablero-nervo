/* Resumen de la semana: los lunes aparece solo (una vez por persona); el resto de los días se abre con el botón "Pendientes de la semana" */
(function(){
  if (window.__nvLunes) return; window.__nvLunes = 1;
  var C = { fondo:"#F6F2ED", hueco:"#ECE6DF", borde:"#E2DAD1", tinta:"#4A3F37", suave:"#8C7D71", madera:"#9C7B62", rosa:"#C9A49A", azul:"#9FB3B2", rojo:"#B9776B" };
  var css = document.createElement("style");
  css.textContent = [
    ".nvl-fondo{position:fixed;inset:0;background:rgba(74,63,55,.28);backdrop-filter:blur(3px);z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px}",
    ".nvl-caja{background:"+C.fondo+";border-radius:26px;max-width:760px;width:100%;max-height:88vh;overflow:auto;padding:26px 26px 20px;box-shadow:0 30px 60px rgba(74,63,55,.18);color:"+C.tinta+";font-family:inherit}",
    ".nvl-caja h2{margin:0;font-size:26px;font-weight:600;letter-spacing:-.01em}",
    ".nvl-sub{color:"+C.suave+";margin:4px 0 18px;font-size:14px}",
    ".nvl-x{float:right;border:0;background:"+C.hueco+";width:34px;height:34px;border-radius:50%;font-size:18px;color:"+C.suave+";cursor:pointer;box-shadow:inset 2px 2px 5px rgba(120,100,85,.18),inset -2px -2px 5px rgba(255,255,255,.8)}",
    ".nvl-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}",
    ".nvl-k{background:"+C.hueco+";border-radius:18px;padding:12px 14px;box-shadow:inset 3px 3px 8px rgba(120,100,85,.16),inset -3px -3px 8px rgba(255,255,255,.75)}",
    ".nvl-k b{display:block;font-size:22px;font-weight:600}.nvl-k span{font-size:12px;color:"+C.suave+"}",
    ".nvl-sec{background:#fff8;border:1px solid "+C.borde+";border-radius:18px;padding:12px 14px;margin-bottom:10px}",
    ".nvl-sec h3{margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:"+C.madera+";font-weight:600;display:flex;justify-content:space-between}",
    ".nvl-f{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid "+C.borde+";font-size:14px}.nvl-f:first-of-type{border-top:0}",
    ".nvl-f i{font-style:normal;color:"+C.suave+";white-space:nowrap;font-size:13px}.nvl-tarde{color:"+C.rojo+"!important}",
    ".nvl-vacio{color:"+C.suave+";font-size:13px;padding:4px 0}",
    ".nvl-btn{display:inline-flex;align-items:center;gap:6px;margin-left:12px;border:0;cursor:pointer;font:inherit;font-size:13px;color:"+C.madera+";background:"+C.hueco+";padding:6px 12px;border-radius:999px;box-shadow:inset 2px 2px 5px rgba(120,100,85,.16),inset -2px -2px 5px rgba(255,255,255,.8);vertical-align:middle}",
    "@media(max-width:640px){.nvl-kpis{grid-template-columns:repeat(2,1fr)}.nvl-caja{padding:20px 16px}.nvl-caja h2{font-size:22px}}"
  ].join("");
  document.head.appendChild(css);

  function hoyISO(d){ d = d || new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }
  function sumar(iso, n){ var d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return hoyISO(d); }
  function J(v){ if (Array.isArray(v)) return v; try { var x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : []; } catch(e){ return v ? [String(v)] : []; } }
  function plata(n){ n = Math.round(Number(n) || 0); return "$ " + n.toLocaleString("es-AR"); }
  function fcorta(iso){ if (!iso) return ""; var p = String(iso).slice(0, 10).split("-"); return p.length === 3 ? (Number(p[2]) + "/" + Number(p[1])) : iso; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
  function soy(){ return String((window.__nv && window.__nv.S && window.__nv.S.soy) || ""); }
  function mia(resp){ var r = String(resp || "").toLowerCase(); return !r || r === "ambas" || r === "ambos" || r === soy(); }

  function datos(){
    var L = window.__nvLocal; if (!L || !L.leerTodo || !L.baseLeer) return Promise.reject(new Error("sin datos"));
    return Promise.all([L.leerTodo([]), L.baseLeer([])]);
  }
  function armar(R){
    var D = R[0] || {}, B = R[1] || {}, hoy = hoyISO(), fin = sumar(hoy, 7);
    // pedidos web sin enviar
    var web = (B.base_min || []).filter(function(x){ var e = String(x.env || "").trim().toUpperCase(); return x.fecha && x.fecha >= sumar(hoy, -60) && e && e !== "ENVIADO" && !/CANCEL/.test(e); })
      .map(function(x){ return { t: x.cliente || x.num, d: x.num + " · " + String(x.env).trim().toLowerCase() }; });
    // mayoristas sin entregar y saldos
    var may = (B.base_may || []).filter(function(x){ var e = J(x.estado).join(" ").toUpperCase(); return !/ENTREGAD|CANCEL/.test(e); })
      .map(function(x){ var e = J(x.estado).join(" ").toLowerCase() || "sin estado"; return { t: x.cliente, d: e + (x.limite ? " · entrega " + fcorta(x.limite) : ""), tarde: x.limite && x.limite < hoy }; });
    var cobrar = (B.base_may || []).filter(function(x){ return Number(x.saldo) > 0 && !/CANCEL/.test(J(x.estado).join(" ").toUpperCase()); })
      .map(function(x){ return { t: x.cliente, d: plata(x.saldo), n: Number(x.saldo) }; });
    // tareas: atrasadas y de esta semana
    var tareas = (D.tareas || []).filter(function(t){ return t.estado !== "hecha" && mia(t.resp) && t.fecha && t.fecha <= fin && !t.rep; })
      .sort(function(a, b){ return a.fecha < b.fecha ? -1 : 1; })
      .map(function(t){ return { t: t.titulo, d: t.fecha < hoy ? "atrasada · " + fcorta(t.fecha) : fcorta(t.fecha), tarde: t.fecha < hoy }; });
    var recs = (D.recordatorios || []).filter(function(r){ return r.estado !== "hecho" && mia(r.resp) && r.fecha && r.fecha <= fin; })
      .map(function(r){ return { t: r.texto, d: fcorta(r.fecha), tarde: r.fecha < hoy }; });
    // pagos a proveedores que vencen esta semana o ya vencieron
    var pagos = [];
    (D.proveedores || []).forEach(function(p){
      J(p.pedidos).forEach(function(o){
        if (!o || typeof o !== "object") return;
        var pagado = (o.pagos || []).reduce(function(s, x){ return s + (Number(x.monto) || 0); }, 0), resta = (Number(o.total) || 0) - pagado;
        if (resta > 1 && o.vence && o.vence <= fin) pagos.push({ t: p.proveedor || p.alias, d: plata(resta) + " · " + (o.vence < hoy ? "venció " : "vence ") + fcorta(o.vence), tarde: o.vence < hoy, n: resta });
      });
    });
    return { web: web, may: may, cobrar: cobrar, tareas: tareas.concat(recs), pagos: pagos };
  }
  function seccion(titulo, L, extra){
    var h = '<div class="nvl-sec"><h3><span>' + titulo + '</span><span>' + (extra || L.length) + '</span></h3>';
    if (!L.length) h += '<div class="nvl-vacio">Nada pendiente ✓</div>';
    L.slice(0, 12).forEach(function(x){ h += '<div class="nvl-f"><span>' + esc(x.t) + '</span><i class="' + (x.tarde ? "nvl-tarde" : "") + '">' + esc(x.d) + '</i></div>'; });
    if (L.length > 12) h += '<div class="nvl-vacio">y ' + (L.length - 12) + ' más</div>';
    return h + "</div>";
  }
  function abrir(){
    if (document.querySelector(".nvl-fondo")) return;
    datos().then(function(R){
      var X = armar(R), sum = function(L){ return L.reduce(function(s, x){ return s + (x.n || 0); }, 0); };
      var nombre = soy() === "pau" ? "Pau" : "Euge", lunes = new Date().getDay() === 1;
      var f = document.createElement("div"); f.className = "nvl-fondo";
      f.innerHTML = '<div class="nvl-caja"><button class="nvl-x" title="Cerrar">×</button>' +
        '<h2>' + (lunes ? "Arranca la semana, " : "Pendientes de la semana, ") + nombre + '</h2>' +
        '<div class="nvl-sub">Todo lo que quedó por hacer, hasta el ' + fcorta(sumar(hoyISO(), 7)) + '.</div>' +
        '<div class="nvl-kpis">' +
          '<div class="nvl-k"><b>' + X.web.length + '</b><span>pedidos web sin enviar</span></div>' +
          '<div class="nvl-k"><b>' + X.may.length + '</b><span>mayoristas sin entregar</span></div>' +
          '<div class="nvl-k"><b>' + X.tareas.length + '</b><span>tareas y recordatorios</span></div>' +
          '<div class="nvl-k"><b>' + plata(sum(X.pagos)) + '</b><span>a pagar esta semana</span></div>' +
        '</div>' +
        seccion("Tareas y recordatorios", X.tareas) +
        seccion("Pedidos web sin enviar", X.web) +
        seccion("Mayoristas sin entregar", X.may) +
        seccion("Mayoristas: falta cobrar", X.cobrar, plata(sum(X.cobrar))) +
        seccion("Pagos a proveedores", X.pagos, plata(sum(X.pagos))) +
        '</div>';
      f.addEventListener("click", function(e){ if (e.target === f || e.target.classList.contains("nvl-x")) f.remove(); });
      document.body.appendChild(f);
    }, function(e){ console.warn("resumen semana:", e && e.message); });
  }
  window.__nvAbrirSemana = abrir;

  // botón al lado de la fecha en Hoy
  setInterval(function(){
    if (document.querySelector(".nvl-btn")) return;
    var h = [].slice.call(document.querySelectorAll("h1,h2,div,p,span")).find(function(el){ return el.children.length === 0 && /^(lunes|martes|miércoles|jueves|viernes|sábado|domingo), \d+ de /i.test((el.textContent || "").trim()); });
    if (!h) return;
    var b = document.createElement("button"); b.className = "nvl-btn"; b.textContent = "☰ Pendientes de la semana"; b.onclick = abrir; h.appendChild(b);
  }, 1500);

  // los lunes se abre solo, una vez por persona
  setTimeout(function(){
    if (new Date().getDay() !== 1 || !soy()) return;
    var k = "nv-lunes-" + soy() + "-" + hoyISO(); try { if (localStorage.getItem(k)) return; localStorage.setItem(k, "1"); } catch(e){}
    abrir();
  }, 3500);
})();
