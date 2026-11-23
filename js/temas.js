/* =====================================================================
   SHOPCAR - temas sazonais (decoração do site conforme a época do ano)
   ---------------------------------------------------------------------
   - O tema certo entra sozinho pela data (LOJA.tema = "auto").
   - Para forçar um tema: LOJA.tema = "natal" (ou "nenhum" para desligar).
   - Para ver antes da hora: abra o site com ?tema=natal no endereço.
   Para criar um tema novo (Dia dos Pais, Black Friday...), copie o bloco
   "natal" em TEMAS, mude o período e os textos, e crie o CSS em style.css.
   ===================================================================== */
(function () {
  const L = window.LOJA || {};

  const TEMAS = {
    natal: {
      nome: "Natal",
      // período (mês/dia) em que o tema entra sozinho
      de: [12, 1], ate: [12, 25],
      alvo: () => { const h = new Date(); return new Date(h.getMonth() === 11 && h.getDate() > 25 ? h.getFullYear() + 1 : h.getFullYear(), 11, 25); },
      faixa: d => d > 1 ? `Natal Shopcar · faltam <b>${d}</b> dias<span class="tema-faixa__extra"> · saia dirigindo antes da ceia</span>`
        : d === 1 ? "Natal Shopcar · falta <b>1</b> dia<span class=\"tema-faixa__extra\"> · saia dirigindo antes da ceia</span>"
        : d === 0 ? "Natal Shopcar · <b>é amanhã!</b><span class=\"tema-faixa__extra\"> · ainda dá tempo, fale com a gente</span>"
        : "Feliz Natal! · Equipe Shopcar",
      selo: "Destaque de Natal",
      slide: {
        img: "img/hero/tiggo8.jpg",
        eyebrow: "Natal Shopcar",
        titulo: "Seu carro novo<br>embaixo da <span class=\"tema-ouro\">árvore</span>",
        texto: "Escolha agora, financie em até 60x e comece o ano dirigindo. Seu usado entra na troca.",
        cta: ["Ver estoque", "estoque.html"],
        wa: ["Quero meu carro de Natal", "Olá! Vim pelo site e quero ver as condições para sair com um carro antes do Natal."]
      },
      banner: {
        eyebrow: "Natal Shopcar",
        titulo: "O presente<br>que <span class=\"tema-ouro\">anda</span>",
        texto: "Escolha o carro, a gente cuida do financiamento e da troca do seu usado. É só passar na loja para buscar a chave.",
        wa: ["Quero meu carro de Natal", "Olá! Vim pelo site e quero ver as condições para sair com um carro antes do Natal."]
      },
      rodape: "Boas festas! Um Natal cheio de sonhos realizados, da equipe Shopcar."
    }
  };

  /* ---------- qual tema vale agora ---------- */
  const url = new URLSearchParams(location.search).get("tema");
  if (url) sessionStorage.setItem("shopcar_tema", url);
  const pedido = url || sessionStorage.getItem("shopcar_tema") || L.tema || "auto";
  const hoje = new Date(), md = (hoje.getMonth() + 1) * 100 + hoje.getDate();
  const noPeriodo = t => { const a = t.de[0] * 100 + t.de[1], b = t.ate[0] * 100 + t.ate[1]; return a <= b ? md >= a && md <= b : md >= a || md <= b; };
  const chave = pedido === "auto" ? Object.keys(TEMAS).find(k => noPeriodo(TEMAS[k])) : (TEMAS[pedido] ? pedido : null);
  const T = chave ? TEMAS[chave] : null;
  window.SC_TEMA = T ? Object.assign({ chave }, T) : null;
  if (!T) return;
  document.documentElement.classList.add("tema-" + chave);

  // dias inteiros que faltam (o mesmo número da contagem regressiva); negativo = já passou
  const diasAte = d => { const ms = d - new Date(); return ms <= 0 ? -1 : Math.floor(ms / 864e5); };

  /* ---------- enfeites ---------- */
  function luzes(alvo) {
    const box = document.createElement("div");
    box.className = "tema-luzes"; box.setAttribute("aria-hidden", "true");
    const n = Math.ceil(window.innerWidth / 46) + 1;
    box.innerHTML = Array.from({ length: n }, (_, i) => `<i style="--d:${(i * 0.37) % 2.4}s"></i>`).join("");
    alvo.append(box);
  }

  function neve(alvo) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "tema-neve"; c.setAttribute("aria-hidden", "true");
    alvo.append(c);
    const ctx = c.getContext("2d");
    let W, H, flocos = [], vivo = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const medir = () => {
      W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const qtd = Math.round(Math.min(110, W / 12));
      flocos = Array.from({ length: qtd }, () => novo(true));
    };
    const novo = inicio => ({ x: Math.random() * W, y: inicio ? Math.random() * H : -10, r: 1 + Math.random() * 2.6, v: .35 + Math.random() * .9, o: .35 + Math.random() * .55, f: Math.random() * 6.28, a: .4 + Math.random() * .8 });
    const passo = () => {
      if (!vivo) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of flocos) {
        p.y += p.v; p.f += .012; p.x += Math.sin(p.f) * p.a * .5;
        if (p.y > H + 6) Object.assign(p, novo(false));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill();
      }
      requestAnimationFrame(passo);
    };
    medir(); window.addEventListener("resize", medir);
    document.addEventListener("visibilitychange", () => { vivo = !document.hidden; if (vivo) passo(); });
    passo();
  }

  function contagem(el, alvo) {
    const z = n => String(Math.max(0, n)).padStart(2, "0");
    const tick = () => {
      const ms = alvo - new Date();
      if (ms <= 0) { el.innerHTML = `<div class="tema-cd__fim">Feliz Natal!</div>`; return; }
      const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      el.innerHTML = [[d, "dias"], [h, "horas"], [m, "min"], [s, "seg"]].map(([v, t]) => `<div><b>${z(v)}</b><span>${t}</span></div>`).join("");
    };
    tick(); setInterval(tick, 1000);
  }

  const laco = `<svg class="tema-laco" viewBox="0 0 120 70" aria-hidden="true"><path d="M60 36C44 10 14 4 10 20s24 22 50 16z" fill="var(--ouro)"/><path d="M60 36c16-26 46-32 50-16S86 42 60 36z" fill="var(--ouro)"/><path d="M60 36c-8 10-20 26-26 32l10 1c6-8 12-20 16-33zM60 36c8 10 20 26 26 32l-10 1c-6-8-12-20-16-33z" fill="var(--ouro-escuro)"/><circle cx="60" cy="36" r="8" fill="var(--ouro-escuro)"/></svg>`;
  const floco = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3"/></svg>`;

  document.addEventListener("sc:ready", () => {
    const waLink = msg => `https://wa.me/${L.whatsapp}?text=${encodeURIComponent(msg)}`;
    const alvo = T.alvo();

    // faixa do topo
    const util = document.querySelector(".utility__group--left");
    if (util && T.faixa) {
      const s = document.createElement("span");
      s.className = "tema-faixa"; s.innerHTML = floco + T.faixa(diasAte(alvo));
      util.prepend(s);
    }
    // varal de luzes embaixo do menu
    const nav = document.querySelector(".nav-bar");
    if (nav) luzes(nav);
    // neve no topo da home e no topo das páginas internas
    const hero = document.querySelector(".hero") || document.querySelector(".page-hero");
    if (hero) neve(hero);

    // faixa-presente na home, depois dos recém-chegados
    const depois = document.querySelector("#chegados");
    if (depois && T.banner) {
      const b = T.banner;
      const sec = document.createElement("section");
      sec.className = "section tema-banner"; sec.id = "tema";
      sec.innerHTML = `<div class="container"><div class="tema-presente reveal">
        <div class="tema-presente__fita" aria-hidden="true"></div><div class="tema-presente__fita tema-presente__fita--h" aria-hidden="true"></div>${laco}
        <div class="tema-presente__texto">
          <span class="eyebrow">${b.eyebrow}</span>
          <h2 class="t-h2">${b.titulo}</h2>
          <p class="lead">${b.texto}</p>
          <div class="hero__ctas"><a class="btn btn--wa" href="${waLink(b.wa[1])}" target="_blank" rel="noopener">${window.SC ? window.SC.I.wa : ""} ${b.wa[0]}</a>
          <a class="btn btn--outline" href="estoque.html">Ver estoque</a></div>
        </div>
        <div class="tema-presente__cd"><span class="tema-cd__titulo">Faltam para o Natal</span><div class="tema-cd" id="temaCd"></div></div>
      </div></div>`;
      depois.after(sec);
      contagem(sec.querySelector("#temaCd"), alvo);
      if (window.IntersectionObserver) {
        const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("is-in")));
        sec.querySelectorAll(".reveal").forEach(n => io.observe(n));
      }
    }

    // recado no rodapé
    const fb = document.querySelector(".footer__bottom");
    if (fb && T.rodape) {
      const p = document.createElement("p");
      p.className = "tema-rodape"; p.innerHTML = floco + T.rodape;
      fb.before(p);
    }
  });
})();
