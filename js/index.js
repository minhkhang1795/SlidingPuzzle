class Cell {
  constructor(id, element) {
    this.id = id;
    this.element = element;
  }
}

const LEFT = 1,
  RIGHT = -1,
  TOP = 2,
  BOTTOM = -2,
  RED_COLOR = "#ff4444",
  ORANGE_COLOR = "#ffbb33",
  GREEN_COLOR = "#00C851",
  TRANSITION_DELAY = 200;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Puzzle {

  constructor(gridElement) {
    this.n = gridElement[0].classList.contains("puzzle15") ? 4 : 3;
    this.gridElement = gridElement;
    this.grid = this.createUIGrid();
    this.isRunning = false;
  }

  createUIGrid() {
    let grid = [];

    function getColor(i, j) {
      if (i === 0 || j === 0)
        return RED_COLOR;
      else if (i === 1 || j === 1)
        return ORANGE_COLOR;
      else
        return GREEN_COLOR;
    }

    for (let i = 0; i < this.n; i++) {
      let row = [];
      for (let j = 0; j < this.n; j++) {
        let number = i * this.n + j + 1;
        if (number === this.n * this.n) {
          row.push(new Cell(0)); // Add a fake cell with null UI element
          break;
        }

        // Create Cell UI component
        let cellElement = $("<div class='cell'>" + number + "</div>").css({
          top: 90 * i,
          left: 90 * j,
          backgroundColor: getColor(i, j)
        })[0];
        cellElement.addEventListener("click", this.onCellClicked.bind(this));
        cellElement.setAttribute("id", number);
        // Append to puzzle div
        this.gridElement[0].append(cellElement);
        // Add cell to Grid[][]
        row.push(new Cell(number, cellElement));
      }
      grid.push(row);
    }
    return grid;
  }

  onCellClicked(event) {
    if (this.isRunning)
      return;
    let number = event.target.id;
    this.moveNumberIfValid(parseInt(number));
  }

  getCellForNumber(number) {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const cell = this.grid[i][j];
        if (number === cell.id) {
          return {cell: cell, i: i, j: j};
        }
      }
    }
    return undefined;
  }

  moveNumberIfValid(number) {
    let cell = this.getCellForNumber(number);
    if (!cell || number === 0)
      return {success: false, defer: null};
    let direction;
    if (cell.i !== 0 && this.grid[cell.i - 1][cell.j].id === 0) {
      direction = LEFT;
    } else if (cell.i !== this.n - 1 && this.grid[cell.i + 1][cell.j].id === 0) {
      direction = RIGHT;
    } else if (cell.j !== 0 && this.grid[cell.i][cell.j - 1].id === 0) {
      direction = TOP;
    } else if (cell.j !== this.n - 1 && this.grid[cell.i][cell.j + 1].id === 0) {
      direction = BOTTOM;
    }
    return this._move(cell.cell, cell.i, cell.j, direction);
  }


  _move(cell, i, j, direction) {
    function updateUI(x, y) {
      let r = $.Deferred();

      // do whatever you want (e.g. ajax/animations other asyc tasks)
      cell.element.style.top = x * 90 + "px";
      cell.element.style.left = y * 90 + "px";

      setTimeout(function () {
        // and call `resolve` on the deferred object, once you're done
        r.resolve();
      }, TRANSITION_DELAY);

      return r;
    }

    switch (direction) {
      case LEFT:
        [this.grid[i][j], this.grid[i - 1][j]] = [this.grid[i - 1][j], this.grid[i][j]];
        return {success: true, defer: updateUI(i - 1, j)};
      case RIGHT:
        [this.grid[i][j], this.grid[i + 1][j]] = [this.grid[i + 1][j], this.grid[i][j]];
        return {success: true, defer: updateUI(i + 1, j)};
      case TOP:
        [this.grid[i][j], this.grid[i][j - 1]] = [this.grid[i][j - 1], this.grid[i][j]];
        return {success: true, defer: updateUI(i, j - 1)};
      case BOTTOM:
        [this.grid[i][j], this.grid[i][j + 1]] = [this.grid[i][j + 1], this.grid[i][j]];
        return {success: true, defer: updateUI(i, j + 1)};
      default:
        return {success: false, defer: null};
    }
  }

  /**
   * Check if the board is busy and determine which button was clicked to perform the action
   * @param control String: name of the control action
   */
  onControlClicked(control) {
    if (this.isRunning)
      return;
    this._setIsRunning(true);
    switch (control) {
      case "shuffle":
        this.shuffle();
        break;
      case "AStar":
        this.solve(1);
        break;
      case "IDAStar":
        this.solve(0);
        break;
      default:
        this._setIsRunning(false);
    }
  }

  _setIsRunning(bool) {
    $("#puzzle-mask").css('display', bool ? 'block' : 'none');
    $("#shuffleBtn")[0].disabled = bool;
    $("#ABtn")[0].disabled = bool;
    $("#IDABtn")[0].disabled = bool;
    this.isRunning = bool;
  }

  /**
   * Shuffle function to randomly perform 10 moves
   * @param moves Number: number of moves
   * @param prevDirection Number: previous moved direction
   */
  shuffle(moves = 10, prevDirection) {
    if (moves <= 0) {
      this._setIsRunning(false);
      return;
    }
    let ctx = this;
    let direction = getRandomInt(-2, 2);
    let emptyCell = this.getCellForNumber(0);
    let adjacentCell = this.getAdjacentCellWithPosition(emptyCell, direction);
    if (adjacentCell && direction !== -prevDirection) {
      let result = this.moveNumberIfValid(adjacentCell.id);
      if (result.success) {
        result.defer.done(function () {
          ctx.shuffle(moves - 1, direction);
        });
      } else {
        ctx.shuffle(moves, prevDirection);
      }
    } else {
      ctx.shuffle(moves, prevDirection);
    }
  }

  solve(type) {
    // Generate grid[][] from puzzle
    let grid = [];
    for (let i = 0; i < this.n; i++) {
      grid[i] = [];
      for (let j = 0; j < this.n; j++) {
        grid[i].push(this.grid[i][j].id)
      }
    }
    // Create board and solver objects
    let board = new Board(grid);
    let solver = new Solver(board, type);
    let result = solver.solve();
    let ctx = this;
    // Handle the result asynchronously
    if (result.success) {
      if (result.r) {
        result.r.done(function () {
          if (solver.isSolved()) {
            ctx._updateInfo(solver);
            ctx._solveWithResult(solver.solution());
          } else {
            ctx._updateInfo(solver);
            ctx._setIsRunning(false);
          }
        });
      } else {
        ctx._updateInfo(solver);
        this._setIsRunning(false);
      }
    } else {
      console.log("Solution not found.");
      alert("You messed up with the board. So sorry, no solution for you!");
      this._setIsRunning(false);
    }
  }

  _solveWithResult(steps) {
    function moveFrom(currStep, nextStep, ctx) {
      let number = -1;
      for (let i = 0; i < currStep.tiles.length; i++) {
        for (let j = 0; j < currStep.tiles.length; j++) {
          let diff = currStep.tiles[i][j] - nextStep.tiles[i][j];
          if (diff !== 0) {
            number = Math.abs(diff);
            break;
          }
        }
      }
      return ctx.moveNumberIfValid(number);
    }

    let ctx = this;
    if (steps && steps.length > 1) {
      let currStep = steps[steps.length - 1];
      let nextStep = steps[steps.length - 2];
      let result = moveFrom(currStep, nextStep, ctx);
      if (result && result.success) {
        result.defer.done(function () {
          ctx._solveWithResult(steps.slice(0, steps.length - 1));
        });
      } else {
        this._setIsRunning(false);
      }
    } else {
      this._setIsRunning(false);
    }
  }

  /**
   *
   * @param cell Object{Cell cell, Number i, Number j}: the cell we're considering
   * @param direction Number: indicates the direction of the adjacent cell
   * @returns Cell: the adjacent cell at direction
   */
  getAdjacentCellWithPosition(cell, direction) {
    if (!cell)
      return undefined;
    switch (direction) {
      case LEFT:
        return cell.i - 1 >= 0 ? this.grid[cell.i - 1][cell.j] : undefined;
      case RIGHT:
        return cell.i + 1 < this.n ? this.grid[cell.i + 1][cell.j] : undefined;
      case TOP:
        return cell.j - 1 >= 0 ? this.grid[cell.i][cell.j - 1] : undefined;
      case BOTTOM:
        return cell.j + 1 < this.n ? this.grid[cell.i][cell.j + 1] : undefined;
      default:
        return undefined;
    }
  }

  _updateInfo(solver) {
    $("#infoText").html("<kbd>" + (solver.solType === 0 ? "IDA*" : "A*") + " Solution</kbd>\n" +
      "Estimated moves: " + solver.estMoves + "\n" +
      "Actual moves: " + solver.minMoves + "\n" +
      "Total time: " + (solver.isSolved() ? (solver.totalTime + "ms") : "TIME LIMIT EXCEEDED"));
    solver.consoleLog();
  }

  /**
   * Use this function to generate board
   * with a specific estimated moves
   * @param moves
   * @param prevDirection
   */
  generateBoard(moves = 10, prevDirection) {
    // Generate grid[][] from puzzle
    let grid = [];
    for (let i = 0; i < this.n; i++) {
      grid[i] = [];
      for (let j = 0; j < this.n; j++) {
        grid[i].push(this.grid[i][j].id)
      }
    }
    // Create board and solver objects
    let board = new Board(grid);
    console.log(board.manhattan());
    if (board.manhattan() >= moves || !this.isRunning) {
      this._setIsRunning(false);
      return;
    }
    let ctx = this;
    let direction = getRandomInt(-2, 2);
    let emptyCell = this.getCellForNumber(0);
    let adjacentCell = this.getAdjacentCellWithPosition(emptyCell, direction);
    if (adjacentCell && direction !== -prevDirection) {
      let result = this.moveNumberIfValid(adjacentCell.id);
      if (result.success) {
        result.defer.done(function () {
          ctx.generateBoard(moves, direction);
        });
      } else {
        ctx.generateBoard(moves, prevDirection);
      }
    } else {
      ctx.generateBoard(moves, prevDirection);
    }
  }

  printBoard() {
    // Generate grid[][] from puzzle
    let grid = "{";
    for (let i = 0; i < this.n; i++) {
      grid += "{";
      for (let j = 0; j < this.n; j++) {
        grid += this.grid[i][j].id;
        if (j !== this.n - 1)
          grid += ", ";
      }
      grid += "}";
      if (i !== this.n - 1)
        grid += ", ";
    }
    grid += "}";
    console.log(grid);
  }
}