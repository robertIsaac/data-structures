import { DoublyLinkedList, DoublyLinkedListItem } from '../lib/doubly-linked-list';
import { HashTable } from '../lib/hash-table';

export class MostRecentlyUsedCache<T> {
  private cachedItems = new HashTable<Item<T>>();
  private mostRecentlyUsedItemIds = new DoublyLinkedList<string>();

  constructor(private dataSource: DataSource<T>, private cacheSize: number) {
  }

  get(id: string): T {
    const item = this.cachedItems.get(id);
    if (item) {
      this.mostRecentlyUsedItemIds.removeItem(item.listItem);
      item.listItem = this.mostRecentlyUsedItemIds.addTail(id);
      return item.value;
    } else {
      const value = this.dataSource.get(id);
      if (this.mostRecentlyUsedItemIds.count >= this.cacheSize) {
        const removedId = this.mostRecentlyUsedItemIds.removeHead();
        this.cachedItems.remove(removedId);
      }
      const newListItem = this.mostRecentlyUsedItemIds.addTail(id);
      const newItem = new Item(value, newListItem);
      this.cachedItems.add(id, newItem);

      return value;
    }
  }
}

class Item<T> {
  constructor(public value: T, public listItem: DoublyLinkedListItem<string>) {
  }
}

export interface DataSource<T> {
  get(id: string): T;
}
