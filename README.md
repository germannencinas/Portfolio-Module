# Rebalanceo de portafolio

Modulo para administracion de portafolio para una app de inversiones.
A partir de lo que tienes y del reparto que buscas (ej. 40% META, 60% AAPL), calcula que acciones debes vender y cuales debes comprar.

## Run

```bash
npm install
npm run dev
```

## Estructura

- `src/domain/Stock.js`: una accion, con su simbolo y `currentPrice()`.
- `src/domain/Portfolio.js`: acciones que se tienen (`holdings`), asignaciones que buscamos (`allocation`), `totalValue()` y `rebalance()`.
- `src/App.jsx`: portafolio de ejemplo y tabla con el resultado.


## Metodo `rebalance()`

1. Calcula el valor total del portafolio.
2. Para cada accion del objetivo, calcula cuanto deberia valer
   (`total × porcentaje`) y lo compara con lo que vale hoy, si falta dinero en
   esa accion para poder balancear, se compra y si sobra, se vende.
3. Las acciones que se tienen pero no estan en el objetivo se venden completas
4. La diferencia en dolares se divide entre el precio para saber cuantas
   acciones operar.

Ejemplo de `App.jsx`, con un valor total de $8,000:

| Accion | Objetivo | Deberia valer | Vale hoy | Orden |
|---|---|---|---|---|
| META | 40% | $3,200 | $5,000 | Vender $1,800 (3.6 acciones) |
| AAPL | 40% | $3,200 | $2,000 | Comprar $1,200 (6 acciones) |
| GOOGL | 20% | $1,600 | $0 | Comprar $1,600 (10 acciones) |
| TSLA | — | $0 | $1,000 | Vender $1,000 (4 acciones) |

Se venden $2,800 y se compran $2,800.

