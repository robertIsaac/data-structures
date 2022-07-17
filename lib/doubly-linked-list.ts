export class DoublyLinkedList<T> {
  private head?: DoublyLinkedListItem<T>;
  private tail?: DoublyLinkedListItem<T>;
  private _count = 0;
  get count(): number {
    return this._count;
  }

  private set count(value: number) {
    this._count = value;
  }

  addTail(value: T): DoublyLinkedListItem<T> {
    const newItem = new DoublyLinkedListItem(value, undefined, this.tail);
    this.count++;
    if (!this.tail) {
      // this is the first item in the list
      this.head = newItem;
      this.tail = newItem;
    } else {
      this.tail.next = newItem;
      this.tail = newItem;
    }

    return newItem;
  }

  addHead(value: T): DoublyLinkedListItem<T> {
    const newItem = new DoublyLinkedListItem(value, this.head);
    this.count++;
    if (!this.head) {
      // this is the first item in the list
      this.head = newItem;
      this.tail = newItem;
    } else {
      this.head.previous = newItem;
      this.head = newItem;
    }

    return newItem;
  }

  removeHead(): T {
    if (!this.head) {
      throw Error(`list is empty`);
    }

    const removedItem = this.head;
    this.head.previous = undefined;
    this.head = this.head.next;

    return removedItem.value;
  }

  removeTail(): T {
    if (!this.tail) {
      throw Error(`list is empty`);
    }

    const removedItem = this.tail;
    this.tail.next = undefined;
    this.tail = this.tail.previous;

    return removedItem.value;
  }

  removeItem(item: DoublyLinkedListItem<T>): void {
    if (this.count === 0) {
      throw Error(`can't delete since the list is empty`);
    }

    if (item.next) {
      item.next.previous = item.previous;
    } else {
      // this must the tail
      if (this.tail !== item || !item.previous) {
        throw Error(`this item isn't in the list`);
      }

      this.tail = item.previous;
      this.tail.next = undefined;
    }

    if (item.previous) {
      item.previous.next = item.next;
    } else {
      // this must be the head
      if (item !== this.head || !item.next) {
        throw Error(`this item isn't in the list`);
      }

      this.head = item.next;
      this.head.previous = undefined;
    }

    this.count--;
  }
}

export class DoublyLinkedListItem<T> {
  constructor(public value: T, public next?: DoublyLinkedListItem<T>, public previous?: DoublyLinkedListItem<T>) {
  }
}
