/* ================= Facturación: ventas del mes por cuenta, factura C con vista previa, remito y mail al cliente ================= */
(function(){
  if (window.__nvFact) return; window.__nvFact = 1;
  var SB = window.__sb; if (!SB) return;
  (function(){ var st = document.createElement("style"); st.id = "nvf-css"; st.textContent = "\n/* ===================== Facturación ===================== */\nhtml:not(#nv) body.nvf-on .wrap > :not(header):not(.nvfp){display:none!important}\nhtml:not(#nv) body.nvf-on header.top #secTitle{display:none!important}\nhtml:not(#nv) .nvfp{display:none}\nhtml:not(#nv) body.nvf-on .nvfp{display:block;margin:0 auto;padding:2px 0 100px;font-family:Outfit,system-ui,sans-serif;color:#3B2418;animation:nvRise .3s cubic-bezier(.2,.8,.2,1) both}\nhtml:not(#nv) .nvf-cab{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:16px}\nhtml:not(#nv) .nvf-cab>div:first-child{flex:1;min-width:220px}\nhtml:not(#nv) .nvf-cab h1{margin:0;font-weight:500;font-size:28px;letter-spacing:-.01em}\nhtml:not(#nv) .nvf-cab p{margin:2px 0 0;color:#9A8274;font-size:13px;font-weight:300}\nhtml:not(#nv) .nvf-mes{display:flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:4px;box-shadow:0 1px 3px rgba(58,36,28,.07)}\nhtml:not(#nv) .nvf-mes button{border:0;background:#F5EFEA;width:30px;height:30px;border-radius:50%;cursor:pointer;color:#3B2418;font-size:16px}\nhtml:not(#nv) .nvf-mes span{min-width:120px;text-align:center;font-size:14px;text-transform:capitalize}\nhtml:not(#nv) .nvf-cfgbt,html:not(#nv) .nvf-link{border:0;background:#fff;border-radius:999px;padding:9px 16px;font-family:inherit;font-size:13px;color:#3B2418;cursor:pointer;box-shadow:0 1px 3px rgba(58,36,28,.08)}\nhtml:not(#nv) .nvf-link{background:#F5EFEA;box-shadow:none;margin-top:10px;padding:6px 12px}\nhtml:not(#nv) .nvf-topes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:16px}\nhtml:not(#nv) .nvf-tope{border-radius:22px;padding:16px 18px;box-shadow:0 1px 2px rgba(58,36,28,.04),0 8px 24px rgba(58,36,28,.06)}\nhtml:not(#nv) .nvf-tope.euge{background:linear-gradient(135deg,#FFF6F4,#F8E5E1)}\nhtml:not(#nv) .nvf-tope.pau{background:linear-gradient(135deg,#F3F8FB,#E2EEF5)}\nhtml:not(#nv) .nvf-toph{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}\nhtml:not(#nv) .nvf-toph b{font-size:18px;font-weight:500}\nhtml:not(#nv) .nvf-toph span{font-size:11.5px;color:#7A5E50;background:rgba(255,255,255,.7);border-radius:999px;padding:3px 10px}\nhtml:not(#nv) .nvf-ks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}\nhtml:not(#nv) .nvf-ks>div{background:rgba(255,255,255,.78);border-radius:14px;padding:9px 10px;min-width:0}\nhtml:not(#nv) .nvf-ks small{display:block;font-size:10.5px;color:#9A8274;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nhtml:not(#nv) .nvf-ks b{display:block;font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nhtml:not(#nv) .nvf-ks .pe b{color:#A2564C}\nhtml:not(#nv) .nvf-ks .ok b{color:#3E6B47}\nhtml:not(#nv) .nvf-ks .al b{color:#B5462F}\nhtml:not(#nv) .nvf-bar{height:8px;border-radius:8px;background:rgba(255,255,255,.8);margin-top:12px;overflow:hidden}\nhtml:not(#nv) .nvf-bar i{display:block;height:100%;border-radius:8px;background:#8DBB96;transition:width .4s}\nhtml:not(#nv) .nvf-bar.alto i{background:#D9897E}\nhtml:not(#nv) .nvf-aviso{margin:8px 0 0;font-size:12.5px;color:#A2564C}\nhtml:not(#nv) .nvf-fils{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}\nhtml:not(#nv) .nvf-seg{display:inline-flex;background:#F3EEEA;border-radius:14px;padding:3px;gap:2px}\nhtml:not(#nv) .nvf-seg button{border:0;background:transparent;border-radius:11px;padding:7px 12px;font-family:inherit;font-size:13px;color:#7A5E50;cursor:pointer;white-space:nowrap}\nhtml:not(#nv) .nvf-seg button.on{background:#fff;color:#3B2418;box-shadow:0 1px 3px rgba(58,36,28,.08)}\nhtml:not(#nv) .nvf-in{border:1px solid #EDE3DB;background:#FFFDFC;border-radius:10px;padding:8px 10px;font-family:inherit;font-size:13.5px;color:#3B2418;min-width:0;box-sizing:border-box}\nhtml:not(#nv) .nvf-in:focus{outline:0;border-color:#D9C2B4;box-shadow:0 0 0 3px rgba(217,194,180,.25)}\nhtml:not(#nv) .nvf-in:disabled{background:#F7F3F0;color:#7A5E50}\nhtml:not(#nv) .nvf-bus{flex:1;min-width:180px}\nhtml:not(#nv) .nvf-tb{background:#fff;border-radius:20px;box-shadow:0 1px 2px rgba(58,36,28,.04),0 8px 24px rgba(58,36,28,.06);overflow:auto}\nhtml:not(#nv) .nvf-tr{display:grid;grid-template-columns:88px 110px minmax(160px,1.4fr) 92px 110px 120px minmax(150px,1fr) 150px;gap:10px;align-items:center;padding:10px 16px;border-top:1px solid #F4EEE9;min-width:980px;font-size:13.5px}\nhtml:not(#nv) .nvf-tr>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\nhtml:not(#nv) .nvf-th{border-top:0;background:#FBF7F4;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#9A8274}\nhtml:not(#nv) .nvf-tr .m{font-weight:500;text-align:right}\nhtml:not(#nv) .nvf-tr .e{display:flex;gap:4px;flex-wrap:wrap;white-space:normal}\nhtml:not(#nv) .nvf-tr .a{text-align:right}\nhtml:not(#nv) .nvf-sel{padding:5px 8px;width:100%}\nhtml:not(#nv) .nvf-chip{font-style:normal;font-size:11.5px;border-radius:999px;padding:3px 9px;white-space:nowrap}\nhtml:not(#nv) .nvf-chip.pe{background:#F8E2DE;color:#A2564C}\nhtml:not(#nv) .nvf-chip.li{background:#FFF1DC;color:#8A5A1E}\nhtml:not(#nv) .nvf-chip.ok{background:#E3EFE3;color:#3E6B47}\nhtml:not(#nv) .nvf-chip.re{background:#E4EFF5;color:#4F7186}\nhtml:not(#nv) .nvf-bt{border:0;border-radius:999px;padding:10px 16px;font-family:inherit;font-size:13.5px;cursor:pointer;white-space:nowrap}\nhtml:not(#nv) .nvfp .nvf-bt.pri,html:not(#nv) .nvf-cap .nvf-bt.pri{background:#3B2418!important;color:#fff!important;text-transform:none!important;letter-spacing:0!important}\nhtml:not(#nv) .nvf-bt.pri:hover{background:#5A3A2A}\nhtml:not(#nv) .nvfp .nvf-bt.sec,html:not(#nv) .nvf-cap .nvf-bt.sec{background:#F5EFEA!important;color:#3B2418!important;text-transform:none!important;letter-spacing:0!important}\nhtml:not(#nv) .nvf-cap .nvf-bt.ter{background:transparent!important;color:#7A5E50!important;text-decoration:underline;text-transform:none!important;letter-spacing:0!important}\nhtml:not(#nv) .nvf-bt.mini{padding:7px 12px;font-size:12.5px}\nhtml:not(#nv) .nvf-vacio{background:#fff;border-radius:20px;padding:36px;text-align:center;color:#7A5E50;box-shadow:0 1px 2px rgba(58,36,28,.04)}\n/* editor */\nhtml:not(#nv) .nvf-cap{position:fixed;inset:0;z-index:210;background:rgba(40,26,18,.3);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .22s;font-family:Outfit,system-ui,sans-serif;color:#3B2418}\nhtml:not(#nv) .nvf-cap.on{opacity:1}\nhtml:not(#nv) .nvf-ed{background:#FBFAF9;width:min(1160px,96vw);max-height:92vh;display:flex;flex-direction:column;border-radius:26px;box-shadow:0 24px 70px rgba(58,36,28,.22);overflow:hidden}\nhtml:not(#nv) .nvf-edh{display:flex;align-items:center;gap:10px;padding:16px 20px 10px}\nhtml:not(#nv) .nvf-edh h2{flex:1;margin:0;font-size:20px;font-weight:500}\nhtml:not(#nv) .nvf-x{border:0;background:#F3EEEA;width:34px;height:34px;border-radius:50%;cursor:pointer;color:#7A5E50}\nhtml:not(#nv) .nvf-edb{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:18px;padding:0 20px 10px;overflow:auto}\nhtml:not(#nv) .nvf-edl h3{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#A48C7E;font-weight:400;margin:14px 2px 8px}\nhtml:not(#nv) .nvf-cu{display:flex;align-items:center;gap:6px;background:#fff;border-radius:14px;padding:6px;box-shadow:0 1px 2px rgba(58,36,28,.05)}\nhtml:not(#nv) .nvf-cu span{font-size:13px;color:#7A5E50;padding:0 8px}\nhtml:not(#nv) .nvf-cu button{flex:1;border:0;background:#F5EFEA;border-radius:10px;padding:9px;font-family:inherit;font-size:14px;cursor:pointer;color:#7A5E50}\nhtml:not(#nv) .nvf-cu button.on{background:#3B2418;color:#fff}\nhtml:not(#nv) .nvf-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}\nhtml:not(#nv) .nvf-fl{display:flex;flex-direction:column;gap:4px;min-width:0}\nhtml:not(#nv) .nvf-fl>span{font-size:11.5px;color:#9A8274}\nhtml:not(#nv) .nvf-ith,html:not(#nv) .nvf-it{display:grid;grid-template-columns:minmax(0,1fr) 54px 100px 72px 30px;gap:6px;align-items:center}\nhtml:not(#nv) .nvf-ith{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#A48C7E;padding:0 2px 4px}\nhtml:not(#nv) .nvf-its{display:flex;flex-direction:column;gap:6px}\nhtml:not(#nv) .nvf-in.c{text-align:center}\nhtml:not(#nv) .nvf-in.p{text-align:right}\nhtml:not(#nv) .nvf-del{border:0;background:transparent;color:#B49C8E;cursor:pointer;font-size:14px}\nhtml:not(#nv) .nvf-del:hover{color:#A2564C}\nhtml:not(#nv) .nvf-add{border:1px dashed #E2D4CA;background:transparent;border-radius:10px;padding:8px;font-family:inherit;font-size:13px;color:#7A5E50;cursor:pointer}\nhtml:not(#nv) .nvf-env{display:flex;align-items:center;gap:8px;margin-top:10px;background:#fff;border-radius:12px;padding:8px 10px;font-size:13.5px}\nhtml:not(#nv) .nvf-env .nvf-in{margin-left:auto;width:130px}\nhtml:not(#nv) .nvf-tot{display:flex;align-items:center;justify-content:space-between;margin-top:12px;background:#3B2418;color:#fff;border-radius:14px;padding:12px 16px}\nhtml:not(#nv) .nvf-tot b{font-size:20px;font-weight:500}\nhtml:not(#nv) .nvf-nota{font-size:12.5px;color:#9A8274;margin:8px 2px 0;line-height:1.4}\nhtml:not(#nv) .nvf-nota.ok{color:#3E6B47}\nhtml:not(#nv) .nvf-edr{display:flex;flex-direction:column;gap:10px;min-width:0}\nhtml:not(#nv) .nvf-edr .nvf-seg{align-self:flex-start;margin-top:12px}\nhtml:not(#nv) .nvf-prev{background:#EFE8E2;border-radius:18px;padding:14px;overflow:auto}\nhtml:not(#nv) .nvf-acc{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;padding:12px 20px 16px;border-top:1px solid #F0E8E2;background:#FBFAF9}\nhtml:not(#nv) .nvf-cfgc{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 20px 20px;overflow:auto}\nhtml:not(#nv) .nvf-cfgb{background:#fff;border-radius:18px;padding:14px 16px;display:flex;flex-direction:column;gap:9px}\nhtml:not(#nv) .nvf-cfgb h3{margin:0 0 4px;font-weight:500;font-size:17px}\nhtml:not(#nv) .nvf-toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);background:#3B2418;color:#fff;border-radius:999px;padding:10px 18px;font-family:Outfit,system-ui,sans-serif;font-size:13.5px;z-index:300;opacity:0;transition:all .25s;max-width:90vw;text-align:center}\nhtml:not(#nv) .nvf-toast.on{opacity:1;transform:translate(-50%,0)}\n@media (max-width:760px){\n  html:not(#nv) body.nvf-on .nvfp{padding:2px 10px 110px}\n  html:not(#nv) .nvf-cab h1{font-size:24px}\n  html:not(#nv) .nvf-topes{grid-template-columns:1fr}\n  html:not(#nv) .nvf-ks{grid-template-columns:1fr 1fr}\n  html:not(#nv) .nvf-fils{flex-direction:column;align-items:stretch}\n  html:not(#nv) .nvf-seg{display:flex;overflow-x:auto}\n  html:not(#nv) .nvf-seg button{flex:1}\n  html:not(#nv) .nvf-tb{background:transparent;box-shadow:none;overflow:visible}\n  html:not(#nv) .nvf-th{display:none}\n  html:not(#nv) .nvf-tr{min-width:0;grid-template-columns:1fr auto;grid-template-areas:\"c m\" \"n e\" \"cu a\";background:#fff;border-radius:18px;margin-bottom:10px;border:0;box-shadow:0 1px 2px rgba(58,36,28,.04),0 6px 16px rgba(58,36,28,.05);padding:12px 14px}\n  html:not(#nv) .nvf-tr .c{grid-area:c;font-weight:500}\n  html:not(#nv) .nvf-tr .m{grid-area:m}\n  html:not(#nv) .nvf-tr .n{grid-area:n;color:#9A8274;font-size:12px}\n  html:not(#nv) .nvf-tr .e{grid-area:e;justify-content:flex-end}\n  html:not(#nv) .nvf-tr .cu{grid-area:cu}\n  html:not(#nv) .nvf-tr .a{grid-area:a}\n  html:not(#nv) .nvf-tr .f,html:not(#nv) .nvf-tr .t{display:none}\n  html:not(#nv) .nvf-cap{align-items:flex-end}\n  html:not(#nv) .nvf-ed{width:100vw;max-height:94vh;border-radius:24px 24px 0 0}\n  html:not(#nv) .nvf-edb{grid-template-columns:1fr;padding:0 14px 10px}\n  html:not(#nv) .nvf-g,html:not(#nv) .nvf-cfgc{grid-template-columns:1fr}\n  html:not(#nv) .nvf-acc{padding:10px 14px calc(14px + env(safe-area-inset-bottom))}\n  html:not(#nv) .nvf-acc .nvf-bt{flex:1}\n}\n"; document.head.appendChild(st); })();
  var CUENTAS = [["euge", "Euge"], ["pau", "Pau"]];
  var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var NERVO = { mail: "nervodesigncordoba@gmail.com", tel: "+54 9 3518 62-2392", dir: "Córdoba Capital, CP 5000", web: "www.nervodesign.com", lema: "Tu casa, tu refugio." };
  (function(){ var s = document.createElement("style"); s.id = "nvtema-keep"; s.textContent = "html:not(#a) body .nvf-tot b{color:#fff !important}.nvf-tr .c small{display:block;font-size:11px;margin-top:2px;color:#8D827C}.nvf-tr .c small i{font-style:normal;padding:1px 6px;border-radius:4px;margin-left:4px}.nvf-tr .c small i.euge{background:#FCE4EE;color:#8E3C5E}.nvf-tr .c small i.pau{background:#E3EDF6;color:#46627B}"; document.head.append(s); })();
  var ARCA_LISTO = { euge: true }; /* cuentas con certificado ARCA conectado */
  var F = {}, CFG = {}, CARG = false, ESPERA = 0, MES = mesHoy(), FILTRO = "pend", TIPO = "todas", QUIEN = "todas", BUS = "";

  function h(t, c, x){ var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function plata(n){ n = Number(n) || 0; return "$ " + n.toLocaleString("es-AR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  function num(s){ if (typeof s === "number") return s; s = String(s || "").replace(/[^\d,.\-]/g, ""); if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, "").replace(",", "."); else s = s.replace(/[.,](?=\d{3}\b)/g, "").replace(",", "."); var n = parseFloat(s); return isNaN(n) ? 0 : n; }
  function mesHoy(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
  function fechaTx(f){ if (!f) return ""; var p = String(f).slice(0, 10).split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : f; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function soy(){ try { return window.__nv.S.soy; } catch(e){ return null; } }
  function toast(t){ var e = h("div", "nvf-toast", t); document.body.append(e); setTimeout(function(){ e.classList.add("on"); }, 10); setTimeout(function(){ e.classList.remove("on"); setTimeout(function(){ e.remove(); }, 300); }, 2600); }

  /* ---------- datos ---------- */
  function cargar(){
    return Promise.all([SB.from("facturas").select("*"), SB.from("fact_config").select("*")]).then(function(r){
      F = {}; (r[0].data || []).forEach(function(x){ F[x.id] = x; });
      CFG = {}; (r[1].data || []).forEach(function(x){ CFG[x.id] = x.datos || {}; });
      CARG = true;
    });
  }
  function guardarF(f){ f.cambiado = new Date().toISOString(); f.por = soy(); F[f.id] = f; return SB.from("facturas").upsert(f).then(function(r){ if (r.error) toast("No se pudo guardar: " + r.error.message); return r; }); }
  function guardarCfg(id, d){ CFG[id] = d; return SB.from("fact_config").upsert({ id: id, datos: d, cambiado: new Date().toISOString(), por: soy() }); }

  function datosCli(txt){
    var o = {}, s = String(txt || "");
    s.split(/\n/).forEach(function(l){ var m = l.match(/^\s*([A-Za-zÁÉÍÓÚáéíóúñ ]+)\s*:\s*(.+)$/); if (m) o[m[1].trim().toLowerCase()] = m[2].trim(); });
    var mail = o.mail || o.email || (s.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0];
    var dni = o.dni || o.cuit || o.cuil || (s.match(/\b\d{2}-?\d{8}-?\d\b/) || s.match(/\b\d{2}\.?\d{3}\.?\d{3}\b|\b\d{7}\b/) || [""])[0];
    var dir = o["dirección"] || o.direccion || o.domicilio || "";
    if (!dir && !Object.keys(o).length){ dir = s.split(/\n/).map(function(l){ return l.trim(); }).filter(function(l){ return l && /[a-záéíóúñ]/i.test(l) && !/@/.test(l) && !/^[\d\s+().-]+$/.test(l); }).join(", "); }
    return { nombre: o.nombre || "", doc: String(dni || "").replace(/\D/g, ""), email: String(mail || "").toLowerCase(), dir: dir, tel: o.celular || o.tel || o["teléfono"] || "" };
  }
  function itemsMin(v){
    var ps = (Array.isArray(v.prods) ? v.prods : String(v.prods || "").split(/\n/)).map(function(x){ return String(x).replace(/\s*·\s*/, " · "); }).map(function(x){ return x.trim(); }).filter(Boolean);
    var cs = (Array.isArray(v.cant) ? v.cant : String(v.cant || "").split(/\n/)).map(function(x){ return num(String(x).replace(/\[.?\]/g, "")) || 1; });
    if (!ps.length) ps = ["Productos Nervo Design"];
    /* el envío ya está sumado en el monto a facturar: se descuenta de los productos y va en su propia línea */
    var tot = (num(v.facturar) || num(v.cobrado) || 0) - (num(v.costoEnv) > 0 ? num(v.costoEnv) : 0);
    var u = ps.reduce(function(a, _, i){ return a + (cs[i] || 1); }, 0) || 1;
    var unit = Math.floor((tot / u) * 100) / 100, acc = 0;
    return ps.map(function(p, i){ var c = cs[i] || 1; var pr = i === ps.length - 1 ? Math.round(((tot - acc) / c) * 100) / 100 : unit; acc += pr * c; return { d: p, c: c, p: pr }; });
  }
  function itemsMay(v){
    var ls = (Array.isArray(v.pedido) ? v.pedido : String(v.pedido || "").split(/\n|,(?=\s*\*)/)).map(function(x){ return x.trim(); }).filter(Boolean);
    var tot = num(v.sena) + num(v.saldo);
    var it = ls.map(function(l){ var m = l.match(/^\*?\s*(\d+)\s*[x×]?\s*(.+)$/i); return m ? { d: m[2].trim(), c: Number(m[1]), p: 0 } : { d: l.replace(/^\*\s*/, ""), c: 1, p: 0 }; });
    if (!it.length) it = [{ d: "Pedido mayorista", c: 1, p: 0 }];
    var u = it.reduce(function(a, x){ return a + x.c; }, 0) || 1, unit = Math.floor((tot / u) * 100) / 100, acc = 0;
    it.forEach(function(x, i){ x.p = i === it.length - 1 ? Math.round(((tot - acc) / x.c) * 100) / 100 : unit; acc += x.p * x.c; });
    return it;
  }
  function ventas(){
    var B = window.__nv && window.__nv.S && window.__nv.S.bzData; if (!B) return null;
    var S = window.__nv.S, out = [];
    (B.min || []).forEach(function(v){
      if (!v.fecha || String(v.fecha).slice(0, 7) !== MES) return;
      if (/PENDIENTE DE REVISAR|CANCELAD/i.test(v.env || "")) return;
      var c = datosCli(v.datos), cu = /PAU/i.test(v.cobro || "") ? "pau" : /EUGE/i.test(v.cobro || "") ? "euge" : "";
      out.push({ id: "min:" + v.id, origen: "min", v: v, num: v.num || v.venta || "", fecha: v.fecha, cliente: v.cliente || c.nombre, cuenta: cu, monto: num(v.facturar) || num(v.cobrado), envio: num(v.costoEnv), cli: c, items: itemsMin });
    });
    (B.may || []).forEach(function(v){
      if (!v.fecha || String(v.fecha).slice(0, 7) !== MES) return;
      if (/CANCELAD/i.test(v.estado || "")) return;
      var mc = (S.mayclientes || []).find(function(x){ return x.nombre && v.cliente && x.nombre.trim().toLowerCase() === String(v.cliente).trim().toLowerCase(); }) || {};
      out.push({ id: "may:" + v.id, origen: "may", v: v, num: "MAY", fecha: v.fecha, cliente: v.cliente || "", cuenta: "", monto: num(v.sena) + num(v.saldo), envio: 0, cli: (function(){ var dc = datosCli(mc.datos); return { nombre: v.cliente || "", doc: dc.doc, email: (mc.email || dc.email || "").toLowerCase(), dir: mc.ciu || dc.dir || "", tel: mc.tel || dc.tel || "" }; })(), items: itemsMay });
    });
    out.sort(function(a, b){ return String(b.fecha).localeCompare(String(a.fecha)); });
    return out;
  }
  function filaF(x){
    var f = F[x.id];
    if (!f){
      f = { id: x.id, origen: x.origen, venta_id: x.v.id, mes: MES, cuenta: x.cuenta || "", estado: "borrador",
        datos: { fecha: x.fecha, num: x.num, cliente: { nombre: x.cliente || x.cli.nombre, doc: x.cli.doc, email: x.cli.email, dir: x.cli.dir, cond: "Consumidor Final" }, items: x.items(x.v), envio: x.envio > 0 ? x.envio : 0, conEnvio: x.envio > 0 } };
    }
    return f;
  }
  /* descuento por producto: "10%" o un monto en $ sobre ese renglón (nunca sobre el envío) */
  function dsLinea(i){ var b = (Number(i.c) || 0) * (Number(i.p) || 0), s = String(i.ds || "").trim(); if (!s) return 0; var x = /%/.test(s) ? b * num(s) / 100 : num(s); return Math.round(Math.max(0, Math.min(b, x)) * 100) / 100; }
  function netoLinea(i){ return Math.round(((Number(i.c) || 0) * (Number(i.p) || 0) - dsLinea(i)) * 100) / 100; }
  function brutoDe(f){ var d = f.datos || {}; var t = (d.items || []).reduce(function(a, i){ return a + netoLinea(i); }, 0); if (d.conEnvio) t += Number(d.envio) || 0; return Math.round(t * 100) / 100; }
  function descDe(f){ return 0; } /* el descuento va por producto */
  function totalDe(f){ return Math.round((brutoDe(f) - descDe(f)) * 100) / 100; }
  function emitidasAnio(cu){ var y = new Date().getFullYear() + "-"; var t = 0; Object.keys(F).forEach(function(k){ var f = F[k]; if (f.cuenta === cu && f.estado === "emitida" && !f.nc && String(f.emitida_at || "").slice(0, 5) === y) t += Number(f.total) || 0; }); return t; }
  function emitidasMes(cu){ var t = 0; Object.keys(F).forEach(function(k){ var f = F[k]; if (f.cuenta === cu && f.estado === "emitida" && !f.nc && f.mes === MES) t += Number(f.total) || 0; }); return t; }

  /* ---------- documento (factura / remito) ---------- */
  /* QR oficial de ARCA (se arma en la compu, no se manda a terceros) */
  (function(){ if (window.qrcode || document.getElementById("nvqrlib")) return; var s = document.createElement("script"); s.id = "nvqrlib"; s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"; document.head.append(s); })();
  var EMISOR_DEF = { euge: { razon: "ABDON MARIA EUGENIA", cuit: "27-37852403-8", dom: "La Pampa 1861 · Barrio Bella Vista · Córdoba" } };
  var NLOGO = "M432 411C439 410 447 409 450 408C460 406 491 390 491 387C491 385 490 386 485 389C466 400 438 404 415 401C368 393 329 357 315 308C307 280 306 269 305 199C304 140 304 129 300 112C290 57 254 18 208 12C166 7 129 24 105 59C98 69 98 69 98 48C97 24 95 11 92 13C88 15 54 30 53 30C52 30 48 31 43 33C35 35 22 38 15 38C11 38 9 40 10 42C11 42 14 43 17 43C37 45 46 58 49 86C50 98 50 274 49 298C47 327 41 339 27 342C24 342 23 343 23 344C24 346 34 347 65 347C78 347 89 348 89 348C90 348 93 348 96 348C99 347 106 347 110 346C115 346 120 346 121 345C123 345 122 342 118 341C108 339 102 331 99 316C98 307 97 115 99 101C101 85 108 64 113 59C116 56 117 54 116 54C115 54 124 45 132 39C138 34 143 31 148 30C152 29 158 27 161 26C166 25 187 26 193 28C202 31 212 37 216 41C219 43 221 45 223 46C230 52 239 68 245 86C253 109 254 121 255 190C256 220 256 247 256 248C257 250 257 255 258 260C261 286 269 310 281 332C289 347 290 348 292 351C294 352 297 356 299 359C316 382 358 407 385 410C387 410 390 410 391 410C392 411 395 411 398 412C402 412 405 412 405 412C405 413 424 412 432 411ZM469 300C489 290 489 261 469 251C448 241 425 266 436 288C443 300 457 306 469 300Z";
  function qrHTML(o){
    if (!window.qrcode) return '<div style="width:96px;height:96px;border:1px dashed #DDD5CF;font-size:9px;color:#A29A95;display:flex;align-items:center;justify-content:center;text-align:center">QR</div>';
    var q = window.qrcode(0, "M"); q.addData("https://www.afip.gob.ar/fe/qr/?p=" + btoa(JSON.stringify(o))); q.make();
    return q.createTableTag(2, 0);
  }
  function docHTML(f, tipo, paraMail){
    var d = f.datos || {}, c = d.cliente || {}, cfg = Object.assign({}, EMISOR_DEF[f.cuenta] || {}, CFG[f.cuenta] || {});
    var esNC = tipo === "nc", esFac = tipo === "factura" || esNC, cb = esNC ? (f.nc || {}) : f;
    var emit = esNC ? !!cb.cae : (esFac && f.estado === "emitida");
    var INK = "#2B201C", MUT = "#8D827C", LIN = "#ECE5E0", MOKA = "#6B5047";
    var pv = cb.pv || f.pv || cfg.ptoVta || 5;
    var nro = esFac ? (cb.nro ? String(pv).padStart(5, "0") + "-" + String(cb.nro).padStart(8, "0") : "Se asigna al emitir") : "R-" + String(f.remito_nro || siguienteRemito()).padStart(6, "0");
    var fch = esFac && cb.fecha ? cb.fecha.slice(6, 8) + "/" + cb.fecha.slice(4, 6) + "/" + cb.fecha.slice(0, 4) : fechaTx(esFac && f.emitida_at ? f.emitida_at : d.fecha);
    var titulo = esNC ? "NOTA DE CRÉDITO" : esFac ? "FACTURA" : "REMITO";
    var logo = paraMail || !NLOGO ? '<img src="https://nervodesign.github.io/tablero-nervo/img/n-logo.png" width="44" height="38" alt="n." style="display:block;border:0;width:44px;height:38px">' : '<svg viewBox="0 0 501 425" width="46" height="39" style="display:block"><path fill="' + INK + '" d="' + NLOGO + '"/></svg>';
    var lbl = function(t){ return '<div style="font-size:' + (paraMail ? '8.5px' : '9.5px') + ';letter-spacing:.18em;color:' + MOKA + ';margin-bottom:6px">' + t + '</div>'; };
    var celda = "padding:9px 4px;border-bottom:1px solid " + LIN + ";"; var nw = "white-space:nowrap;";
    var filas = (d.items || []).map(function(i){ var dl = dsLinea(i); return '<tr><td style="' + celda + '">' + esc(i.d) + (dl ? '<div style="font-size:10.5px;color:' + MUT + ';margin-top:2px">Descuento ' + (/%/.test(String(i.ds)) ? esc(String(i.ds).replace(/\s/g, "")) + ' ' : '') + '(− ' + plata(dl) + ')</div>' : '') + '</td><td style="' + celda + 'text-align:center;color:' + MUT + '">' + esc(i.c) + '</td><td style="' + celda + nw + 'text-align:right;color:' + MUT + '">' + plata(i.p) + '</td><td style="' + celda + nw + 'text-align:right">' + plata(netoLinea(i)) + '</td></tr>'; }).join("");
    if (d.conEnvio && Number(d.envio)) filas += '<tr><td style="' + celda + '">Envío</td><td style="' + celda + 'text-align:center;color:' + MUT + '">1</td><td style="' + celda + nw + 'text-align:right;color:' + MUT + '">' + plata(d.envio) + '</td><td style="' + celda + nw + 'text-align:right">' + plata(d.envio) + '</td></tr>';
    var dsc = descDe(f); if (dsc) filas += '<tr><td style="' + celda + '">Descuento' + (Number(d.descPct) ? ' ' + esc(d.descPct) + '%' : '') + '</td><td style="' + celda + 'text-align:center;color:' + MUT + '"></td><td style="' + celda + nw + 'text-align:right;color:' + MUT + '"></td><td style="' + celda + nw + 'text-align:right">− ' + plata(dsc) + '</td></tr>';
    var total = esNC ? (Number(cb.total) || totalDe(f)) : totalDe(f);
    var emisor = esFac
      ? '<b style="font-weight:500">' + esc(cfg.razon || "—") + '</b><br>CUIT ' + esc(cfg.cuit || "—") + '<br>Responsable Monotributo<br>' + esc(cfg.dom || NERVO.dir) + (cfg.iibb ? '<br>IIBB ' + esc(cfg.iibb) : '') + (cfg.inicio ? '<br>Inicio de actividades ' + esc(fechaTx(cfg.inicio)) : '')
      : '<b style="font-weight:500">Nervo Design</b><br><span style="white-space:nowrap">' + NERVO.mail + '</span><br><span style="white-space:nowrap">' + NERVO.tel + '</span><br>' + NERVO.dir;
    var docC = String(c.doc || "").replace(/\D/g, "");
    var cliente = '<b style="font-weight:500">' + esc(c.nombre || "—") + '</b>' + (docC ? '<br>' + (docC.length > 8 ? "CUIT " : "DNI ") + esc(c.doc) : '') + '<br>' + esc(c.cond || "Consumidor Final") + (c.email ? '<br><span style="white-space:nowrap">' + esc(c.email) + '</span>' : '') + (c.dir ? '<br>' + esc(c.dir) : '');
    var letra = esFac
      ? '<div style="display:inline-block;border:1px solid ' + MOKA + ';width:44px;height:44px;line-height:44px;text-align:center;font-size:24px;color:' + MOKA + '">C</div><div style="font-size:8.5px;letter-spacing:.14em;color:' + MUT + ';margin-top:5px">COD. ' + (esNC ? "013" : "011") + '</div>'
      : '<div style="display:inline-block;border:1px solid ' + LIN + ';width:44px;height:44px;line-height:44px;text-align:center;font-size:24px;color:' + MUT + '">X</div><div style="font-size:8.5px;letter-spacing:.1em;color:' + MUT + ';margin-top:5px">NO VÁLIDO<br>COMO FACTURA</div>';
    var aviso = esFac && !emit ? '<div style="margin:0 0 22px;padding:9px 12px;border:1px solid ' + LIN + ';color:' + MUT + ';font-size:11.5px;text-align:center;letter-spacing:.02em">Vista previa · el número, el CAE y el QR aparecen al emitir</div>' : '';
    var ref = esNC && f.nro ? '<div style="margin-top:14px;font-size:12px;color:' + MUT + '">Anula la Factura C N° ' + String(f.pv || pv).padStart(5, "0") + "-" + String(f.nro).padStart(8, "0") + '</div>' : '';
    var pie;
    if (esFac && emit){
      var cuitN = Number(String(cfg.cuit || "").replace(/\D/g, ""));
      var qr = qrHTML({ ver: 1, fecha: cb.fecha ? cb.fecha.slice(0, 4) + "-" + cb.fecha.slice(4, 6) + "-" + cb.fecha.slice(6, 8) : String(f.emitida_at || "").slice(0, 10), cuit: cuitN, ptoVta: Number(pv), tipoCmp: esNC ? 13 : 11, nroCmp: Number(cb.nro), importe: total, moneda: "PES", ctz: 1, tipoDocRec: Number(f.doc_tipo || 99), nroDocRec: Number(f.doc_nro || 0), tipoCodAut: "E", codAut: Number(cb.cae) });
      pie = '<table style="width:100%;border-collapse:collapse;margin-top:26px;border-top:1px solid ' + LIN + '"><tr><td style="padding-top:16px;width:110px;vertical-align:top">' + qr + '</td><td style="padding:16px 0 0 14px;vertical-align:top;font-size:11.5px;line-height:1.7;color:' + MUT + '"><span style="color:' + INK + '">CAE ' + esc(cb.cae) + '</span><br>Vencimiento del CAE ' + esc(fechaTx(cb.cae_vto)) + '<br>Comprobante autorizado por ARCA</td></tr></table>';
    } else if (!esFac){
      pie = '<div style="margin-top:24px;padding-top:14px;border-top:1px solid ' + LIN + ';font-size:11.5px;color:' + MUT + '">Documento no válido como factura.</div>';
    } else pie = '';
    var marca = '<div style="font-size:10.5px;letter-spacing:.14em;margin-top:10px;white-space:nowrap">NERVO DESIGN</div><div style="font-size:8.5px;letter-spacing:.12em;color:' + MUT + ';margin-top:3px;white-space:nowrap">ILUMINACIÓN &amp; DECO</div>';
    var nroTx = '<div style="font-size:' + (paraMail ? '13px' : '15px') + ';margin-top:8px;white-space:nowrap">N° ' + esc(nro) + '</div><div style="font-size:11.5px;color:' + MUT + ';margin-top:2px;white-space:nowrap">Fecha ' + esc(fch) + '</div>';
    if (paraMail){
      var badge = esFac ? '<span style="display:inline-block;border:1px solid ' + MOKA + ';color:' + MOKA + ';font-size:12px;line-height:20px;width:22px;text-align:center;margin-left:8px;vertical-align:middle">C</span>' : '';
      var cod = esFac ? '<div style="font-size:9px;letter-spacing:.1em;color:' + MUT + ';margin-top:4px;white-space:nowrap">COD. ' + (esNC ? "013" : "011") + '</div>' : '<div style="font-size:9px;letter-spacing:.06em;color:' + MUT + ';margin-top:4px;white-space:nowrap">No válido como factura</div>';
      var col = function(t, x, izq){ return '<td style="vertical-align:top;width:50%;font-size:11px;line-height:1.55;' + (izq ? 'padding:12px 8px 12px 0' : 'padding:12px 0 12px 10px;border-left:1px solid ' + LIN) + '">' + lbl(t) + x + '</td>'; };
      return '<div style="font-family:Helvetica,Arial,sans-serif;color:' + INK + ';max-width:600px;margin:0 auto;background:#fff;padding:22px 16px 18px;font-size:12px;line-height:1.5">' + aviso +
        '<table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:top">' + logo + marca + '</td>' +
        '<td style="vertical-align:top;text-align:right"><div style="font-size:11px;letter-spacing:.14em;white-space:nowrap">' + titulo + badge + '</div>' + cod + nroTx + '</td></tr></table>' + ref +
        '<table style="width:100%;border-collapse:collapse;margin-top:20px;border-top:1px solid ' + LIN + ';border-bottom:1px solid ' + LIN + '"><tr>' + col(esFac ? "EMISOR" : "DE", emisor, true) + col("CLIENTE", cliente) + '</tr></table>' +
        cuerpo();
    }
    return '<div style="font-family:Outfit,Helvetica,Arial,sans-serif;color:' + INK + ';max-width:680px;margin:0 auto;background:#fff;padding:34px 36px 26px;border:1px solid ' + LIN + ';font-size:12.5px;line-height:1.55">' + aviso +
      '<table style="width:100%;border-collapse:collapse"><tr>' +
        '<td style="vertical-align:top;width:38%">' + logo + marca + '</td>' +
        '<td style="vertical-align:top;text-align:center;width:24%">' + letra + '</td>' +
        '<td style="vertical-align:top;text-align:right;width:38%"><div style="font-size:11px;letter-spacing:.18em;white-space:nowrap">' + titulo + '</div>' + nroTx + '</td>' +
      '</tr></table>' + ref +
      '<table style="width:100%;border-collapse:collapse;margin-top:24px;border-top:1px solid ' + LIN + ';border-bottom:1px solid ' + LIN + '"><tr><td style="vertical-align:top;width:50%;padding:16px 16px 16px 0">' + lbl(esFac ? "EMISOR" : "DE") + emisor + '</td><td style="vertical-align:top;padding:16px 0 16px 16px;border-left:1px solid ' + LIN + '">' + lbl("CLIENTE") + cliente + '</td></tr></table>' +
      cuerpo();
    function cuerpo(){ return '<table style="width:100%;border-collapse:collapse;margin-top:18px;font-size:' + (paraMail ? '11.5px' : '12.5px') + '"><tr style="font-size:9.5px;letter-spacing:.16em;color:' + MUT + ';text-align:left"><th style="padding:0 4px 8px;font-weight:400;border-bottom:1px solid ' + INK + '">DETALLE</th><th style="padding:0 4px 8px;font-weight:400;text-align:center;border-bottom:1px solid ' + INK + '">CANT.</th><th style="padding:0 4px 8px;font-weight:400;text-align:right;border-bottom:1px solid ' + INK + '">PRECIO</th><th style="padding:0 4px 8px;font-weight:400;text-align:right;border-bottom:1px solid ' + INK + '">SUBTOTAL</th></tr>' + filas + '</table>' +
      '<table style="width:100%;border-collapse:collapse;margin-top:14px"><tr><td></td><td style="width:240px;padding:12px 4px 0;border-top:1px solid ' + INK + ';text-align:right"><span style="font-size:9.5px;letter-spacing:.18em;color:' + MUT + ';margin-right:14px">TOTAL</span><span style="font-size:' + (paraMail ? '17px' : '20px') + ';white-space:nowrap;color:' + MOKA + '">' + plata(total) + '</span></td></tr></table>' +
      pie +
      '<div style="margin-top:22px;font-size:10.5px;letter-spacing:.06em;color:' + MUT + ';text-align:center">' + NERVO.web + ' · ' + NERVO.lema + '</div></div>'; }
  }
  function siguienteRemito(){ var m = 0; Object.keys(F).forEach(function(k){ m = Math.max(m, Number(F[k].remito_nro) || 0); }); return m + 1; }
  function mailHTML(f, tipo){
    var c = (f.datos || {}).cliente || {}, nom = String(c.nombre || "").split(" ")[0] || "";
    var intro = tipo === "factura" ? "Te enviamos la factura de tu compra." : tipo === "nc" ? "Te enviamos la nota de crédito que anula tu factura." : "Te enviamos el remito de tu compra.";
    return '<div style="background:#4A3630;padding:22px 10px;font-family:Helvetica,Arial,sans-serif;color:#fff"><div style="max-width:600px;margin:0 auto 14px;font-size:13px;line-height:1.6;padding:0 4px">Hola ' + esc(nom) + '! Gracias por elegirnos 🤍<br>' + intro + '<br>Cualquier consulta, escribinos al <span style="white-space:nowrap">' + NERVO.tel + '</span>.</div>' + docHTML(f, tipo, true) + '</div>';
  }
  window.__nvfDemo = { doc: function(f, t){ return docHTML(f, t, false); }, mail: function(f, t){ return mailHTML(f, t); } };
  function mandar(f, tipo){
    var c = (f.datos || {}).cliente || {};
    if (!/@/.test(c.email || "")) { toast("Falta el mail del cliente"); return Promise.reject(); }
    var asunto = tipo === "factura" ? "Tu factura · Nervo Design" : tipo === "nc" ? "Nota de crédito · Nervo Design" : "Tu compra en Nervo Design · Remito";
    var texto = "Hola " + (String(c.nombre || "").split(" ")[0] || "") + "! Gracias por elegirnos. " + (tipo === "factura" ? "Te enviamos la factura de tu compra." : "Te enviamos el remito de tu compra.");
    return new Promise(function(ok, ko){
      google.script.run.withSuccessHandler(function(r){ if (r && (r.ok || []).length){ ok(r); } else ko(r); }).withFailureHandler(ko)
        .mandarMails(JSON.stringify({ asunto: asunto, fotos: [], para: [{ id: f.id, email: c.email, html: mailHTML(f, tipo), texto: texto }] }));
    });
  }
  /* al emitir: avisa en el chat "Facturas", manda copia a Nervo y marca la venta como facturada */
  var MAIL_COPIA = "nervodesigncordoba@gmail.com";
  function avisarFactura(f){
    var d = f.datos || {}, c = d.cliente || {}, n = String(f.pv || 5).padStart(5, "0") + "-" + String(f.nro).padStart(8, "0"), quien = f.cuenta === "pau" ? "Pau" : "Euge";
    var tx = "🧾 Factura C " + n + " · " + (c.nombre || "") + " · " + plata(f.total) + (d.num ? " · " + d.num : "") + " · emitida por " + quien;
    try { window.__nvLocal.chatEnviar([{ canal: "fac", texto: tx, por: soy() || f.cuenta }]); } catch(e){}
    try { google.script.run.withFailureHandler(function(){ toast("No se pudo mandar la copia a " + MAIL_COPIA); }).mandarMails(JSON.stringify({ asunto: "Factura emitida " + n + " · " + (c.nombre || ""), fotos: [], para: [{ id: f.id, email: MAIL_COPIA, html: mailHTML(f, "factura"), texto: tx }] })); } catch(e){}
    try { var tb = f.origen === "may" ? "base_may" : "base_min", campo = f.origen === "may" ? "facturas" : "factN"; if (f.venta_id){ var x = { id: f.venta_id, cambiado: Date.now(), por: soy() }; x[campo] = "C " + n; google.script.run.baseGuardarVarios(tb, [x]); } } catch(e){}
  }
  function imprimir(f, tipo){
    var w = window.open("", "_blank"); if (!w) { toast("Permití ventanas emergentes para descargar el PDF"); return; }
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + (tipo === "factura" ? "Factura" : tipo === "nc" ? "Nota de credito" : "Remito") + ' Nervo Design</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet"><style>body{margin:0;padding:24px;background:#fff}@media print{body{padding:0}}</style></head><body>' + docHTML(f, tipo, false) + '<script>setTimeout(function(){print()},600)<\/script></body></html>');
    w.document.close();
  }

  /* ---------- confirmar y emitir en ARCA (solo a mano, con PIN) ---------- */
  function confirmarEmision(f, cerrarEditor, modo){
    var esNC = modo === "nc";
    var d = f.datos || {}, c = d.cliente || {};
    var cap = h("div", "nvf-cap nvf-conf"), p = h("div", "nvf-ed"); cap.append(p);
    p.style.maxWidth = "460px"; p.style.padding = "22px";
    function cerrar(){ cap.classList.remove("on"); setTimeout(function(){ cap.remove(); }, 220); }
    cap.onclick = function(e){ if (e.target === cap && !enviando) cerrar(); };
    p.append(h("h3", null, esNC ? "Revisá antes de anular" : "Revisá antes de emitir"));
    var doc = String(c.doc || "").replace(/\D/g, "");
    var lineas = [
      esNC ? ["Anula", "Factura C N° " + String(f.pv || 5).padStart(5, "0") + "-" + String(f.nro).padStart(8, "0") + " con una Nota de Crédito C"] : ["Factura", "C · punto de venta 5 · a nombre de " + (f.cuenta === "pau" ? "Pau" : "Euge")],
      ["Cliente", (c.nombre || "—") + (doc ? (doc.length > 8 ? " · CUIT " : " · DNI ") + doc : "")],
      ["Condición", c.cond || "Consumidor Final"],
      ["Productos", (d.items || []).map(function(i){ return (i.c || 1) + " × " + (i.d || "—"); }).join(", ") + (d.conEnvio && Number(d.envio) ? " + envío" : "")],
      ["Total", plata(f.total)],
      ["Fecha", "Hoy"]
    ];
    var tb = h("div"); tb.style.cssText = "display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:13.5px;margin:12px 0 16px";
    lineas.forEach(function(l){ var a = h("span", null, l[0]); a.style.color = "#8A8380"; var b = h("b", null, l[1]); b.style.fontWeight = "500"; tb.append(a, b); });
    p.append(tb);
    var av = h("p", null, esNC ? "Al confirmar, se emite la nota de crédito en ARCA y la factura queda anulada. No se puede deshacer." : "Al confirmar, la factura se emite en ARCA y no se puede deshacer."); av.style.cssText = "font-size:12.5px;color:#8E3C5E;background:#FCE4EE;padding:8px 10px;border-radius:6px;margin:0 0 12px";
    p.append(av);
    var lab = h("label", "nvf-fl"); lab.append(h("span", null, "PIN de facturación"));
    var pin = h("input", "nvf-in"); pin.type = "password"; pin.inputMode = "numeric"; pin.autocomplete = "off"; lab.append(pin); p.append(lab);
    var acc = h("div", "nvf-acc"); acc.style.marginTop = "14px";
    var bc = h("button", "nvf-bt sec", "Cancelar"); bc.type = "button"; bc.onclick = function(){ if (!enviando) cerrar(); };
    var be = h("button", "nvf-bt pri", esNC ? "Confirmar y anular" : "Confirmar y emitir"); be.type = "button";
    var enviando = false;
    be.onclick = function(){
      if (enviando) return;
      if (!pin.value){ toast("Poné el PIN de facturación"); pin.focus(); return; }
      enviando = true; be.disabled = true; bc.disabled = true; be.textContent = esNC ? "Anulando en ARCA…" : "Emitiendo en ARCA…";
      SB.functions.invoke("arca", { body: { accion: esNC ? "nc" : "emitir", cuenta: f.cuenta, factura_id: f.id, total: f.total, doc: doc, cond: c.cond || "Consumidor Final", pin: pin.value, por: soy() || "" } }).then(function(r){
        var res = r && r.data;
        if (!res && r && r.error && r.error.context && r.error.context.json) return r.error.context.json().then(function(j){ return { data: j }; });
        return r;
      }).then(function(r){
        var res = (r && r.data) || {};
        if (!res.ok){ throw new Error(res.error || "No se pudo emitir"); }
        if (esNC){ f.nc = { pv: res.pv, nro: res.nro, cae: res.cae, cae_vto: res.cae_vto, fecha: res.fecha, total: res.total, at: new Date().toISOString(), por: soy() || "" }; }
        else { f.estado = "emitida"; f.pv = res.pv; f.nro = res.nro; f.cae = res.cae; f.cae_vto = res.cae_vto; f.fecha = res.fecha; f.doc_tipo = res.doc_tipo; f.doc_nro = res.doc_nro; f.emitida_at = f.emitida_at || new Date().toISOString(); }
        return guardarF(f).then(function(rg){
          if (rg && rg.error){ alert("OJO: la factura SE EMITIÓ en ARCA (N° " + res.pv + "-" + res.nro + ") pero el tablero no la pudo guardar. NO la vuelvas a facturar y avisá para revisarla."); }
          if (!esNC) avisarFactura(f);
          cerrar(); if (cerrarEditor) cerrarEditor();
          toast((esNC ? "Nota de crédito emitida ✓ N° " : "Factura emitida ✓ N° ") + String(res.pv).padStart(5, "0") + "-" + String(res.nro).padStart(8, "0"));
          pintar();
        });
      }).catch(function(e){
        enviando = false; be.disabled = false; bc.disabled = false; be.textContent = esNC ? "Confirmar y anular" : "Confirmar y emitir";
        toast(String((e && e.message) || e || "No se pudo emitir").slice(0, 160));
      });
    };
    acc.append(bc, be); p.append(acc);
    document.body.append(cap); requestAnimationFrame(function(){ cap.classList.add("on"); pin.focus(); });
  }

  /* ---------- editor de una venta ---------- */
  function editor(x){
    var f = JSON.parse(JSON.stringify(filaF(x))), d = f.datos;
    if (x.cli && d && d.cliente){ if (!d.cliente.email && x.cli.email) d.cliente.email = x.cli.email; if (!d.cliente.doc && x.cli.doc) d.cliente.doc = x.cli.doc; if (!d.cliente.dir && x.cli.dir) d.cliente.dir = x.cli.dir; }
    var cap = h("div", "nvf-cap"), p = h("div", "nvf-ed"); cap.append(p);
    function cerrar(){ cap.classList.remove("on"); setTimeout(function(){ cap.remove(); }, 220); }
    cap.onclick = function(e){ if (e.target === cap) cerrar(); };
    var emitida = f.estado === "emitida";
    function campo(lab, val, set, tipo){ var w = h("label", "nvf-fl"); w.append(h("span", null, lab)); var i = h("input", "nvf-in"); i.type = tipo || "text"; i.value = val == null ? "" : val; i.disabled = emitida; i.oninput = function(){ set(i.value); pintarPrev(); }; w.append(i); return w; }
    var prev = h("div", "nvf-prev"), tg = h("div", "nvf-seg");
    var vista = "factura";
    [["factura", "Factura"], ["remito", "Remito"]].concat(f.nc ? [["nc", "Nota de crédito"]] : []).forEach(function(o){ var b = h("button", o[0] === vista ? "on" : "", o[1]); b.type = "button"; b.onclick = function(){ vista = o[0]; tg.querySelectorAll("button").forEach(function(z){ z.classList.toggle("on", z === b); }); pintarPrev(); }; tg.append(b); });
    function pintarPrev(){ prev.innerHTML = docHTML(f, vista, false); tot.textContent = plata(totalDe(f)); if (tfi && document.activeElement !== tfi) tfi.value = plata(totalDe(f)); }
    var cab = h("div", "nvf-edh"); cab.append(h("h2", null, (x.num || "Venta") + " · " + (x.cliente || "")), h("button", "nvf-x", "✕")); cab.lastChild.onclick = cerrar;
    var izq = h("div", "nvf-edl"), der = h("div", "nvf-edr");
    /* cuenta */
    var cu = h("div", "nvf-cu"); cu.append(h("span", null, "Factura"));
    CUENTAS.forEach(function(o){ var b = h("button", f.cuenta === o[0] ? "on" : "", o[1]); b.type = "button"; b.disabled = emitida; b.onclick = function(){ f.cuenta = o[0]; cu.querySelectorAll("button").forEach(function(z){ z.classList.toggle("on", z === b); }); pintarPrev(); }; cu.append(b); });
    izq.append(cu);
    izq.append(h("h3", null, "Cliente"));
    var g = h("div", "nvf-g");
    g.append(campo("Nombre y apellido", d.cliente.nombre, function(v){ d.cliente.nombre = v; }), campo("DNI / CUIT", d.cliente.doc, function(v){ d.cliente.doc = v.replace(/\D/g, ""); }), campo("Mail", d.cliente.email, function(v){ d.cliente.email = v.trim(); }, "email"), campo("Domicilio", d.cliente.dir, function(v){ d.cliente.dir = v; }));
    izq.append(g);
    izq.append(h("h3", null, "Productos"));
    var lis = h("div", "nvf-its");
    function pintarItems(){
      lis.innerHTML = "";
      d.items.forEach(function(it, i){
        var r = h("div", "nvf-it");
        var a = h("input", "nvf-in"); a.value = it.d; a.placeholder = "Producto"; a.disabled = emitida; a.oninput = function(){ it.d = a.value; pintarPrev(); };
        var b = h("input", "nvf-in c"); b.type = "number"; b.min = "1"; b.value = it.c; b.disabled = emitida; b.oninput = function(){ it.c = Number(b.value) || 0; pintarPrev(); };
        var c = h("input", "nvf-in p"); c.inputMode = "decimal"; c.value = it.p; c.disabled = emitida; c.oninput = function(){ it.p = num(c.value); pintarPrev(); };
        var ds = h("input", "nvf-in p"); ds.value = it.ds || ""; ds.placeholder = "% o $"; ds.title = "Descuento de este producto: 10% o un monto"; ds.disabled = emitida; ds.oninput = function(){ it.ds = ds.value.trim(); pintarPrev(); };
        var z = h("button", "nvf-del", "✕"); z.type = "button"; z.disabled = emitida; z.title = "Quitar"; z.onclick = function(){ d.items.splice(i, 1); pintarItems(); pintarPrev(); };
        r.append(a, b, c, ds, z); lis.append(r);
      });
      if (!emitida){ var ad = h("button", "nvf-add", "+ Agregar producto"); ad.type = "button"; ad.onclick = function(){ d.items.push({ d: "", c: 1, p: 0 }); pintarItems(); }; lis.append(ad); }
    }
    pintarItems(); izq.append(h("div", "nvf-ith", null)); izq.lastChild.innerHTML = "<span>Producto</span><span>Cant.</span><span>Precio</span><span>Desc.</span><span></span>"; izq.append(lis);
    var env = h("label", "nvf-env"); var ck = h("input"); ck.type = "checkbox"; ck.checked = !!d.conEnvio; ck.disabled = emitida; var ei = h("input", "nvf-in p"); ei.inputMode = "decimal"; ei.value = d.envio || ""; ei.placeholder = "Monto"; ei.disabled = emitida;
    /* si se escribe el envío, se descuenta de los productos para que el total siga igual */
    function ajEnv(antes, ahora){ var dif = ahora - antes; if (!dif || !d.items.length) return; var it = d.items[d.items.length - 1], c = Number(it.c) || 1; it.p = Math.round(((Number(it.p) || 0) - dif / c) * 100) / 100; pintarItems(); }
    var envAct = d.conEnvio ? (Number(d.envio) || 0) : 0;
    ck.onchange = function(){ d.conEnvio = ck.checked; var n = d.conEnvio ? (Number(d.envio) || 0) : 0; ajEnv(envAct, n); envAct = n; pintarPrev(); };
    ei.onchange = function(){ d.envio = num(ei.value); if (d.envio) { d.conEnvio = true; ck.checked = true; } var n = d.conEnvio ? (Number(d.envio) || 0) : 0; ajEnv(envAct, n); envAct = n; pintarPrev(); };
    env.append(ck, h("span", null, "Pagó envío"), ei); izq.append(env);
    var tfi = null;
    var tt = h("div", "nvf-tot"); tt.append(h("span", null, "Total a facturar")); var tot = h("b"); tt.append(tot); izq.append(tt);
    if (x.monto && Math.abs(x.monto - totalDe(f)) > 1 && !emitida) izq.append(h("p", "nvf-nota", "En la venta figura " + plata(x.monto) + " como monto a facturar."));
    /* acciones */
    var acc = h("div", "nvf-acc");
    function boton(t, cls, fn){ var b = h("button", "nvf-bt " + (cls || ""), t); b.type = "button"; b.onclick = fn; acc.append(b); return b; }
    if (!emitida) boton("Guardar cambios", "sec", function(){ f.total = totalDe(f); guardarF(f).then(function(){ toast("Guardado ✓"); pintar(); }); });
    var cfg = CFG[f.cuenta] || {};
    if (!emitida){
      var be = boton("Facturar", "pri", function(){
        if (!f.cuenta){ toast("Elegí si factura Euge o Pau"); return; }
        var c2 = CFG[f.cuenta] || {};
        if (!c2.conectado && !ARCA_LISTO[f.cuenta]){ toast("Falta conectar ARCA para " + (f.cuenta === "pau" ? "Pau" : "Euge") + " (certificado). Mientras, quedó guardada para facturar."); f.total = totalDe(f); f.estado = "lista"; guardarF(f).then(pintar); return; }
        f.total = totalDe(f);
        confirmarEmision(f, cerrar);
      });
    }
    boton("Enviar remito", "sec", function(){
      if (!f.remito_nro) f.remito_nro = siguienteRemito();
      f.total = totalDe(f);
      guardarF(f).then(function(){ return mandar(f, "remito"); }).then(function(){ f.remito_at = new Date().toISOString(); return guardarF(f); }).then(function(){ toast("Remito enviado a " + d.cliente.email + " ✓"); pintar(); }, function(e){ if (e) toast("No se pudo mandar el mail"); });
    });
    if (emitida) boton("Enviar factura", "pri", function(){ mandar(f, "factura").then(function(){ f.factura_mail_at = new Date().toISOString(); return guardarF(f); }).then(function(){ toast("Factura enviada ✓"); pintar(); }, function(e){ if (e) toast("No se pudo mandar el mail"); }); });
    if (emitida && !f.nc && f.cae && ARCA_LISTO[f.cuenta]) boton("Anular con nota de crédito", "sec", function(){ confirmarEmision(f, cerrar, "nc"); });
    if (f.nc) boton("Enviar nota de crédito", "sec", function(){ mandar(f, "nc").then(function(){ toast("Nota de crédito enviada ✓"); }, function(e){ if (e) toast("No se pudo mandar el mail"); }); });
    boton("Descargar PDF", "ter", function(){ imprimir(f, vista); });
    der.append(tg, prev);
    p.append(cab); var cuerpo = h("div", "nvf-edb"); cuerpo.append(izq, der); p.append(cuerpo, acc);
    document.body.append(cap); requestAnimationFrame(function(){ cap.classList.add("on"); });
    pintarPrev();
  }

  /* ---------- configuración de cada cuenta ---------- */
  function config(){
    var cap = h("div", "nvf-cap"), p = h("div", "nvf-ed nvf-cfg"); cap.append(p);
    function cerrar(){ cap.classList.remove("on"); setTimeout(function(){ cap.remove(); }, 220); pintar(); }
    cap.onclick = function(e){ if (e.target === cap) cerrar(); };
    var cab = h("div", "nvf-edh"); cab.append(h("h2", null, "Datos para facturar"), h("button", "nvf-x", "✕")); cab.lastChild.onclick = cerrar; p.append(cab);
    var cols = h("div", "nvf-cfgc");
    CUENTAS.forEach(function(o){
      var d = Object.assign({}, CFG[o[0]] || {}), box = h("section", "nvf-cfgb");
      box.append(h("h3", null, o[1]));
      function c(lab, k, ph, tipo){ var w = h("label", "nvf-fl"); w.append(h("span", null, lab)); var i = h("input", "nvf-in"); i.type = tipo || "text"; i.placeholder = ph || ""; i.value = d[k] == null ? "" : d[k]; i.onchange = function(){ d[k] = tipo === "money" ? num(i.value) : i.value.trim(); if (tipo === "money") i.value = d[k] ? plata(d[k]) : ""; guardarCfg(o[0], d).then(function(){ toast("Guardado ✓"); }); }; if (tipo === "money"){ i.type = "text"; i.inputMode = "decimal"; i.value = d[k] ? plata(d[k]) : ""; } w.append(i); box.append(w); }
      c("Tope de facturación", "tope", "Ej: $ 30.000.000", "money");
      c("Ya facturado este año fuera de la app", "previo", "Lo que facturaste antes por ARCA", "money");
      c("Razón social / Nombre", "razon", "Como figura en ARCA");
      c("CUIT", "cuit", "20-12345678-9");
      c("Domicilio comercial", "dom", "Calle, número, ciudad");
      c("Ingresos Brutos", "iibb", "N° o 'Exento'");
      c("Inicio de actividades", "inicio", "", "date");
      c("Punto de venta (web service)", "ptoVta", "Ej: 3");
      var est = h("p", "nvf-nota " + ((d.conectado || ARCA_LISTO[o[0]]) ? "ok" : ""), (d.conectado || ARCA_LISTO[o[0]]) ? "ARCA conectado ✓" : "ARCA todavía no está conectado: falta el certificado. Mientras tanto se puede revisar, ver la vista previa y mandar remitos.");
      box.append(est); cols.append(box);
    });
    p.append(cols);
    document.body.append(cap); requestAnimationFrame(function(){ cap.classList.add("on"); });
  }

  /* ---------- pantalla ---------- */
  function panel(){ var w = document.querySelector(".wrap"); if (!w) return null; var p = w.querySelector(".nvfp"); if (!p){ p = h("section", "nvfp"); w.appendChild(p); } return p; }
  function pintar(){
    var p = panel(); if (!p || !document.body.classList.contains("nvf-on")) return;
    var sy = window.scrollY; p.innerHTML = "";
    var mm = MES.split("-"), nomMes = MESES[Number(mm[1]) - 1] + " " + mm[0];
    var cab = h("div", "nvf-cab"), tt = h("div"); tt.append(h("h1", null, "Facturación"), h("p", null, "Ventas de " + nomMes + " · minoristas y mayoristas · nada se factura solo"));
    var nav = h("div", "nvf-mes"); var a = h("button", null, "‹"), b = h("button", null, "›"); a.type = b.type = "button";
    function mover(n){ var d = new Date(Number(mm[0]), Number(mm[1]) - 1 + n, 1); MES = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); pintar(); }
    a.onclick = function(){ mover(-1); }; b.onclick = function(){ mover(1); }; nav.append(a, h("span", null, nomMes), b);
    var cf = h("button", "nvf-cfgbt", "Datos y topes"); cf.type = "button"; cf.onclick = config;
    cab.append(tt, nav, cf); p.append(cab);
    var V = ventas();
    if (!CARG || !V){
      p.append(h("div", "nvf-vacio", "Cargando ventas…"));
      if (!CARG) cargar().then(pintar);
      else if (!V){
        ESPERA++;
        if (ESPERA === 3){ /* las ventas se leen al abrir Nervo 2026: lo abrimos un instante y volvemos */
          var tb0 = document.getElementById("tab-base"); if (tb0){ document.body.classList.remove("nvf-on"); tb0.click(); var n0 = 0, t0 = setInterval(function(){ if ((window.__nv.S.bzData) || ++n0 > 60){ clearInterval(t0); abrir(); } }, 300); return; }
        }
        setTimeout(pintar, 1000);
      }
      return;
    }
    ESPERA = 0;
    /* topes por cuenta */
    var tps = h("div", "nvf-topes");
    CUENTAS.forEach(function(o){
      var cu = o[0], cfg = CFG[cu] || {}, tope = Number(cfg.tope) || 0, anio = emitidasAnio(cu) + (Number(cfg.previo) || 0), mes = emitidasMes(cu);
      var pend = V.filter(function(x){ var f = F[x.id]; var c = (f && f.cuenta) || x.cuenta; return c === cu && !(f && f.estado === "emitida"); }).reduce(function(s, x){ var f = F[x.id]; return s + (f ? totalDe(f) : x.monto); }, 0);
      var c = h("div", "nvf-tope " + cu);
      var hd = h("div", "nvf-toph"); hd.append(h("b", null, o[1]), h("span", null, (cfg.conectado || ARCA_LISTO[cu]) ? "ARCA conectado ✓" : "ARCA sin conectar"));
      var pct = tope ? Math.min(100, Math.round(anio / tope * 100)) : 0;
      var bar = h("div", "nvf-bar"); var fill = h("i"); fill.style.width = pct + "%"; if (pct >= 90) bar.classList.add("alto"); bar.append(fill);
      var ks = h("div", "nvf-ks");
      function k(l, v, cls){ var e = h("div", cls || ""); e.append(h("small", null, l), h("b", null, v)); ks.append(e); }
      k("Facturado en " + MESES[Number(mm[1]) - 1], plata(mes)); k("Para facturar", plata(pend), "pe"); k("En el año", plata(anio));
      k(tope ? "Te queda hasta el tope" : "Tope", tope ? plata(Math.max(0, tope - anio)) : "Sin definir", tope && tope - anio < tope * .1 ? "al" : "ok");
      c.append(hd, ks, bar);
      if (!tope){ var bt = h("button", "nvf-link", "Poner tope"); bt.type = "button"; bt.onclick = config; c.append(bt); }
      else if (pct >= 90) c.append(h("p", "nvf-aviso", "Atención: estás cerca del tope de facturación."));
      tps.append(c);
    });
    p.append(tps);
    /* filtros */
    var fl = h("div", "nvf-fils");
    function seg(ops, val, set){ var s = h("div", "nvf-seg"); ops.forEach(function(o){ var b2 = h("button", o[0] === val ? "on" : "", o[1]); b2.type = "button"; b2.onclick = function(){ set(o[0]); pintar(); }; s.append(b2); }); return s; }
    fl.append(seg([["pend", "Para facturar"], ["fact", "Facturadas"], ["todas", "Todas"]], FILTRO, function(v){ FILTRO = v; }),
      seg([["todas", "Todas"], ["min", "Minoristas"], ["may", "Mayoristas"]], TIPO, function(v){ TIPO = v; }),
      seg([["todas", "Las dos"], ["euge", "Euge"], ["pau", "Pau"]], QUIEN, function(v){ QUIEN = v; }));
    var bs = h("input", "nvf-in nvf-bus"); bs.placeholder = "Buscar cliente o venta"; bs.value = BUS; bs.oninput = function(){ BUS = bs.value; var pos = bs.selectionStart; pintar(); var nb = document.querySelector(".nvf-bus"); if (nb){ nb.focus(); nb.setSelectionRange(pos, pos); } };
    fl.append(bs); p.append(fl);
    /* lista */
    var lista = V.filter(function(x){
      var f = F[x.id], est = f ? f.estado : "borrador", cu = (f && f.cuenta) || x.cuenta;
      if (FILTRO === "pend" && est === "emitida") return false;
      if (FILTRO === "fact" && est !== "emitida") return false;
      if (TIPO !== "todas" && x.origen !== TIPO) return false;
      if (QUIEN !== "todas" && cu !== QUIEN) return false;
      if (BUS && (x.cliente + " " + x.num).toLowerCase().indexOf(BUS.toLowerCase()) < 0) return false;
      return true;
    });
    if (!lista.length){ p.append(h("div", "nvf-vacio", FILTRO === "pend" ? "No hay ventas para facturar en " + nomMes + " 🎉" : "No hay ventas con este filtro.")); window.scrollTo(0, sy); return; }
    var tb = h("div", "nvf-tb"); var th = h("div", "nvf-tr nvf-th"); ["Fecha", "Venta", "Cliente", "Tipo", "Factura", "Monto", "Estado", ""].forEach(function(t){ th.append(h("span", null, t)); }); tb.append(th);
    lista.forEach(function(x){
      var f = F[x.id], est = f ? f.estado : "borrador", cu = (f && f.cuenta) || x.cuenta;
      var r = h("div", "nvf-tr");
      r.append(h("span", "f", fechaTx(x.fecha)), h("span", "n", x.origen === "may" ? "Mayorista" : (x.num || "")), (function(){ var s = h("span", "c", x.cliente || "—"); var v = x.v || {}; var met = [].concat(v.metodo || []).join(", "), quien = [].concat(v.cobro || []).join(" ").trim(); if (met || quien){ var sm = h("small", null, met); if (quien){ var q = h("i", /PAU/i.test(quien) ? "pau" : "euge", /PAU/i.test(quien) ? "Pau" : "Euge"); sm.append(q); } s.append(sm); } return s; })(), h("span", "t", x.origen === "may" ? "Mayorista" : "Minorista"));
      var sc = h("select", "nvf-in nvf-sel"); [["", "Elegir"], ["euge", "Euge"], ["pau", "Pau"]].forEach(function(o){ var op = h("option", null, o[1]); op.value = o[0]; sc.append(op); }); sc.value = cu || ""; sc.disabled = est === "emitida";
      sc.onchange = function(){ var ff = filaF(x); ff.cuenta = sc.value; ff.total = totalDe(ff); guardarF(ff).then(pintar); };
      var scw = h("span", "cu"); scw.append(sc); r.append(scw);
      r.append(h("span", "m", plata(f ? totalDe(f) : x.monto)));
      var chip = (F[x.id] && F[x.id].nc) ? ["Anulada · NC", "pe"] : est === "emitida" ? ["Facturada", "ok"] : est === "lista" ? ["Lista para emitir", "li"] : ["Para facturar", "pe"];
      var ec = h("span", "e"); ec.append(h("em", "nvf-chip " + chip[1], chip[0])); if (f && f.remito_at) ec.append(h("em", "nvf-chip re", "Remito enviado")); r.append(ec);
      var ab = h("button", "nvf-bt pri mini", est === "emitida" ? "Ver" : "Revisar y facturar"); ab.type = "button"; ab.onclick = function(){ editor(x); };
      var aw = h("span", "a"); aw.append(ab); r.append(aw);
      tb.append(r);
    });
    p.append(tb);
    window.scrollTo(0, sy);
  }
  function abrir(){ document.body.classList.add("nvf-on"); if (document.body.classList.contains("nvmov-on")) { var mb = document.querySelector(".nvmov-tab"); document.body.classList.remove("nvmov-on"); if (mb) mb.setAttribute("aria-selected", "false"); } cargar().then(pintar); pintar(); window.scrollTo(0, 0); marcar(); }
  function cerrarPanel(){ document.body.classList.remove("nvf-on"); var b = document.getElementById("tab-fact"); if (b) b.setAttribute("aria-selected", "false"); }
  function marcar(){ var nav = document.querySelector("nav.tabs"); if (!nav) return; var b = document.getElementById("tab-fact"); nav.querySelectorAll(".tab").forEach(function(x){ x.setAttribute("aria-selected", x === b ? "true" : "false"); }); }
  document.addEventListener("click", function(e){ var t = e.target.closest && e.target.closest("nav.tabs .tab, .bnav button, .mnav button"); if (t && t.id !== "tab-fact" && document.body.classList.contains("nvf-on")) cerrarPanel(); }, true);
  function tabBtn(){
    var nav = document.querySelector("nav.tabs"); if (!nav || document.getElementById("tab-fact")) return;
    var b = h("button", "tab desk nvf-tab"); b.type = "button"; b.id = "tab-fact";
    b.innerHTML = '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"></path><path d="M14 3v5h5"></path><path d="M9 12h6M9 15.5h6M9 19h4"></path></svg></span><span class="lb">Facturación</span>';
    b.onclick = function(e){ e.stopPropagation(); abrir(); };
    var ref = document.getElementById("tab-mov"); if (ref && ref.nextSibling) nav.insertBefore(b, ref.nextSibling); else nav.appendChild(b);
  }
  setInterval(function(){ try { tabBtn(); if (document.body.classList.contains("nvf-on")) marcar(); } catch(e){} }, 1200);
  /* cuando cambia la Base (otra persona) o las facturas, repintar si no estás escribiendo */
  setInterval(function(){ if (!document.body.classList.contains("nvf-on") || document.hidden || document.querySelector(".nvf-cap")) return; var a = document.activeElement; if (a && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) return; cargar().then(pintar); }, 20000);
  window.__nvFactAbrir = abrir;
})();
