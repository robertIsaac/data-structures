export class HashTable<T> {
  private items: { [key: string]: T } = {};

  insertItem(key: string, value: T) {
    this.items[key] = value;
  }

  getItem(key: string): T {
    return this.items[key];
  }

  deleteItem(key: string): T {
    const value = this.items[key];
    delete this.items[key];
    return value;
  }
}
