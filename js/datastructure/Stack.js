class Stack {
  constructor() {
    this._stack = [];
    this._n = 0;
  }

  size() {
    return this._n;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._stack[this.size() - 1];
  }

  push(element) {
    this._stack[this.size()] = element;
    this._n++;
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    let result = this._stack[this.size() - 1];
    this._n--;
    return result;
  }

  contains(x) {
    if (x && !this.isEmpty()) {
      for (let elem of this._stack) {
        if (elem.equals(x))
          return true;
      }
    }
    return false;
  }
}

module.exports = Stack;