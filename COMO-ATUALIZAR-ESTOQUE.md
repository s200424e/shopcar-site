# Como atualizar o site da Shopcar

O site não tem painel nem banco de dados. Tudo fica em **dois arquivos de texto** dentro da pasta `js/`:

| Arquivo | O que tem |
|---|---|
| `js/estoque.js` | A lista de carros |
| `js/loja.js` | Telefone, WhatsApp, endereço, horários e Instagram |

Abra no Bloco de Notas ou no VS Code, edite, salve e publique a pasta de novo.

---

## Vendeu um carro

Em `js/estoque.js`, apague o bloco inteiro do carro, do `{` até o `},`.

Pode também apagar a pasta de fotos `img/estoque/<id>/` (opcional).

## Mudou o preço

Troque o número em `"preco"`. Escreva **sem pontos e sem R$**:

```js
"preco": 45900,
```

## Chegou carro novo

1. Crie a pasta `img/estoque/<id-novo>/` (o id pode ser qualquer número que ainda não exista, por exemplo `9000001`).
2. Coloque as fotos com os nomes `01.jpg`, `02.jpg`, `03.jpg`... A **01 é a capa**.
   - O ideal é de 800 a 1280 px de largura, em paisagem (deitada).
   - Para a capa aparecer grande no topo da home, salve também uma versão maior como `capa-hd.jpg`.
3. No **começo** da lista em `js/estoque.js` (logo depois de `window.ESTOQUE = [`), cole um bloco assim:

```js
  {
    "id": "9000001",
    "marca": "Chevrolet",
    "modelo": "Onix",
    "versao": "LT 1.0 Turbo",
    "carroceria": "Hatch",
    "anoFab": 2022,
    "anoModelo": 2023,
    "km": 38500,
    "cambio": "Automático",
    "combustivel": "Flex",
    "cor": "Branco",
    "preco": 79900,
    "destaque": false,
    "capaHD": "img/estoque/9000001/capa-hd.jpg",
    "fotos": [
      "img/estoque/9000001/01.jpg",
      "img/estoque/9000001/02.jpg",
      "img/estoque/9000001/03.jpg"
    ]
  },
```

Regras para não quebrar o site:
- Textos ficam entre aspas `"..."`. Números ficam sem aspas.
- Cada bloco termina com `},` (com vírgula). Só o último da lista fica sem vírgula.
- **carroceria**: `Hatch`, `Sedã`, `SUV`, `Picape`, `Perua` ou `Moto`
- **cambio**: `Manual`, `Automático`, ou `""` se não souber
- **km**: um número, ou `null` para aparecer "Km não informado"
- **destaque**: `true` para o carro poder aparecer no topo da home e no menu
- Sem `capa-hd.jpg`, use `"capaHD": ""`.

A ordem da lista é a ordem do site: o primeiro aparece como mais recente.

## Temas do mês (Natal e outros)

O site se decora sozinho conforme a época. Hoje existe o tema de **Natal**, que entra em 1º de dezembro e sai depois do dia 25. Ele traz:
- luzes piscando embaixo do menu e neve caindo na página inteira, em todas as páginas
- um destaque de Natal como primeiro slide da home
- uma faixa em forma de presente com contagem regressiva
- o selo "Destaque de Natal" nos carros marcados como destaque
- um recado de boas festas no rodapé

Para controlar, mude `tema` em `js/loja.js`:
- `"auto"`: entra e sai sozinho pela data (padrão)
- `"natal"`: deixa o Natal ligado
- `"nenhum"`: desliga qualquer tema

Para ver um tema antes da hora, abra o site com `?tema=natal` no fim do endereço. Para voltar ao normal na mesma aba, use `?tema=auto`.

Os textos do tema ficam em `js/temas.js`. Novos temas (Dia dos Pais, Black Friday, feirão...) são criados lá, no mesmo formato do Natal.

## Conferir antes de publicar

Abra o `index.html` no navegador. Se a home aparecer sem carros, provavelmente falta uma vírgula ou uma aspa no `estoque.js`.

## Publicar

A pasta `shopcar-site` é um site estático: é só subir todos os arquivos para a hospedagem (Hostinger, Netlify, Vercel, GitHub Pages...).

## Pendências

- Os câmbios de 3 carros não estavam informados no site antigo: **S10 Advantage 2007**, **Civic LXL 2011** e **Idea Adventure 2016**. Hoje aparecem como "Consulte". Preencha em `estoque.js`.
- O **Logan Zen 2024** estava sem fotos no site antigo.
- Na S10 Advantage 2007 e na Tiger 1200 o km veio como **100**, que parece erro de cadastro. Hoje aparecem como "Km não informado".
- A SpaceFox estava com km **0**. Também aparece como "Km não informado".
