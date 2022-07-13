export class DoubleLinkedList<T> {
  private head?: DoubleLinkedListItem<T>;
  private tail?: DoubleLinkedListItem<T>;
  private _count = 0;
  get count(): number {
    return this._count;
  }

  private set count(value: number) {
    this._count = value;
  }

  addItemAtEnd(value: T): DoubleLinkedListItem<T> {
    const newItem = new DoubleLinkedListItem(value);
    this.count++;
    if (!this.tail) {
      this.head = newItem;
      this.tail = newItem;
    } else {
      newItem.previous = this.tail;
      this.tail.next = newItem;
      this.tail = newItem;
    }

    return newItem;
  }

  addItemAtStart(value: T): DoubleLinkedListItem<T> {
    const newItem = new DoubleLinkedListItem(value);
    this.count++;
    if (!this.head) {
      this.head = newItem;
      this.tail = newItem;
    } else {
      newItem.next = this.head;
      this.head.previous = newItem;
      this.head = newItem;
    }

    return newItem;
  }

  removeFirstItem(): T {
    if (!this.head) {
      throw Error(`list is empty`);
    }

    const removedItem = this.head;

    if (!this.head.next) {
      // this is the last item
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.head = this.head.next;
      this.head.previous = undefined;
    }

    return removedItem.value;
  }

  removeLastItem(): T {
    if (!this.tail) {
      throw Error(`list is empty`);
    }

    const removedItem = this.tail;

    if (!this.tail.previous) {
      // this is the last item
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.tail = this.tail.previous;
      this.tail.next = undefined;
    }

    return removedItem.value;
  }

  removeItem(item: DoubleLinkedListItem<T>): void {
    if (this.count === 0) {
      throw Error(`can't delete since the list is empty`);
    }

    if (this.count === 1) {
      if (this.head !== item) {
        throw Error(`this item isn't in the list`);
      }

      this.head = undefined;
      this.tail = undefined;
      this.count = 0;
      return;
    }

    if (item.next) {
      item.next.previous = item.previous;
    } else {
      // if it doesn't have next, then it must be the last item aka tail
      if (this.tail !== item || !item.previous) {
        throw Error(`this item isn't in the list`);
      }
      this.tail = item.previous;
      this.tail.next = undefined;
    }

    if (item.previous) {
      item.previous.next = item.next;
    } else {
      // if it doesn't have previous, then it must be the first item aka head
      if (item !== this.head || !item.next) {
        // console.log(item);
        throw Error(`this item isn't in the list`);
      }
      this.head = item.next;
      this.head.previous = undefined;
    }

    this.count--;
  }
}

export class DoubleLinkedListItem<T> {
  public next?: DoubleLinkedListItem<T>;
  public previous?: DoubleLinkedListItem<T>;

  constructor(public value: T) {
  }
}
