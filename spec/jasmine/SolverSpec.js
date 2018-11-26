describe("Solver", function () {
  let Board = require('../../js/Board');
  let Solver = require('../../js/Solver');

  it("solves 8-puzzle #1 with IDAStar", function () {
    board = new Board([[1, 2, 3], [4, 5, 6], [7, 0, 8]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(1);
  });

  it("solves 8-puzzle #2 with IDAStar", function () {
    board = new Board([[0, 1, 3], [4, 2, 5], [7, 8, 6]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(4);
  });

  it("solves 8-puzzle #3 with IDAStar", function () {
    board = new Board([[2, 3, 6], [1, 5, 0], [4, 7, 8]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(7);
  });

  it("solves 8-puzzle #4 with IDAStar", function () {
    board = new Board([[0, 3, 5], [2, 1, 8], [4, 7, 6]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(12);
  });

  it("solves 8-puzzle #5 with IDAStar", function () {
    board = new Board([[3, 5, 6], [1, 2, 8], [0, 4, 7]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(16);
  });

  it("solves 8-puzzle #6 with IDAStar", function () {
    board = new Board([[3, 5, 2], [6, 0, 1], [7, 8, 4]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(22);
  });

  it("solves 8-puzzle #7 with IDAStar", function () {
    board = new Board([[6, 4, 7], [8, 5, 0], [3, 2, 1]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(31);
  });

  it("solves 8-puzzle #8 with IDAStar", function () {
    board = new Board([[8, 6, 7], [2, 5, 4], [3, 0, 1]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(31);
  });

  it("solves 15-puzzle #1 with IDAStar", function () {
    board = new Board([[4, 6, 3, 0], [1, 2, 7, 12], [8, 5, 9, 14], [10, 11, 13, 15]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(43);
  });

  it("solves 15-puzzle #2 with IDAStar", function () {
    board = new Board([[6, 8, 0, 4], [13, 9, 10, 14], [15, 2, 12, 5], [1, 3, 7, 11]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(50);
  });

  it("solves 15-puzzle #3 with IDAStar", function () {
    board = new Board([[2, 7, 4, 3], [1, 12, 8, 6], [0, 14, 15, 9], [13, 5, 11, 10]]);
    solver = new Solver(board);
    expect(solver.isSolvable()).toEqual(true);
    solver.solve();
    expect(solver.minMoves).toEqual(40);
  });

  // it("solves 15-puzzle #4 with IDAStar", function () {
  //   board = new Board([[2, 3, 1, 9], [5, 4, 7, 11], [10, 0, 14, 15], [12, 8, 6, 13]]);
  //   solver = new Solver(board);
  //   expect(solver.isSolvable()).toEqual(true);
  //   solver.solve();
  //   expect(solver.minMoves).toEqual(51);
  // });
});