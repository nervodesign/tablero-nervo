/* ================= Mayoristas · Mails: calendario de mails editable, vista previa y prueba ================= */
(function(){
  if (window.__nvMails) return; window.__nvMails = 1;
  var LOGO = "https://nervomayorista.com/logo_nervo.png";
  var CAT = null, ROWS = null, MODO = false, SOY = "";
  var PARA = { todos: "Todos", activos: "Activos", enfriando: "Enfriándose", dormidos: "Para reactivar", nuevos: "Sin compras" };

  var CSS = [
    "main#list.nvml-on > :not(.my-top):not(#nvml){display:none!important}",
    "main#list.nvml-on .my-top .pz-sw button:not(.nvml-tab){background:transparent!important;box-shadow:none!important;color:#7A5E50!important}",
    "html:not(#nv) .my-top .pz-sw button.nvml-tab.on{background:#fff!important;color:#3B2418!important;box-shadow:0 1px 3px rgba(58,36,28,.08)!important}",
    "#nvml{font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    "#nvml .ml-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:6px 2px 14px}",
    "#nvml .ml-head h3{margin:0;font-weight:500;font-size:18px}",
    "#nvml .ml-head p{margin:3px 0 0;font-size:13px;color:#9A8274;font-weight:300}",
    "#nvml .ml-btn{border:0;border-radius:999px;padding:9px 16px;font:400 13.5px Outfit,system-ui,sans-serif;cursor:pointer;background:#F5EFEA;color:#3B2418;white-space:nowrap}",
    "#nvml .ml-btn.dark,.nvml-modal .ml-btn.dark{background:#3B2418;color:#fff}",
    "#nvml .ml-btn:hover{filter:brightness(.97)}",
    "#nvml .ml-tbl{background:#fff;border-radius:22px;box-shadow:0 1px 2px rgba(58,36,28,.04),0 8px 24px rgba(58,36,28,.05);overflow:hidden}",
    "#nvml table{width:100%;border-collapse:collapse}",
    "#nvml th{font-weight:400;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9A8274;text-align:left;padding:14px 14px 10px;background:#FBF8F5}",
    "#nvml td{padding:13px 14px;border-top:1px solid #F4EEE9;font-size:14px;vertical-align:middle}",
    "#nvml tr.ml-r{cursor:pointer}#nvml tr.ml-r:hover td{background:#FCF9F7}",
    "#nvml .ml-dia{width:46px;height:46px;border-radius:14px;background:#F3EAE3;display:grid;place-items:center;font-weight:500;font-size:17px;line-height:1}",
    "#nvml .ml-dia small{display:block;font-size:9px;letter-spacing:.1em;color:#9A8274;font-weight:400;margin-top:2px}",
    "#nvml .ml-nom b{font-weight:500;display:block}#nvml .ml-nom span{font-size:12.5px;color:#9A8274;font-weight:300}",
    "#nvml .ml-chip{display:inline-block;background:#F5EFEA;border-radius:999px;padding:3px 10px;font-size:12px;white-space:nowrap}",
    "#nvml .ml-sw{width:38px;height:22px;border-radius:999px;background:#E4DAD2;position:relative;display:inline-block;vertical-align:middle;transition:.2s}",
    "#nvml .ml-sw:after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.15)}",
    "#nvml .ml-sw.on{background:#7E9A82}#nvml .ml-sw.on:after{left:19px}",
    "#nvml .ml-est{font-size:12.5px;color:#9A8274;margin-left:8px}",
    "#nvml .ml-acts{display:flex;gap:6px;justify-content:flex-end}",
    "#nvml .ml-note{margin:12px 4px 0;font-size:12.5px;color:#9A8274;font-weight:300}",
    "#nvml .ml-add td{color:#8A6B58;font-size:13.5px}",
    ".nvml-modal{position:fixed;inset:0;z-index:9000;background:rgba(40,26,18,.38);display:flex;align-items:stretch;justify-content:flex-end;font-family:Outfit,system-ui,sans-serif;color:#3B2418}",
    ".nvml-modal .mm{background:#FBF8F5;width:min(1180px,100%);height:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);box-shadow:-10px 0 40px rgba(0,0,0,.12)}",
    ".nvml-modal .mm-f{overflow:auto;padding:22px 24px 90px}",
    ".nvml-modal .mm-p{background:#E9E3DC;overflow:auto;padding:18px;position:relative}",
    ".nvml-modal .mm-p iframe{width:100%;height:calc(100% - 44px);border:0;border-radius:16px;background:#fff}",
    ".nvml-modal .mm-p .pv-bar{display:flex;gap:6px;margin-bottom:10px;align-items:center;justify-content:space-between}",
    ".nvml-modal h4{margin:0 0 4px;font-weight:500;font-size:19px}",
    ".nvml-modal .sec{background:#fff;border-radius:18px;padding:14px 16px;margin:12px 0;box-shadow:0 1px 2px rgba(58,36,28,.04)}",
    ".nvml-modal .sec>b{display:block;font-weight:500;font-size:13px;margin-bottom:8px;color:#5A3A2A}",
    ".nvml-modal label{display:block;font-size:11.5px;letter-spacing:.06em;color:#9A8274;margin:8px 0 4px}",
    ".nvml-modal input,.nvml-modal textarea,.nvml-modal select{width:100%;box-sizing:border-box;border:1px solid #EAE1DA;border-radius:12px;padding:9px 11px;font:400 14px Outfit,system-ui,sans-serif;color:#3B2418;background:#FDFBF9}",
    ".nvml-modal textarea{min-height:92px;resize:vertical;line-height:1.45}",
    ".nvml-modal .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
    ".nvml-modal .row3{display:grid;grid-template-columns:90px 1fr 1fr;gap:10px}",
    ".nvml-modal .ml-btn{border:0;border-radius:999px;padding:9px 16px;font:400 13.5px Outfit,system-ui,sans-serif;cursor:pointer;background:#F5EFEA;color:#3B2418}",
    ".nvml-modal .foot{position:sticky;bottom:-90px;margin:16px -24px -90px;padding:14px 24px;background:rgba(251,248,245,.96);border-top:1px solid #EFE7E0;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}",
    ".nvml-modal .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;max-height:260px;overflow:auto;padding:2px}",
    ".nvml-modal .pgrid .pi{border-radius:12px;overflow:hidden;background:#F5EFEA;cursor:pointer;border:2px solid transparent;font-size:11px;text-align:center}",
    ".nvml-modal .pgrid .pi img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#EEE6DF}",
    ".nvml-modal .pgrid .pi span{display:block;padding:4px 4px 6px;line-height:1.2}",
    ".nvml-modal .pgrid .pi.sel{border-color:#3B2418}",
    ".nvml-modal .hint{font-size:12px;color:#9A8274;font-weight:300;margin-top:6px}",
    ".nvml-modal .x{position:absolute;top:14px;right:16px;border:0;background:#fff;border-radius:50%;width:34px;height:34px;font-size:18px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.1)}",
    "@media (max-width:760px){",
    "  #nvml th.h-m,#nvml td.h-m{display:none}",
    "  #nvml td{padding:11px 10px}#nvml .ml-acts .ml-btn{padding:7px 11px;font-size:12.5px}",
    "  .nvml-modal .mm{grid-template-columns:1fr;grid-template-rows:auto auto;overflow:auto;display:block}",
    "  .nvml-modal .mm-f{overflow:visible;padding:18px 16px 20px}",
    "  .nvml-modal .mm-p{height:640px}",
    "  .nvml-modal .foot{position:sticky;bottom:0;margin:16px -16px 0}",
    "  .nvml-modal .row3{grid-template-columns:80px 1fr}",
    "}"
  ].join("\n");
  var st = document.createElement("style"); st.id = "nvml-css"; st.textContent = CSS; document.head.appendChild(st);

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function toast(t){ try { var d = document.createElement("div"); d.textContent = t; d.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#3B2418;color:#fff;padding:11px 18px;border-radius:999px;font:400 14px Outfit,system-ui,sans-serif;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.2)"; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 2800); } catch(e){} }
  function SB(){ return window.__sb; }

  /* ---------- catálogo de nervomayorista.com (nombre + foto) ---------- */
  function catalogo(){
    if (CAT) return Promise.resolve(CAT);
    return fetch("https://nervomayorista.com/?n=" + Date.now()).then(function(r){ return r.text(); }).then(function(t){
      var fotos = {}, re = /'([a-z0-9-]+)':\s*\{([^}]*)\}/g, m;
      while ((m = re.exec(t))){ var f = /:'([^']+)'/.exec(m[2]); if (f && /^[a-z]+_/.test(f[1])) fotos[m[1]] = f[1]; }
      var out = [], seen = {}, re2 = /\{\s*id:'([^']+)',\s*nombre:'([^']+)'/g;
      while ((m = re2.exec(t))){ if (seen[m[1]]) continue; seen[m[1]] = 1; if (fotos[m[1]]) out.push({ id: m[1], nombre: m[2], foto: "https://nervomayorista.com/" + fotos[m[1]] + ".webp" }); }
      CAT = out; return out;
    }).catch(function(){ CAT = []; return CAT; });
  }

  /* ---------- a quién le llega ---------- */
  function fecha(s){
    if (!s) return 0; s = String(s);
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); if (m) return Date.UTC(+m[1], m[2] - 1, +m[3]);
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(s); if (m){ var y = +m[3]; if (y < 100) y += 2000; return Date.UTC(y, m[2] - 1, +m[1]); }
    var d = Date.parse(s); return isNaN(d) ? 0 : d;
  }
  function clientes(){
    var S = (window.__nv && window.__nv.S) || {}, L = S.mayclientes || [], V = ((S.bzData || {}).may) || [];
    var ult = {}; V.forEach(function(v){ var k = norm(v.cliente), f = fecha(v.fecha); if (k && f > (ult[k] || 0)) ult[k] = f; });
    var hoy = Date.now();
    return L.filter(function(c){ return /@/.test(c.email || ""); }).map(function(c){
      var u = ult[norm(c.nombre)] || 0, dias = u ? (hoy - u) / 864e5 : null;
      var seg = dias == null ? "nuevos" : dias <= 90 ? "activos" : dias <= 180 ? "enfriando" : "dormidos";
      return { nombre: c.nombre, cont: c.cont, email: String(c.email).trim(), seg: seg };
    });
  }
  function destinatarios(para){ var L = clientes(); return para === "todos" || !para ? L : L.filter(function(c){ return c.seg === para; }); }
  function primerNombre(c){ var k = (c && (c.cont || "")).trim(); if (!k){ var m = String((c && c.nombre) || "").match(/\(([^)]+)\)/); k = m ? m[1] : ""; } k = k.split(/\s+/)[0] || ""; return k ? k.charAt(0).toUpperCase() + k.slice(1).toLowerCase() : ""; }

  /* ---------- el mail (HTML que funciona en Gmail, Outlook y celu) ---------- */
  var MES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  function proximo(d){
    var dia = Math.min(28, Math.max(1, +d.dia || 1)), h = new Date(), f = new Date(h.getFullYear(), h.getMonth(), dia, 9, 0);
    if (f < new Date(h.getFullYear(), h.getMonth(), h.getDate())) f = new Date(h.getFullYear(), h.getMonth() + 1, dia, 9, 0);
    return f;
  }
  function bannerDe(d, cuando){ var B = (d.banners || []).filter(Boolean); if (!B.length) return ""; var f = cuando || proximo(d); return B[(f.getFullYear() * 12 + f.getMonth()) % B.length]; }
  function mailHTML(d, c){
    var F = "font-family:'Outfit','Helvetica Neue',Arial,sans-serif;";
    var nom = primerNombre(c);
    function per(s){ return esc(s).replace(/\{nombre\}/g, esc(nom)).replace(/\{mes\}/g, MES[proximo(d).getMonth()]); }
    var titulo = per(d.titulo || ""); if (nom && !/\{nombre\}/.test(d.titulo || "")) titulo = titulo.replace(/^Hola!?/, "Hola " + esc(nom) + "!");
    var parr = String(d.texto || "").split(/\n\s*\n/).map(function(p){ return '<p style="margin:0 0 14px;' + F + 'font-size:15px;line-height:1.6;font-weight:300;color:#6B5E55;">' + per(p).replace(/\n/g, "<br>") + "</p>"; }).join("");
    var ban = bannerDe(d);
    var btn = function(t, l, dark){ if (!t || !l) return ""; return '<td style="padding:0 5px 8px 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="' + (dark ? "background:#4A3F37;" : "border:1.5px solid #4A3F37;") + 'border-radius:999px;"><a href="' + esc(l) + '" style="display:inline-block;padding:' + (dark ? "13px 26px" : "11.5px 22px") + ';' + F + 'font-size:15px;color:' + (dark ? "#FFFFFF" : "#4A3F37") + ';text-decoration:none;">' + esc(t) + "</a></td></tr></table></td>"; };
    var P = (d.productos || []).slice(0, 4), prods = "";
    if (P.length){
      var celdas = P.map(function(p){ return '<td class="col" width="50%" valign="top" style="padding:0 6px 14px;"><a href="' + esc(d.link1 || "https://nervomayorista.com") + '" style="text-decoration:none;"><img src="' + esc(p.foto) + '" width="250" alt="' + esc(p.nombre) + '" style="display:block;width:100%;max-width:250px;height:auto;border-radius:14px;border:0;background:#EEEAE5;"></a><p style="margin:8px 0 0;' + F + 'font-size:14px;font-weight:500;color:#4A3F37;">' + esc(p.nombre) + "</p></td>"; });
      var filas = ""; for (var i = 0; i < celdas.length; i += 2) filas += "<tr>" + celdas[i] + (celdas[i + 1] || '<td class="col" width="50%"></td>') + "</tr>";
      prods = '<tr><td class="px" style="padding:22px 38px 4px;"><p style="margin:0 0 12px 6px;' + F + 'font-size:16px;font-weight:500;color:#4A3F37;">' + esc(d.titProductos || "Lo que más se está vendiendo") + '</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + filas + "</table></td></tr>";
    }
    var rec = String(d.recordar || "").split("\n").map(function(x){ return x.trim(); }).filter(Boolean);
    var recH = rec.length ? '<tr><td class="px" style="padding:10px 44px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEEAE5;border-radius:16px;"><tr><td style="padding:16px 20px;' + F + 'font-size:13.5px;line-height:1.6;color:#6B5E55;"><b style="font-weight:500;color:#4A3F37;">Para recordar</b><br>· ' + rec.map(per).join("<br>· ") + "</td></tr></table></td></tr>" : "";
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + per(d.asunto) + '</title>' +
      '<style>@media (max-width:600px){.col{display:block!important;width:100%!important;padding:0 0 16px!important}.col img{max-width:100%!important}.px{padding-left:22px!important;padding-right:22px!important}}</style></head>' +
      '<body style="margin:0;padding:0;background:#E6E1DB;"><div style="display:none;max-height:0;overflow:hidden;">' + per(d.preheader) + '</div>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E6E1DB;"><tr><td align="center" style="padding:24px 10px;">' +
      '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:22px;overflow:hidden;">' +
      '<tr><td align="center" style="padding:26px 20px 16px;"><img src="' + LOGO + '" width="64" alt="Nervo Design" style="display:block;border:0;width:64px;height:auto;"><p style="margin:8px 0 0;' + F + 'font-size:10.5px;letter-spacing:.22em;color:#8F8780;text-transform:uppercase;">Iluminación &amp; Deco · Mayoristas</p></td></tr>' +
      (ban ? '<tr><td style="padding:0;"><img src="' + esc(ban) + '" width="600" alt="" style="display:block;width:100%;height:auto;border:0;"></td></tr>' : "") +
      '<tr><td class="px" style="padding:28px 44px 8px;">' + (d.etiqueta ? '<p style="margin:0 0 6px;' + F + 'font-size:11px;letter-spacing:.18em;color:#8A9A98;text-transform:uppercase;font-weight:500;">' + per(d.etiqueta) + "</p>" : "") +
      '<h1 style="margin:0 0 14px;' + F + 'font-size:25px;line-height:1.25;font-weight:500;color:#4A3F37;">' + titulo + "</h1>" + parr +
      '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px;"><tr>' + btn(d.boton1, d.link1, true) + btn(d.boton2, d.link2, false) + "</tr></table></td></tr>" +
      prods + recH +
      '<tr><td align="center" style="padding:22px 44px 28px;' + F + 'font-size:13px;color:#8F8780;">Gracias por elegirnos 🤎 · ' + esc(d.firma || "Pau y Euge") + "</td></tr>" +
      '<tr><td align="center" style="background:#EEEAE5;padding:18px;' + F + 'font-size:11.5px;line-height:1.6;color:#8F8780;">Nervo Design · Córdoba · nervodesigncordoba@gmail.com · +54 9 3518 62-2392<br>Si no querés recibir más estos mails, respondé este mail con la palabra BAJA.</td></tr>' +
      "</table></td></tr></table></body></html>";
  }
  function mailTexto(d, c){ var nom = primerNombre(c); return (d.titulo || "").replace(/\{nombre\}/g, nom) + "\n\n" + (d.texto || "").replace(/\{nombre\}/g, nom) + "\n\n" + (d.link1 || "https://nervomayorista.com"); }

  /* ---------- datos ---------- */
  function cargar(){
    return SB().from("mail_campanas").select("*").order("orden").then(function(r){ if (r.error){ toast("No se pudieron leer los mails"); ROWS = []; return; } ROWS = r.data || []; });
  }
  function guardar(row){
    row.cambiado = new Date().toISOString(); row.por = SOY;
    return SB().from("mail_campanas").upsert({ id: row.id, orden: row.orden || 0, datos: row.datos, cambiado: row.cambiado, por: SOY }).then(function(r){ if (r.error){ toast("No se pudo guardar: " + r.error.message); throw r.error; } });
  }

  /* ---------- tabla ---------- */
  function pintar(){
    var box = document.getElementById("nvml"); if (!box) return;
    if (!ROWS){ box.innerHTML = '<p class="ml-note">Cargando…</p>'; return; }
    var cl = clientes();
    var filas = ROWS.slice().sort(function(a, b){ return (+a.datos.dia || 0) - (+b.datos.dia || 0); }).map(function(r){
      var d = r.datos || {}, n = d.para === "todos" || !d.para ? cl.length : cl.filter(function(c){ return c.seg === d.para; }).length, f = proximo(d);
      return '<tr class="ml-r" data-id="' + esc(r.id) + '"><td style="width:60px"><div class="ml-dia">' + esc(d.dia || "–") + "<small>DÍA</small></div></td>" +
        '<td class="ml-nom"><b>' + esc(d.nombre || "Sin nombre") + "</b><span>" + esc(d.asunto || "") + "</span></td>" +
        '<td class="h-m"><span class="ml-chip">' + esc(PARA[d.para] || "Todos") + " · " + n + "</span></td>" +
        '<td class="h-m">' + f.getDate() + " de " + MES[f.getMonth()] + "</td>" +
        '<td><span class="ml-sw' + (d.activo ? " on" : "") + '" data-sw="' + esc(r.id) + '" title="Prender / apagar"></span><span class="ml-est h-m">' + (d.activo ? "Prendido" : "Apagado") + "</span></td>" +
        '<td><div class="ml-acts"><button class="ml-btn" data-ed="' + esc(r.id) + '">Editar</button></div></td></tr>';
    }).join("");
    box.innerHTML = '<div class="ml-head"><div><h3>Mails a mayoristas</h3><p>Cada mail sale solo el día del mes que elijas. Tocá una fila para cambiar texto, fotos o a quién le llega.</p></div><button class="ml-btn dark" data-nuevo="1">+ Nuevo mail</button></div>' +
      '<div class="ml-tbl"><table><thead><tr><th>Día</th><th>Mail</th><th class="h-m">Para</th><th class="h-m">Próximo</th><th>Estado</th><th></th></tr></thead><tbody>' + filas +
      (ROWS.length ? "" : '<tr class="ml-add"><td colspan="6">Todavía no hay mails. Tocá “+ Nuevo mail”.</td></tr>') + "</tbody></table></div>" +
      '<p class="ml-note">' + cl.length + " mayoristas con mail cargado. Por ahora los mails se mandan solo como prueba a tu casilla; el envío automático se prende cuando conectemos la cuenta de mails de mayoristas.</p>";
  }
  document.addEventListener("click", function(e){
    var box = document.getElementById("nvml"); if (!box || !box.contains(e.target)) return;
    var sw = e.target.closest("[data-sw]");
    if (sw){ e.stopPropagation(); var r = ROWS.find(function(x){ return x.id === sw.dataset.sw; }); if (!r) return; r.datos.activo = !r.datos.activo; pintar(); guardar(r).catch(function(){ r.datos.activo = !r.datos.activo; pintar(); }); return; }
    if (e.target.closest("[data-nuevo]")){
      var base = ROWS[0] ? JSON.parse(JSON.stringify(ROWS[0].datos)) : {};
      var nuevo = { id: "mc" + Date.now(), orden: (ROWS.length + 1), datos: Object.assign(base, { nombre: "Nuevo mail", dia: 15, activo: false, asunto: "", titulo: "Hola!", texto: "", productos: [], etiqueta: "" }) };
      ROWS.push(nuevo); editar(nuevo, true); return;
    }
    var tr = e.target.closest("tr.ml-r"); if (tr){ var row = ROWS.find(function(x){ return x.id === tr.dataset.id; }); if (row) editar(row); }
  });

  /* ---------- editor con vista previa ---------- */
  function editar(row, esNuevo){
    var d = JSON.parse(JSON.stringify(row.datos || {}));
    var m = document.createElement("div"); m.className = "nvml-modal";
    function campo(k, lab, tipo, ph){ return "<label>" + lab + "</label>" + (tipo === "area" ? '<textarea data-k="' + k + '" placeholder="' + esc(ph || "") + '">' + esc(d[k] || "") + "</textarea>" : '<input data-k="' + k + '" value="' + esc(d[k] || "") + '" placeholder="' + esc(ph || "") + '"' + (tipo === "num" ? ' type="number" min="1" max="28"' : "") + ">"); }
    m.innerHTML = '<div class="mm"><div class="mm-f"><h4>' + esc(d.nombre || "Mail") + '</h4><div class="hint">Todo se puede cambiar. Usá {nombre} para poner el nombre del cliente y {mes} para el mes.</div>' +
      '<div class="sec"><b>Cuándo y a quién</b><div class="row3"><div>' + campo("dia", "Día del mes", "num") + "</div><div>" + campo("nombre", "Nombre interno") + '</div><div><label>Para</label><select data-k="para">' +
      Object.keys(PARA).map(function(k){ return '<option value="' + k + '"' + ((d.para || "todos") === k ? " selected" : "") + ">" + PARA[k] + " (" + destinatarios(k).length + ")</option>"; }).join("") + "</select></div></div></div>" +
      '<div class="sec"><b>Asunto</b>' + campo("asunto", "Asunto del mail") + campo("preheader", "Texto chiquito que se ve en la bandeja (opcional)") + "</div>" +
      '<div class="sec"><b>Contenido</b>' + campo("etiqueta", "Etiqueta arriba del título (opcional)", "", "Ej: Catálogo de {mes}") + campo("titulo", "Título") + campo("texto", "Texto (dejá una línea en blanco para separar párrafos)", "area") +
      '<div class="row2"><div>' + campo("boton1", "Botón 1") + "</div><div>" + campo("link1", "Link botón 1") + '</div></div><div class="row2"><div>' + campo("boton2", "Botón 2") + "</div><div>" + campo("link2", "Link botón 2") + "</div></div>" +
      campo("recordar", "Recuadro “Para recordar” (una cosa por línea, vacío = no aparece)", "area") + campo("firma", "Firma", "", "Pau y Euge") + "</div>" +
      '<div class="sec"><b>Banner de arriba</b>' + campo("banners", "Links de fotos, uno por línea. Cada mes usa la siguiente.", "area", "https://…") + '<div class="hint">Tip: tocá un producto de abajo con la tecla ⌥/Alt apretada para usar su foto como banner.</div></div>' +
      '<div class="sec"><b>Productos destacados (hasta 4)</b>' + campo("titProductos", "Título de la sección", "", "Lo que más se está vendiendo") + '<div class="pgrid" id="nvml-pg"><div class="hint">Cargando catálogo…</div></div></div>' +
      '<div class="foot">' + (esNuevo ? "" : '<button class="ml-btn" data-a="borrar">Borrar</button>') + '<button class="ml-btn" data-a="cerrar">Cerrar</button><button class="ml-btn" data-a="prueba">Mandarme una prueba</button><button class="ml-btn dark" data-a="guardar">Guardar</button></div></div>' +
      '<div class="mm-p"><div class="pv-bar"><span style="font-size:13px;color:#6B5E55">Vista previa</span><span><button class="ml-btn" data-pv="pc">Compu</button> <button class="ml-btn" data-pv="cel">Celu</button></span></div><iframe id="nvml-pv"></iframe><button class="x" data-a="cerrar">×</button></div></div>';
    document.body.appendChild(m);
    var ta = m.querySelector('[data-k="banners"]'); ta.value = (d.banners || []).join("\n");
    function leer(){
      m.querySelectorAll("[data-k]").forEach(function(el){ var k = el.dataset.k, v = el.value; if (k === "banners") d.banners = v.split("\n").map(function(x){ return x.trim(); }).filter(Boolean); else if (k === "dia") d.dia = Math.min(28, Math.max(1, parseInt(v, 10) || 1)); else d[k] = v; });
    }
    var ej = destinatarios(d.para)[0] || { nombre: "Cliente (Natalia)", cont: "Natalia" };
    function preview(){ leer(); var f = m.querySelector("#nvml-pv"); f.srcdoc = mailHTML(d, ej); }
    var tmo; m.addEventListener("input", function(){ clearTimeout(tmo); tmo = setTimeout(preview, 300); });
    m.addEventListener("change", preview);
    catalogo().then(function(L){
      var pg = m.querySelector("#nvml-pg"); if (!L.length){ pg.innerHTML = '<div class="hint">No se pudo leer el catálogo de nervomayorista.com.</div>'; return; }
      function dib(){ var sel = (d.productos || []).map(function(p){ return p.id; }); pg.innerHTML = L.map(function(p){ return '<div class="pi' + (sel.indexOf(p.id) >= 0 ? " sel" : "") + '" data-p="' + esc(p.id) + '"><img loading="lazy" src="' + esc(p.foto) + '" alt=""><span>' + esc(p.nombre.replace(/^Colgante |^Aplique /, "")) + "</span></div>"; }).join(""); }
      dib();
      pg.addEventListener("click", function(e){
        var it = e.target.closest("[data-p]"); if (!it) return; var p = L.find(function(x){ return x.id === it.dataset.p; }); if (!p) return;
        if (e.altKey){ leer(); d.banners = (d.banners || []).concat([p.foto]); ta.value = d.banners.join("\n"); preview(); return; }
        d.productos = d.productos || []; var i = d.productos.findIndex(function(x){ return x.id === p.id; });
        if (i >= 0) d.productos.splice(i, 1); else { if (d.productos.length >= 4){ toast("Hasta 4 productos"); return; } d.productos.push(p); }
        dib(); preview();
      });
    });
    m.addEventListener("click", function(e){
      var pv = e.target.closest("[data-pv]"); if (pv){ m.querySelector("#nvml-pv").style.maxWidth = pv.dataset.pv === "cel" ? "390px" : ""; m.querySelector("#nvml-pv").style.margin = "0 auto"; m.querySelector("#nvml-pv").style.display = "block"; return; }
      if (e.target === m){ cerrar(); return; }
      var a = e.target.closest("[data-a]"); if (!a) return;
      if (a.dataset.a === "cerrar") cerrar();
      if (a.dataset.a === "guardar"){ leer(); row.datos = d; guardar(row).then(function(){ toast("Guardado 🤎"); m.remove(); pintar(); }).catch(function(){}); }
      if (a.dataset.a === "borrar"){ if (!confirm("¿Borrar el mail “" + (d.nombre || "") + "”?")) return; SB().from("mail_campanas").delete().eq("id", row.id).then(function(r){ if (r.error){ toast("No se pudo borrar"); return; } ROWS = ROWS.filter(function(x){ return x.id !== row.id; }); m.remove(); pintar(); }); }
      if (a.dataset.a === "prueba"){
        leer(); if (!/@/.test(SOY)){ toast("No encontré tu mail"); return; }
        a.disabled = true; a.textContent = "Mandando…";
        try {
          google.script.run.withSuccessHandler(function(r){ a.disabled = false; a.textContent = "Mandarme una prueba"; toast(r && (r.ok || []).length ? "Prueba enviada a " + SOY : "No se pudo mandar la prueba"); })
            .withFailureHandler(function(){ a.disabled = false; a.textContent = "Mandarme una prueba"; toast("No se pudo mandar la prueba"); })
            .mandarMails(JSON.stringify({ asunto: "[Prueba] " + String(d.asunto || "").replace(/\{nombre\}/g, primerNombre(ej)), fotos: [], para: [{ id: "prueba-" + row.id, email: SOY, html: mailHTML(d, ej), texto: mailTexto(d, ej) }] }));
        } catch(err){ a.disabled = false; a.textContent = "Mandarme una prueba"; toast("No se pudo mandar la prueba"); }
      }
    });
    function cerrar(){ if (esNuevo) ROWS = ROWS.filter(function(x){ return x !== row; }); m.remove(); pintar(); }
    preview();
  }

  /* ---------- solapa "Mails" dentro de Mayoristas ---------- */
  function montar(){
    var main = document.querySelector("main#list"); if (!main) return;
    var top = main.querySelector(".my-top"), sw = top && top.querySelector(".pz-sw");
    if (!sw){ main.classList.remove("nvml-on"); MODO = false; var bx = document.getElementById("nvml"); if (bx) bx.remove(); return; }
    var b = sw.querySelector(".nvml-tab");
    if (!b){ b = document.createElement("button"); b.type = "button"; b.className = "nvml-tab"; b.textContent = "Mails"; sw.appendChild(b); }
    b.classList.toggle("on", MODO);
    main.classList.toggle("nvml-on", MODO);
    var box = document.getElementById("nvml");
    if (MODO){
      if (!box || box.parentNode !== main){ if (box) box.remove(); box = document.createElement("div"); box.id = "nvml"; top.after(box); if (ROWS) pintar(); else { pintar(); cargar().then(pintar); } }
    } else if (box) box.remove();
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("main#list .my-top .pz-sw button"); if (!b) return;
    var era = MODO; MODO = b.classList.contains("nvml-tab");
    if (MODO && !era && ROWS) cargar().then(pintar);
    setTimeout(montar, 0); setTimeout(montar, 200);
  }, true);
  try { SB().auth.getUser().then(function(r){ SOY = (r && r.data && r.data.user && r.data.user.email) || ""; }); } catch(e){}
  setInterval(function(){ try { if (!SOY && SB()) SB().auth.getUser().then(function(r){ SOY = (r && r.data && r.data.user && r.data.user.email) || ""; }); montar(); } catch(e){} }, 600);
})();
