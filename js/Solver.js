let Stack = require('./datastructure/Stack');
let PriorityQueue = require('./datastructure/PriorityQueue');

class State {
  constructor(board, moves, prevState) {
    this.board = board;
    this.moves = moves;
    this.prev = prevState;
    this.cost = moves + board.manhattan();
    this.hashCode = this.board.hashCode();
  }

  equals(x) {
    if (x && x.constructor === State) {
      return this.hashCode === x.hashCode;
    }
    return false;
  }
}

class Solver {
  constructor(initBoard, solType = 1) {
    this.minMoves = -1;
    this.solutionState = new State(initBoard, 0, null);
    this.solved = false;
    this._solType = solType;
  }

  isSolvable() {
    return this.solutionState.board.isSolvable();
  }

  solution() {
    if (this.solved) {
      let state = this.solutionState;
      let list = [];
      while (state != null) {
        state.board.printBoard();
        list.push(state.board);
        state = state.prev;
      }
      return list;
    }
  }

  solve() {
    if (!this.solved && !this.isSolvable())
      return -1;
    switch (this._solType) {
      case 0:
        this._solveIDAStar();
        break;
      case 1:
        this._solveAStar();
        break;
      default:
        this._solveIDAStar();
    }
    this.solved = true;
    this.solution();
  }

  _solveIDAStar() {
    let bound = this.solutionState.cost;
    let path = new Stack();
    let pathRef = new Set();
    path.push(this.solutionState);
    pathRef.add(this.solutionState.hashCode);
    while (!this.solutionState.board.isGoal()) {
      bound = this._searchIDAStar(path, pathRef, this.solutionState.cost, bound);
      console.log(bound);
    }
    this.minMoves = this.solutionState.moves;
  }

  _searchIDAStar(path, pathRef, cost, bound) {
    let currState = path.peek();
    if (cost > bound) {
      return cost;
    }
    if (currState.board.isGoal()) {
      this.solutionState = currState;
      return -Math.abs(cost); // FOUND SOLUTION
    }
    let min = Number.MAX_VALUE;
    let neighbors = currState.board.neighbors();
    while (!neighbors.isEmpty()) {
      let state = new State(neighbors.pop(), currState.moves + 1, currState);
      if (!pathRef.has(state.hashCode)) {
        path.push(state);
        pathRef.add(state.hashCode);
        let t = this._searchIDAStar(path, pathRef, state.cost, bound);
        if (t < 0) {
          return t; // FOUND SOLUTION
        }
        if (t < min) {
          min = t;
        }
        path.pop();
        pathRef.delete(state.hashCode);
      }
    }
    return min;
  }

  _solveAStar() {
    let open = new PriorityQueue((a, b) => a.cost === b.cost ? b.moves < a.moves : a.cost < b.cost);
    let closed = new Map();
    open.push(this.solutionState);
    closed.set(this.solutionState.hashCode, this.solutionState.cost);
    while (!open.isEmpty()) {
      let currState = open.pop();
      if (currState.board.isGoal()) {
        // Stop search
        this.solutionState = currState;
        this.minMoves = currState.moves;
        break;
      }
      let neighbors = currState.board.neighbors();
      while (!neighbors.isEmpty()) {
        let state = new State(neighbors.pop(), currState.moves + 1, currState);
        if (!closed.has(state.hashCode) || closed.get(state.hashCode) > state.cost) {
          open.push(state);
          closed.set(state.hashCode, state.cost);
        }
      }
    }
  }

}

module.exports = Solver;