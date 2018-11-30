const topFunc = 0;
const parentFunc = i => ((i + 1) >>> 1) - 1;
const leftFunc = i => (i << 1) + 1;
const rightFunc = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }

  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this._heap[topFunc];
  }

  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }

  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > topFunc) {
      this._swap(topFunc, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }

  replace(value) {
    const replacedValue = this.peek();
    this._heap[topFunc] = value;
    this._siftDown();
    return replacedValue;
  }

  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this.size() - 1;
    while (node > topFunc && this._greater(node, parentFunc(node))) {
      this._swap(node, parentFunc(node));
      node = parentFunc(node);
    }
  }

  _siftDown() {
    let node = topFunc;
    while (
      (leftFunc(node) < this.size() && this._greater(leftFunc(node), node)) ||
      (rightFunc(node) < this.size() && this._greater(rightFunc(node), node))
      ) {
      let maxChild = (rightFunc(node) < this.size() && this._greater(rightFunc(node), leftFunc(node))) ? rightFunc(node) : leftFunc(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
