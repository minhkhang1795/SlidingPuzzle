let Stack = require('./datastructure/Stack');
let PriorityQueue = require('./datastructure/PriorityQueue');

class State {
  constructor(board, moves, prevState) {
    this.board = board;
    this.moves = moves;
    this.prev = prevState;
    this.cost = moves + board.manhattan();
  }

  equals(x) {
    if (x && x.constructor === State) {
      return this.board.equals(x.board);
    }
    return false;
  }
}

class Solver {
  constructor(initBoard, solType = 0) {
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
    path.push(this.solutionState);
    while (!this.solutionState.board.isGoal()) {
      bound = this._searchIDAStar(path, this.solutionState.cost, bound);
      console.log(bound);
    }
    this.minMoves = this.solutionState.moves;
  }
  _searchIDAStar(path, cost, bound) {
    let currState = path.peek();
    if (cost > bound) {
      return cost;
    }
    if (currState.board.isGoal()) {
      this.solutionState = currState;
      return -Math.abs(cost); // FOUND SOLUTION
    }
    let min = Number.MAX_VALUE;
    for (let neighbor of currState.board.neighbors()) {
      let state = new State(neighbor, currState.moves + 1, currState);
      if (!path.contains(state)) {
        path.push(state);
        let t = this._searchIDAStar(path, state.cost, bound);
        if (t < 0) {
          return t; // FOUND SOLUTION
        }
        if (t < min) {
          min = t;
        }
        path.pop();
      }
    }
    return min;
  }

  _solveAStar() {

  }

}

module.exports = Solver;