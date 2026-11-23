# Shopcar Veículos: site

Site da Shopcar Veículos (seminovos em Taguatinga, Brasília/DF). Feito em HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

## Páginas

- `index.html`: home com destaques, busca rápida, recém-chegados, marcas, faixas de preço, simulador de financiamento, venda/troca, sobre e contato
- `estoque.html`: estoque com filtros, ordenação e favoritos
- `veiculo.html?id=<id>`: página de cada veículo, com galeria e botões de WhatsApp

## Atualizar conteúdo

- Carros: `js/estoque.js`
- Telefone, endereço, horários e redes: `js/loja.js`
- Passo a passo: [COMO-ATUALIZAR-ESTOQUE.md](COMO-ATUALIZAR-ESTOQUE.md)

## Rodar localmente

```
python -m http.server 5173
```

Depois abra http://localhost:5173.
