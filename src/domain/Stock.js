/**
 * Cada accion tiene: su simbolo (ej. "META") y su ultimo precio.
 */
export class Stock {
  constructor(symbol, price) {
    this.symbol = symbol
    this.price = price
  }

  /**
   * Devuelve el precio actual.
   */
  currentPrice() {
    return this.price
  }
}
