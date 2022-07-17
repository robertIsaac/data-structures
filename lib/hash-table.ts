export class HashTable<T> {
  private items: { [key: string]: T } = {};

  add(key: string, value: T) {
    this.items[key] = value;
  }

  get(key: string): T {
    return this.items[key];
  }

  remove(key: string): T {
    const value = this.items[key];
    delete this.items[key];
    return value;
  }
}
