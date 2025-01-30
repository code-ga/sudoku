function shuffle<T>(array: Array<T>): Array<T> {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isUnique(arr: Array<number>): boolean {
  const nums = arr.filter((num) => num > 0);
  return new Set(nums).size === nums.length;
}

/**
 * Finds the first empty cell in a Sudoku grid.
 * @param grid - The Sudoku grid.
 * @returns The row and column indices of the first empty cell, or an empty array if no empty cells are found.
 */

export function findFirstEmpty(grid: Array<Array<number>>): [number, number] | [] {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return [];
}

/**
 * Finds all empty cells in a Sudoku grid.
 * @param grid - The Sudoku grid.
 * @returns The row and column indices of all empty cells, or an empty array if no empty cells are found.
 */

export function findAllEmpty(grid: Array<Array<number>>): [number, number][] {
  const emptyCells: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }
  return emptyCells;
}

/**
 * Checks if placing a number in a cell is valid according to Sudoku rules.
 * @param grid - The Sudoku grid.
 * @param row - The row index.
 * @param col - The column index.
 * @param num - The number to place.
 * @param outputReason - Whether to output the reason for invalid placement.
 * @returns If outputReason is undefined or false, it'll return boolean, else an object with `valid` indicating if the placement is valid and `reason` providing the reason if invalid.
 */
export function validatePlacement(grid: Array<Array<number>>, row: number, col: number, num: number, outputReason: boolean = false): { valid: boolean, reason?: string } | boolean {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  if (grid[row].includes(num)) {
    const reason = `Number ${num} already exists in row ${row}`;
    if (outputReason) return { valid: false, reason };
    return false;
  }
  if (grid.some((r) => r[col] === num)) {
    const reason = `Number ${num} already exists in column ${col}`;
    if (outputReason) return { valid: false, reason };
    return false;
  }
  if (grid.slice(boxRow, boxRow + 3).some((r) => r.slice(boxCol, boxCol + 3).includes(num))) {
    const reason = `Number ${num} already exists in box starting at (${boxRow}, ${boxCol})`;
    if (outputReason) return { valid: false, reason };
    return false;
  }
  if (outputReason) return { valid: true };
  return true;
}

/**
 * Validates a Sudoku grid.
 * @param puzzle - The Sudoku grid.
 * @param allowZero - Whether zeros are allowed in the grid, usually applicable to checking if a move is legal.
 * @returns True if valid, false otherwise.
 */
export function validate(puzzle: Array<Array<number>>, allowZero: boolean = false): boolean {
  if (puzzle.length !== 9 || puzzle.some(row => row.length !== 9)) {
    throw new Error('Invalid puzzle size');
  }
  for (let i = 0; i < 9; i++) {
    const row = puzzle[i];
    const col = puzzle.map(row => row[i]);
    const box: number[] = [];
    const boxRow = Math.floor(i / 3) * 3;
    const boxCol = (i % 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        box.push(puzzle[boxRow + r][boxCol + c]);
      }
    }
    if (!isUnique(row) || !isUnique(col) || !isUnique(box)) return false;
  }
  return allowZero || puzzle.every(row => row.every(cell => cell > 0));
}

/**
 * Generates a Sudoku puzzle with a specified number of blank cells.
 * @param blank - The number of blank cells.
 * @returns The generated Sudoku grid.
 */
export function generate(blank: number = 0): Array<Array<number>> {
  if (blank < 0 || blank > 81) {
    throw new Error('Invalid number of blanks');
  }

  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  function fillGrid(grid: Array<Array<number>>): boolean {
    const emptyCell = findFirstEmpty(grid);
    if (emptyCell.length === 0) return true;

    const [row, col] = emptyCell;
    shuffle(numbers);
    for (const num of numbers) {
      if (validatePlacement(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(grid)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fillGrid(grid);

  // Remove cells to create blanks
  while (blank > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      blank--;
    }
  }

  return grid;
}

/**
 * Solves a Sudoku puzzle.
 * @param puzzle - The Sudoku grid.
 * @returns The solved grid or throws an error if unsolvable.
 */
export function solve(puzzle: Array<Array<number>>): Array<Array<number>> {
  if (!validate(puzzle, true)) {
    throw new Error('Invalid puzzle');
  }

  function solveHelper(grid: Array<Array<number>>): boolean {
    const emptyCell = findFirstEmpty(grid);
    if (emptyCell.length === 0) return true;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
      if (validatePlacement(grid, row, col, num)) {
        grid[row][col] = num;
        if (solveHelper(grid)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  const gridCopy = puzzle.map(row => [...row]);
  if (!solveHelper(gridCopy)) {
    throw new Error('Unsolvable puzzle');
  }

  return gridCopy;
}