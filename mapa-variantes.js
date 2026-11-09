// ============================================================
//  mapa-variantes.js · el mapa del circuito distingue la VARIANTE (trazado)
//
//  Se carga DESPUÉS del <script> principal de live.html (una sola línea nueva, al final):
//      <script src="mapa-variantes.js"></script>
//  Sustituye MAPA.find. Lee el circuito (TR) y la variante (LY) que imprime la consola
//  ("track_content_data.name" y "track_layout_name") y busca en circuitos.json:
//    1) la entrada "circuito__variante"   (p. ej. nurburgring__sprint)
//    2) la entrada del circuito sin variante (p. ej. monza)
//       - si esa entrada declara un campo "layout" que no coincide con la variante actual, NO se dibuja
//         (mejor sin mapa que uno equivocado)
//    3) por alias del circuito
//  Si no hay trazado, lo avisa una vez en «Ver líneas crudas».
// ============================================================
(function () {
  const avisados = new Set();
  MAPA.find = function (name) {
    const n = norm(name), l = norm(LY[CUR_SESS]);
    if (!n) return null;
    const mismo = (k, t) => n.includes(k) || k.includes(n) || (t.alias || []).some(a => n.includes(a));
    let base = null;
    for (const k in TRACKS) {
      const t = TRACKS[k], i = k.indexOf('__');
      if (i < 0) { if (!base && mismo(k, t)) base = t; continue; }          // circuito sin variante
      if (l && norm(k.slice(i + 2)) === l && mismo(k.slice(0, i), t)) return t;   // circuito + variante exacta
    }
    let res = null;
    if (base) { const bl = norm(base.layout); res = (!bl || !l || bl === l) ? base : null; }
    if (!res) {
      const clave = norm(name) + (l ? '__' + l : '');
      if (!avisados.has(clave)) {
        avisados.add(clave);
        dbg('[mapa] sin trazado para ' + name + (LY[CUR_SESS] ? ' ' + LY[CUR_SESS] : '') + ' · rellena los pts de «' + clave + '» en circuitos.json' +
            (l ? ' (o de «' + norm(name) + '» si el circuito solo tiene una variante)' : ''));
      }
    }
    return res;
  };
})();
