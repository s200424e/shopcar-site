/* SHOPCAR - página do veículo */
document.addEventListener("sc:ready", () => {
  const { L, EST, I, brl, kmFmt, ano, nome, esc, waLink, waCarro, mapsLink, favs, card, rail } = window.SC;
  const $ = s => document.querySelector(s);
  const id = new URLSearchParams(location.search).get("id");
  const v = EST.find(x => x.id === id);
  const box = $("#vd");

  if (!v) {
    box.style.gridTemplateColumns = "1fr";
    box.innerHTML = `<div class="empty"><span class="t-h3">Este carro já foi vendido</span>
      <p>O anúncio que você procurou não está mais no estoque. Veja os outros seminovos disponíveis ou fale com a gente.</p>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center">
      <a class="btn btn--primary btn--sm" href="estoque.html">Ver estoque</a>
      <a class="btn btn--wa btn--sm" href="${waLink("Olá! Vim pelo site e procuro um carro.")}" target="_blank" rel="noopener">${I.wa} WhatsApp</a></div></div>`;
    document.title = "Veículo vendido | Shopcar Veículos";
    return;
  }

  const fotos = v.fotos && v.fotos.length ? v.fotos : [];
  const titulo = `${nome(v)} ${ano(v)}`;
  document.title = `${titulo} | ${brl(v.preco)} | Shopcar Veículos`;
  document.querySelector('meta[name="description"]').content = `${titulo}, ${kmFmt(v.km)}, ${v.cambio || ""} ${v.combustivel}, cor ${v.cor}. ${brl(v.preco)} na Shopcar Veículos, Taguatinga DF.`;
  [["og:title", `${titulo} · ${brl(v.preco)}`], ["og:image", v.capaHD || fotos[0] || ""]].forEach(([p, c]) => {
    const m = document.createElement("meta"); m.setAttribute("property", p); m.content = c; document.head.append(m);
  });

  const spec = (k, val) => val ? `<div><small>${k}</small><b>${esc(val)}</b></div>` : "";
  box.innerHTML = `
    <div class="gallery">
      <nav class="breadcrumb" aria-label="Você está em" style="margin-bottom:1rem"><a href="index.html">Início</a><span>/</span><a href="estoque.html">Estoque</a><span>/</span><a href="estoque.html?marca=${encodeURIComponent(v.marca)}">${esc(v.marca)}</a><span>/</span><span>${esc(v.modelo)}</span></nav>
      <div class="gallery__main" id="gMain">
        ${fotos.length ? `<img src="${esc(fotos[0])}" alt="${esc(titulo)}, foto 1">` : `<div class="no-photo">Fotos em breve</div>`}
        ${fotos.length > 1 ? `<button class="gallery__nav gallery__nav--prev" data-g="-1" aria-label="Foto anterior">${I.left}</button>
        <button class="gallery__nav gallery__nav--next" data-g="1" aria-label="Próxima foto">${I.right}</button>` : ""}
        <span class="tag gallery__count" id="gCount">1 / ${fotos.length || 0}</span>
      </div>
      ${fotos.length > 1 ? `<div class="gallery__thumbs" id="gThumbs">${fotos.map((f, i) => `<button class="${i ? "" : "is-on"}" aria-label="Ver foto ${i + 1}"><img src="${esc(f)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
    </div>
    <aside class="vd__panel">
      <div class="vd__title">
        <span class="car-card__brand">${esc(v.marca)} · ${esc(v.carroceria)}</span>
        <h1 class="t-h2">${esc(v.modelo)}</h1>
        <p>${esc(v.versao || "")}</p>
      </div>
      <div class="vd__price">
        <div><small>Preço à vista</small><span class="t-price">${brl(v.preco)}</span></div>
        <button class="fav-btn ${favs.has(v.id) ? "is-on" : ""}" data-id="${esc(v.id)}" aria-pressed="${favs.has(v.id)}" aria-label="Favoritar" style="position:static;background:var(--surface-2)">${I.heart}</button>
      </div>
      <div class="specs">
        ${spec("Ano", ano(v))}
        ${spec("Km", v.km == null ? "Não informado" : kmFmt(v.km))}
        ${spec("Câmbio", v.cambio || "Consulte")}
        ${spec("Combustível", v.combustivel)}
        ${spec("Cor", v.cor)}
        ${spec("Carroceria", v.carroceria)}
      </div>
      <div class="vd__ctas">
        <a class="btn btn--wa btn--block" href="${waCarro(v)}" target="_blank" rel="noopener">${I.wa} Tenho interesse</a>
        <div class="vd__ctas-row">
          <a class="btn btn--primary btn--sm" href="index.html?simular=${encodeURIComponent(v.id)}#financiamento">${I.money} Simular financiamento</a>
          <a class="btn btn--ghost btn--sm" href="${waLink(`Olá! Tenho interesse no ${titulo} (${brl(v.preco)}) e quero dar meu carro na troca. Meu carro:`)}" target="_blank" rel="noopener">${I.swap} Dar meu carro na troca</a>
        </div>
        <button class="btn btn--ghost btn--sm" type="button" id="share">${I.share} Compartilhar anúncio</button>
      </div>
      <div class="vd__store">${I.pin}<div><b>${esc(L.nome)}</b>${esc(L.endereco)} · ${esc(L.referencia)}<br>
        <a class="link-arrow" style="margin-top:.5rem" href="${mapsLink}" target="_blank" rel="noopener">Como chegar ${I.arrow}</a></div></div>
    </aside>`;

  /* galeria */
  if (fotos.length) {
    let at = 0;
    const main = $("#gMain img"), cnt = $("#gCount"), thumbs = document.querySelectorAll("#gThumbs button");
    const lb = $("#lightbox"), lbImg = lb.querySelector("img"), lbCnt = lb.querySelector(".lightbox__count");
    const go = n => {
      at = (n + fotos.length) % fotos.length;
      main.src = fotos[at]; main.alt = `${titulo}, foto ${at + 1}`;
      cnt.textContent = `${at + 1} / ${fotos.length}`;
      thumbs.forEach((t, i) => t.classList.toggle("is-on", i === at));
      thumbs[at]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      lbImg.src = fotos[at]; lbCnt.textContent = `${at + 1} / ${fotos.length}`;
    };
    document.querySelectorAll("[data-g]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); go(at + +b.dataset.g); }));
    thumbs.forEach((t, i) => t.addEventListener("click", () => go(i)));
    lb.querySelector('[data-lb="close"]').innerHTML = I.close;
    lb.querySelector('[data-lb="-1"]').innerHTML = I.left;
    lb.querySelector('[data-lb="1"]').innerHTML = I.right;
    const abrir = on => { lb.classList.toggle("is-open", on); document.documentElement.style.overflow = on ? "hidden" : ""; if (on) go(at); };
    $("#gMain").addEventListener("click", () => abrir(true));
    lb.addEventListener("click", e => {
      const b = e.target.closest("[data-lb]");
      if (b) { b.dataset.lb === "close" ? abrir(false) : go(at + +b.dataset.lb); }
      else if (e.target === lb) abrir(false);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") go(at + 1);
      if (e.key === "ArrowLeft") go(at - 1);
      if (e.key === "Escape") abrir(false);
    });
    let tx = null;
    [$("#gMain"), lb].forEach(el => {
      el.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1)); tx = null; });
    });
  }

  /* compartilhar */
  $("#share").addEventListener("click", async () => {
    const data = { title: titulo, text: `${titulo} por ${brl(v.preco)} na Shopcar Veículos`, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch (e) { /* cancelado */ } }
    else { await navigator.clipboard?.writeText(location.href); $("#share").lastChild.textContent = " Link copiado!"; }
  });

  /* relacionados: mesma carroceria ou preço próximo */
  const rel = EST.filter(x => x.id !== v.id && x.fotos && x.fotos.length)
    .map(x => ({ x, s: (x.carroceria === v.carroceria ? 2 : 0) + (x.marca === v.marca ? 1 : 0) + (Math.abs(x.preco - v.preco) < v.preco * .25 ? 2 : 0) }))
    .sort((a, b) => b.s - a.s || Math.abs(a.x.preco - v.preco) - Math.abs(b.x.preco - v.preco))
    .slice(0, 10).map(o => o.x);
  if (rel.length) {
    $("#relacionados").hidden = false;
    $("#railRel").innerHTML = rel.map(card).join("");
    document.querySelector("[data-rail-prev]").innerHTML = I.left;
    document.querySelector("[data-rail-next]").innerHTML = I.right;
    rail(document.querySelector("#relacionados .rail"));
  }
});
