describe("Board", function () {
  let Board = require('../../js/Board');

  beforeEach(function () {
    board = new Board([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
  });

  it("returns the right size", function () {
    expect(board.size()).toEqual(3);
  });

  it("initially equals to goal", function () {
    expect(board.isGoal()).toEqual(true);
  });

  it("not equals to goal", function () {
    board = new Board([[1, 2, 3], [4, 6, 0], [7, 5, 8]]);
    expect(board.isGoal()).toEqual(false);
  });

  it("is not solvable (8-puzzle)", function () {
    board = new Board([[1, 0, 3], [2, 4, 5], [6, 7, 8]]);
    expect(board.isSolvable()).toEqual(false);
  });

  it("is solvable (8-puzzle)", function () {
    board = new Board([[0, 1, 3], [4, 2, 5], [7, 8, 6]]);
    expect(board.isSolvable()).toEqual(true);
  });

  it("is solvable (15-puzzle)", function () {
    board = new Board([[0, 12, 9, 13], [15, 11, 10, 14], [3, 7, 2, 5], [4, 8, 6, 1]]);
    expect(board.isSolvable()).toEqual(true);
  });
});
