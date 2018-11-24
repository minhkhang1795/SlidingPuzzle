class Stack {
  constructor() {
    this._stack = [];
  }

  size() {
    return this._stack.size();
  }

  isEmpty() {
    return this._stack.size() === 0;
  }

  peek() {
    return this._stack(this.size() - 1);
  }

  push(element) {
    this._stack[this.size()] = element;
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    let result = this._stack[this.size() - 1];
    delete this.storage[this.size() - 1];
    return result;
  }
}