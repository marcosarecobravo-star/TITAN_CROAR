export default class Health {
  constructor(max = 3) {
    this.max = max;
    this.current = max;
  }

  get alive() {
    return this.current > 0;
  }

  damage(amount = 1) {
    if (!this.alive) return 0;
    this.current = Math.max(0, this.current - amount);
    return this.current;
  }

  reset() {
    this.current = this.max;
  }
}
