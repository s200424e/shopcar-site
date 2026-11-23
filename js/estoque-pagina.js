/* SHOPCAR - página de estoque (filtros, ordenação, favoritos) */
document.addEventListener("sc:ready", () => {
  const { EST, I, brl, slug, esc, FAIXAS, TIPOS, contar, favs, card } = window.SC;
  const $ = s => document.querySelector(s);
  const url = new URLSearchParams(location.search);

  // estado vindo da URL (links do menu, home e busca)
  const st = {
    q: url.get("q") || "",
    tipo: new Set(url.getAll("tipo").flatMap(x => x.split(",")).filter(Boolean)),
    marca: new Set(url.getAll("marca").flatMap(x => x.split(",")).filter(Boolean)),
    faixa: url.get("faixa") || "",
    min: url.get("min") || "",
    max: url.get("max") || "",
    ano: url.get("ano") || "",
    cambio: url.get("cambio") || "",
    comb: url.get("comb") || "",
    fav: url.get("favoritos") === "1",
    ordem: url.get("ordem") || "recentes"
  };

  const ordemOrig = new Map(EST.map((v, i) => [v.id, i]));
  const tipos = contar("carroceria").sort((a, b) => TIPOS.indexOf(a[0]) - TIPOS.indexOf(b[0]));
  const marcas = contar("marca").sort((a, b) => a[0].localeCompare(b[0]));
  const anos = [...new Set(EST.map(v => v.anoModelo))].sort((a, b) => b - a);
  const cambios = contar("cambio").filter(([c]) => c);
  const combs = contar("combustivel");

  const chips = (el, lista, sel, multi) => {
    el.innerHTML = lista.map(([val, n]) => `<button type="button" class="chip" data-v="${esc(val)}">${esc(val)}${n != null ? ` <small>${n}</small>` : ""}</button>`).join("");
    el.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      const v = b.dataset.v;
      if (multi) st[sel].has(v) ? st[sel].delete(v) : st[sel].add(v);
      else st[sel] = st[sel] === v ? "" : v;
      render();
    });
  };
  chips($("#fTipo"), tipos, "tipo", true);
  chips($("#fMarca"), marcas, "marca", true);
  chips($("#fFaixa"), FAIXAS.map(f => [f.label, null]), "faixa", false);
  chips($("#fCambio"), cambios, "cambio", false);
  chips($("#fComb"), combs, "comb", false);
  $("#fAno").insertAdjacentHTML("beforeend", anos.map(a => `<option value="${a}">${a} ou mais novo</option>`).join(""));

  const nfmt = el => { const d = el.value.replace(/\D/g, ""); el.value = d ? Number(d).toLocaleString("pt-BR") : ""; return d; };
  $("#fQ").value = st.q;
  $("#fMin").value = st.min ? Number(st.min).toLocaleString("pt-BR") : "";
  $("#fMax").value = st.max ? Number(st.max).toLocaleString("pt-BR") : "";
  $("#fAno").value = st.ano;
  $("#ordem").value = st.ordem;
  let tq;
  $("#fQ").addEventListener("input", e => { clearTimeout(tq); tq = setTimeout(() => { st.q = e.target.value.trim(); render(); }, 180); });
  $("#fMin").addEventListener("input", e => { st.min = nfmt(e.target); render(); });
  $("#fMax").addEventListener("input", e => { st.max = nfmt(e.target); render(); });
  $("#fAno").addEventListener("change", e => { st.ano = e.target.value; render(); });
  $("#ordem").addEventListener("change", e => { st.ordem = e.target.value; render(); });
  $("#fFav").addEventListener("click", () => { st.fav = !st.fav; render(); });
  $("#fLimpar").addEventListener("click", limpar);
  document.addEventListener("favs-changed", () => { if (st.fav) render(); });

  function limpar() {
    Object.assign(st, { q: "", faixa: "", min: "", max: "", ano: "", cambio: "", comb: "", fav: false });
    st.tipo.clear(); st.marca.clear();
    $("#fQ").value = $("#fMin").value = $("#fMax").value = $("#fAno").value = "";
    render();
  }

  function filtrar() {
    const termos = slug(st.q).split(/\s+/).filter(Boolean);
    const fx = FAIXAS.find(f => f.label === st.faixa || f.id === st.faixa);
    return EST.filter(v => {
      if (st.tipo.size && !st.tipo.has(v.carroceria)) return false;
      if (st.marca.size && !st.marca.has(v.marca)) return false;
      if (fx && !(v.preco >= fx.min && v.preco < fx.max)) return false;
      if (st.min && v.preco < +st.min) return false;
      if (st.max && v.preco > +st.max) return false;
      if (st.ano && v.anoModelo < +st.ano) return false;
      if (st.cambio && v.cambio !== st.cambio) return false;
      if (st.comb && v.combustivel !== st.comb) return false;
      if (st.fav && !favs.has(v.id)) return false;
      if (termos.length) {
        const alvo = slug(`${v.marca} ${v.modelo} ${v.versao} ${v.carroceria} ${v.cor} ${v.cambio} ${v.combustivel} ${v.anoModelo}`);
        if (!termos.every(t => alvo.includes(t))) return false;
      }
      return true;
    }).sort({
      "recentes": (a, b) => ordemOrig.get(a.id) - ordemOrig.get(b.id),
      "menor-preco": (a, b) => a.preco - b.preco,
      "maior-preco": (a, b) => b.preco - a.preco,
      "menor-km": (a, b) => (a.km ?? 1e9) - (b.km ?? 1e9),
      "mais-novo": (a, b) => b.anoModelo - a.anoModelo || a.preco - b.preco
    }[st.ordem] || (() => 0));
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (st.q) p.set("q", st.q);
    if (st.tipo.size) p.set("tipo", [...st.tipo].join(","));
    if (st.marca.size) p.set("marca", [...st.marca].join(","));
    const fx = FAIXAS.find(f => f.label === st.faixa || f.id === st.faixa); if (fx) p.set("faixa", fx.id);
    ["min", "max", "ano", "cambio", "comb"].forEach(k => st[k] && p.set(k, st[k]));
    if (st.fav) p.set("favoritos", "1");
    if (st.ordem !== "recentes") p.set("ordem", st.ordem);
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
  }

  function render() {
    // normaliza faixa para o rótulo (chip) quando veio da URL como id
    const fx = FAIXAS.find(f => f.id === st.faixa); if (fx) st.faixa = fx.label;
    const lista = filtrar();
    const marcarChips = (el, fn) => el.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-on", fn(c.dataset.v)));
    marcarChips($("#fTipo"), v => st.tipo.has(v));
    marcarChips($("#fMarca"), v => st.marca.has(v));
    marcarChips($("#fFaixa"), v => st.faixa === v);
    marcarChips($("#fCambio"), v => st.cambio === v);
    marcarChips($("#fComb"), v => st.comb === v);
    $("#fFav").classList.toggle("is-on", st.fav);

    $("#count").innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? "veículo encontrado" : "veículos encontrados"}${lista.length !== EST.length ? ` de ${EST.length}` : ""}`;
    $("#fAplicar").textContent = `Ver ${lista.length} ${lista.length === 1 ? "resultado" : "resultados"}`;

    const ativos = [];
    if (st.q) ativos.push(["q", `“${st.q}”`]);
    st.tipo.forEach(t => ativos.push(["tipo:" + t, t]));
    st.marca.forEach(m => ativos.push(["marca:" + m, m]));
    if (st.faixa) ativos.push(["faixa", st.faixa]);
    if (st.min) ativos.push(["min", "A partir de " + brl(st.min)]);
    if (st.max) ativos.push(["max", "Até " + brl(st.max)]);
    if (st.ano) ativos.push(["ano", st.ano + "+"]);
    if (st.cambio) ativos.push(["cambio", st.cambio]);
    if (st.comb) ativos.push(["comb", st.comb]);
    if (st.fav) ativos.push(["fav", "Favoritos"]);
    $("#ativos").innerHTML = ativos.map(([k, t]) => `<button type="button" data-k="${esc(k)}">${esc(t)} ✕</button>`).join("") +
      (ativos.length > 1 ? `<button type="button" data-k="*">Limpar tudo</button>` : "");

    $("#grid").innerHTML = lista.length ? lista.map(card).join("") : `<div class="empty" style="grid-column:1/-1">
      <span class="t-h3">Nada por aqui</span>
      <p>${st.fav ? "Você ainda não favoritou nenhum carro. Toque no coração dos anúncios para salvar." : "Nenhum veículo com esses filtros. Tente tirar algum filtro ou fale com a gente: chegam carros novos toda semana."}</p>
      <button class="btn btn--outline btn--sm" type="button" id="emptyLimpar">Limpar filtros</button></div>`;
    document.getElementById("emptyLimpar")?.addEventListener("click", limpar);

    const partes = [...st.marca, ...st.tipo];
    document.title = `${partes.length ? partes.join(", ") + " | " : ""}Estoque de seminovos | Shopcar Veículos`;
    $("#heroLead").textContent = `${EST.length} seminovos selecionados no nosso showroom em Taguatinga.`;
    syncUrl();
  }

  $("#ativos").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const k = b.dataset.k;
    if (k === "*") return limpar();
    if (k.startsWith("tipo:")) st.tipo.delete(k.slice(5));
    else if (k.startsWith("marca:")) st.marca.delete(k.slice(6));
    else if (k === "fav") st.fav = false;
    else { st[k] = ""; const map = { q: "#fQ", min: "#fMin", max: "#fMax", ano: "#fAno" }; if (map[k]) $(map[k]).value = ""; }
    render();
  });

  // filtros no celular
  const fl = $("#filters");
  document.querySelector("[data-close-filters]").innerHTML = I.close;
  document.addEventListener("click", e => {
    if (e.target.closest("[data-open-filters]")) { fl.classList.add("is-open"); document.documentElement.style.overflow = "hidden"; }
    if (e.target.closest("[data-close-filters]")) { fl.classList.remove("is-open"); document.documentElement.style.overflow = ""; window.scrollTo({ top: document.querySelector(".inv").offsetTop - 90, behavior: "smooth" }); }
  });

  render();
});
