const MAX_TIME = 3000;

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
    this._solType = solType;
    this.timeInterval = null;
    this.totalTime = -1;
    this.startTime = new Date();
  }

  isSolvable() {
    return this.solutionState.board.isSolvable();
  }

  isSolved() {
    return this.minMoves !== -1;
  }

  timeIsUp() {
    return new Date() - this.startTime > MAX_TIME;
  }

  solution(shouldPrint=false) {
    if (this.isSolved()) {
      let state = this.solutionState;
      let list = [];
      while (state != null) {
        if (shouldPrint)
          state.board.printBoard();
        list.push(state.board);
        state = state.prev;
      }
      return list;
    }
  }

  solve() {
    if (!this.isSolvable())
      return null;

    let r = $.Deferred();
    switch (this._solType) {
      case 1:
        this._solveAStar(r);
        break;
      default:
        this._solveIDAStar(r);
    }
    return r;
  }

  _solveAStar(r) {
    let ctx = this;
    let open = new PriorityQueue((a, b) => a.cost === b.cost ? b.moves < a.moves : a.cost < b.cost);
    let closed = new Map();
    open.push(this.solutionState);
    closed.set(this.solutionState.hashCode, this.solutionState.cost);

    this.timeInterval = setInterval(function () {
      if (!ctx.isSolved() && !open.isEmpty() && !ctx.timeIsUp()) {
        let currState = open.pop();
        if (currState.board.isGoal()) {
          // Stop search
          ctx._finalizeSolution(currState);
          r.resolve();
        }
        let neighbors = currState.board.neighbors();
        while (!neighbors.isEmpty()) {
          let state = new State(neighbors.pop(), currState.moves + 1, currState);
          if (!closed.has(state.hashCode) || closed.get(state.hashCode) > state.cost) {
            open.push(state);
            closed.set(state.hashCode, state.cost);
          }
        }
      } else {
        r.resolve();
      }
    }, 0, open, closed);
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
  }

  _searchIDAStar(path, pathRef, cost, bound) {
    let currState = path.peek();
    if (cost > bound) {
      return cost;
    }
    if (currState.board.isGoal()) {
      this._finalizeSolution(currState);
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

  _finalizeSolution(currState) {
    this.solutionState = currState;
    this.minMoves = currState.moves;
    this.totalTime = new Date() - this.startTime;
    clearInterval(this.timeInterval);
    this.solution();
  }
}