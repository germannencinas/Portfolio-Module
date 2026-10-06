/**
* Un portafolio tiene dos listas:
* - holdings:   acciones que tenemos [{ stock, shares }]
* - allocation: reparto de acciones que buscamos [{ stock, percent }]
*/
export class Portfolio {
  constructor(holdings, allocation) {
    // El objetivo debe sumar 100%
    // Dejamos un margen de 0.0001 para detectar errores
    const sum = allocation.reduce((total, { percent }) => total + percent, 0)
    if (Math.abs(sum - 100) > 0.0001) {
      throw new Error(`La asignación debe sumar 100% (actualmente suma ${sum}%)`)
    }

    this.holdings = holdings
    this.allocation = allocation
  }

  /* Valor total: suma de (acciones × precio actual). */
  totalValue() {
    return this.holdings.reduce(
      (total, { stock, shares }) => total + shares * stock.currentPrice(),
      0,
    )
  }

  /**
   * Calcula que vender y que comprar para llegar a la asignacion que se necesita.
   *
   * Se calcula el valor total actual de cada accion (total × su porcentaje)
   * Y la diferencia contra lo que vale hoy nos dice que hacer:
   * si falta dinero en esa acción se compra y si sobra, se vende.
   */
  
  rebalance() {
    const total = this.totalValue()
    const orders = []

    // Compramos las acciones que se necesitan para llegar al porcentaje que se requiere
    // Si todavia no tenemos una (ej: GOOGL), su valor actual es 0 y se compra desde 0.
    for (const { stock, percent } of this.allocation) {
      const holding = this.holdings.find((h) => h.stock.symbol === stock.symbol)
      const currentValue = holding ? holding.shares * stock.currentPrice() : 0
      const targetValue = (total * percent) / 100
      orders.push(createOrder(stock, targetValue - currentValue))
    }

    // Si tenemos acciones que no estan en el objetivo las vendemos
    for (const { stock, shares } of this.holdings) {
      const isInAllocation = this.allocation.some((a) => a.stock.symbol === stock.symbol)
      if (!isInAllocation) {
        orders.push(createOrder(stock, -shares * stock.currentPrice()))
      }
    }

    return orders
  }
}

/**
 * Crear la ordenes de accion, segun la diferencia que exista
 * Diferencia positiva = falta dinero en esa accion (comprar)
 * Diferencia negativa = sobra (vender).
 */
function createOrder(stock, difference) {
  
  let action = 'HOLD'
  if (difference >= 0.01) action = 'BUY'
  if (difference <= -0.01) action = 'SELL'

  const amount = action === 'HOLD' ? 0 : Math.abs(difference)

  return {
    symbol: stock.symbol,
    action,
    amount,
    shares: amount / stock.currentPrice(),
  }
}
