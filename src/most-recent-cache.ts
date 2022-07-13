import { DoubleLinkedList, DoubleLinkedListItem } from '../lib/double-linked-list';
import { HashTable } from '../lib/hash-table';

export class MostRecentCache<T> {
  private items = new HashTable<Item<T>>();
  private mostRecentItemIds = new DoubleLinkedList<string>();

  constructor(private fetcher: Fetcher<T>, private cacheSize: number) {
  }

  get(id: string): T {
    const item = this.items.getItem(id);
    if (item) {
      this.mostRecentItemIds.removeItem(item.listItem);
      item.listItem = this.mostRecentItemIds.addItemAtEnd(id);
      return item.value;
    } else {
      const value = this.fetcher.get(id);
      if (this.mostRecentItemIds.count >= this.cacheSize) {
        const removedId = this.mostRecentItemIds.removeFirstItem();
        this.items.deleteItem(removedId);
      }
      const newListItem = this.mostRecentItemIds.addItemAtEnd(id);
      const newItem = new Item(value, newListItem);
      this.items.insertItem(id, newItem);

      return value;
    }
  }
}

class Item<T> {
  constructor(public value: T, public listItem: DoubleLinkedListItem<string>) {
  }
}

export interface Fetcher<T> {
  get(id: string): T;
}
