import { Stock } from './domain/Stock.js'
import { Portfolio } from './domain/Portfolio.js'

// Portafolio de ejemplo:
//  - META y AAPL: las tenemos y estan en el objetivo
//  - TSLA: la tenemos pero no esta en el objetivo (se vende)
//  - GOOGL: esta en el objetivo pero todavia no tenemos ninguno (se compra)
const meta = new Stock('META', 500)
const aapl = new Stock('AAPL', 200)
const tsla = new Stock('TSLA', 250)
const googl = new Stock('GOOGL', 160)

const portfolio = new Portfolio(
  [
    { stock: meta, shares: 10 },
    { stock: aapl, shares: 10 },
    { stock: tsla, shares: 4 },
  ],
  [
    { stock: meta, percent: 40 },
    { stock: aapl, percent: 40 },
    { stock: googl, percent: 20 },
  ],
)

// Texto y colores para cada tipo de orden.
const ACTIONS = {
  BUY: { label: 'Comprar', color: 'text-green-700' },
  SELL: { label: 'Vender', color: 'text-red-700' },
  HOLD: { label: 'Mantener', color: 'text-gray-500' },
}

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const decimals = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 })

export default function App() {
  
  const orders = portfolio.rebalance()

  // Calculamos totales para comprobar si el total vendido pagara el total comprado.
  const totalSell = orders
    .filter((order) => order.action === 'SELL')
    .reduce((total, order) => total + order.amount, 0)
  const totalBuy = orders
    .filter((order) => order.action === 'BUY')
    .reduce((total, order) => total + order.amount, 0)

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Rebalanceo del portafolio</h1>
      <p className="mt-1 text-gray-600">
        Valor total: {dollars.format(portfolio.totalValue())}
      </p>

      <table className="mt-6 w-full text-left">
        <thead className="border-b border-gray-300 text-sm text-gray-500">
          <tr>
            <th className="py-2 font-medium">Símbolo</th>
            <th className="py-2 font-medium">Orden</th>
            <th className="py-2 text-right font-medium">Acciones</th>
            <th className="py-2 text-right font-medium">Monto</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.symbol} className="border-b border-gray-100">
              <td className="py-2 font-medium">{order.symbol}</td>
              <td className={`py-2 ${ACTIONS[order.action].color}`}>
                {ACTIONS[order.action].label}
              </td>
              <td className="py-2 text-right tabular-nums">
                {decimals.format(order.shares)}
              </td>
              <td className="py-2 text-right tabular-nums">
                {dollars.format(order.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm text-gray-600">
        Total a vender: {dollars.format(totalSell)} · Total a comprar:{' '}
        {dollars.format(totalBuy)}
      </p>
    </main>
  )
}
