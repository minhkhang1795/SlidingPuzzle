class Board {
  constructor(tiles) {
    if (tiles && tiles.constructor === Array && tiles[0].constructor === Array) {
      this.tiles = tiles;
      this._n = tiles.length;
      this._manhattan = -1;
    }
  }

  size() {
    return this._n;
  }

  hashCode() {
    return this.tiles.toString();
  }

  printBoard() {
    if (this.tiles) {
      for (let tile of this.tiles) {
        let rowString = "";
        for (let cell of tile) {
          rowString += cell + "\t";
        }
        console.log(rowString);
      }
      console.log("====".repeat(this._n - 1) + "=");
    } else {
      console.log("Invalid board!");
    }
  }

  isGoal() {
    return this.manhattan() === 0;
  }

  isSolvable() {
    let refs = [];
    let numInv = 0;
    let posFromBottom = 0; // position from bottom of the empty cell (a.k.a 0)

    for (let i = 0; i < this._n; i++) {
      let tile = this.tiles[i];
      for (let value of tile) {
        if (value !== 0) {
          if (refs[value - 1]) // Duplicate check
            return false;
          else
            refs[value - 1] = true;
          for (let k = 0; k < value - 1; k++) {
            if (!refs[k]) {
              numInv++;
            }
          }
        } else {
          posFromBottom = this._n - i;
        }
      }
    }

    if (refs.length !== this._n * this._n - 1) // Check if board uses a different number
      return false;
    if (this._n % 2 !== 0) { // Odd board
      return numInv % 2 === 0;
    } else { // Even board
      return posFromBottom % 2 === 0 && numInv % 2 !== 0 || posFromBottom % 2 !== 0 && numInv % 2 === 0;
    }
  }

  manhattan() {
    if (this._manhattan !== -1)
      return this._manhattan;
    this._manhattan = 0;
    for (let i = 0; i < this._n; i++) {
      for (let j = 0; j < this._n; j++) {
        let value = this.tiles[i][j];
        if (value === 0)
          continue;
        value -= 1;
        let h = Math.abs(j - value % this._n);
        let v = Math.abs(i - Math.floor(value / this._n));
        this._manhattan += h + v;
      }
    }
    return this._manhattan;
  }

  neighbors() {
    let i0 = 0;
    let j0 = 0;

    outerloop:
      for (let i = 0; i < this._n; i++) {
        for (let j = 0; j < this._n; j++) {
          if (this.tiles[i][j] === 0) {
            i0 = i;
            j0 = j;
            break outerloop;
          }
        }
      }

    // The implementation for IDA* in the browser is different from that in Java
    // Because I have to switch from recursion to loops and keep track of the path
    // using Stack, the sign flips from < to >
    let boards = new PriorityQueue((a, b) => a.manhattan() > b.manhattan());

    if (i0 + 1 < this._n) {
      let board = this._clone();
      Board._swap(board.tiles, i0, j0, i0 + 1, j0);
      boards.push(board);
    }
    if (i0 - 1 >= 0) {
      let board = this._clone();
      Board._swap(board.tiles, i0, j0, i0 - 1, j0);
      boards.push(board);
    }
    if (j0 + 1 < this._n) {
      let board = this._clone();
      Board._swap(board.tiles, i0, j0, i0, j0 + 1);
      boards.push(board);
    }
    if (j0 - 1 >= 0) {
      let board = this._clone();
      Board._swap(board.tiles, i0, j0, i0, j0 - 1);
      boards.push(board);
    }
    return boards;
  }

  static _swap(tiles, i1, j1, i2, j2) {
    let temp = tiles[i1][j1];
    tiles[i1][j1] = tiles[i2][j2];
    tiles[i2][j2] = temp;
  }

  _clone() {
    let r = [];
    for (let i = 0; i < this._n; i++) {
      r[i] = [];
      for (let j = 0; j < this._n; j++) {
        r[i][j] = this.tiles[i][j];
      }
    }
    return new Board(r);
  }

  equals(x) {
    if (x && x.constructor === Board) {
      if (x.size() !== this.size()) return false;
      for (let i = 0; i < this._n; i++) {
        for (let j = 0; j < this._n; j++) {
          if (x.tiles[i][j] !== this.tiles[i][j]) return false;
        }
      }
      return true;
    }
    return false;
  }
}