class Cell {
  constructor(id, element) {
    this.id = id;
    this.element = element;
  }
}

const LEFT = 0,
  RIGHT = 1,
  TOP = 2,
  BOTTOM = 3,
  RED_COLOR = "#ff4444",
  ORANGE_COLOR = "#ffbb33",
  GREEN_COLOR = "#00C851"

class Puzzle {

  constructor(gridElement) {
    this.n = gridElement[0].classList.contains("puzzle15") ? 4 : 3;
    this.gridElement = gridElement;
    this.grid = this.createUIGrid();
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
    let number = event.target.id;
    this.moveIfValid(this.grid, number);
  }

  moveIfValid(grid, number) {
    outerloop:
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
          const cell = grid[i][j];
          if (parseInt(number) === cell.id) {
            if (i !== 0 && grid[i - 1][j].id === 0) {
              this._move(cell, i, j, LEFT);
            } else if (i !== this.n - 1 && grid[i + 1][j].id === 0) {
              this._move(cell, i, j, RIGHT);
            } else if (j !== 0 && grid[i][j - 1].id === 0) {
              this._move(cell, i, j, TOP);
            } else if (j !== this.n - 1 && grid[i][j + 1].id === 0) {
              this._move(cell, i, j, BOTTOM);
            }
            break outerloop;
          }
        }
      }
  }

  _move(cell, i, j, direction) {
    function updateUI(i, j) {
      cell.element.style.top = i * 90 + "px";
      cell.element.style.left = j * 90 + "px";
    }

    switch (direction) {
      case LEFT:
        [this.grid[i][j], this.grid[i - 1][j]] = [this.grid[i - 1][j], this.grid[i][j]];
        updateUI(i - 1, j);
        break;
      case RIGHT:
        [this.grid[i][j], this.grid[i + 1][j]] = [this.grid[i + 1][j], this.grid[i][j]];
        updateUI(i + 1, j);
        break;
      case TOP:
        [this.grid[i][j], this.grid[i][j - 1]] = [this.grid[i][j - 1], this.grid[i][j]];
        updateUI(i, j - 1);
        break;
      case BOTTOM:
        [this.grid[i][j], this.grid[i][j + 1]] = [this.grid[i][j + 1], this.grid[i][j]];
        updateUI(i, j + 1);
        break;
      default:
        break;
    }
    console.log(this.grid);
  }
}