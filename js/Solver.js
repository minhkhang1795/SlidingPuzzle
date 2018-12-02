const MAX_TIME = 60000;

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
  constructor(initBoard, solType = 0) {
    this.minMoves = -1;
    this.solutionState = new State(initBoard, 0, null);
    this.solType = solType;
    this.timeInterval = null;
    this.totalTime = -1;
    this.startTime = new Date();
  }

  isSolvable() {
    return this.solutionState.board.isSolvable();
  }

  isSolved() {
    return this.solutionState.board.isGoal();
  }

  timeIsUp() {
    return new Date() - this.startTime > MAX_TIME;
  }

  solution(shouldPrint = false) {
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
      return {success: false, r: null};

    if (this.isSolved()) {
      this._finalizeSolution(this.solutionState);
      return {success: true, r: null};
    }

    let r = $.Deferred();
    switch (this.solType) {
      case 1:
        this._solveAStar(r);
        break;
      default:
        this._solveIDAStar(r);
    }
    return {success: true, r: r};
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
        clearInterval(this.timeInterval);
        r.resolve();
      }
    }, 0, open, closed);
  }

  _solveIDAStar(r) {
    let bound = this.solutionState.cost;
    let root = this.solutionState;
    let ctx = this;
    let stack = new Stack();
    let path = new Stack();
    let min = [];
    this.timeInterval = setInterval(function () {
      if (ctx.timeIsUp() || ctx.isSolved()) {
        clearInterval(this.timeInterval);
        r.resolve();
      } else if (!stack || stack.isEmpty()) {
        stack = new Stack();
        path = new Stack();
        bound = min.length === 0 ? root.cost : min[0];
        min[0] = Number.MAX_VALUE;
        path.push(root);
        let neighbors = root.board.neighbors();
        while (!neighbors.isEmpty()) {
          let state = new State(neighbors.pop(), root.moves + 1, root);
          stack.push(state);
        }
      } else {
        let state = stack.pop();
        if (!path.contains(state)) {
          while (!state.prev.equals(path.peek())) { // Make sure that path is sequentially connected
            path.pop();
          }
          if (state.board.isGoal()) {
            ctx._finalizeSolution(state);
            r.resolve(); // FOUND SOLUTION
            return;
          }
          path.push(state);
          if (state.cost > bound) {
            min[0] = state.cost < min[0] ? state.cost : min[0];
          } else {
            let neighbors = state.board.neighbors();
            while (!neighbors.isEmpty()) {
              let temp = new State(neighbors.pop(), state.moves + 1, state);
              if (!path.contains(temp)) {
                stack.push(temp);
              }
            }
          }
        }
      }
    }, 0, root, stack, path, bound, min);
  }

  _finalizeSolution(finalState) {
    this.solutionState = finalState;
    this.minMoves = finalState.moves;
    this.totalTime = new Date() - this.startTime;
    clearInterval(this.timeInterval);
    this.solution();
  }

  consoleLog() {
    console.log(this.solType === 1 ? "A* Solution" : "IDA* Solution");
    console.log("Time: " + this.totalTime + " ms");
    console.log("Total moves: " + this.minMoves);
  }
}