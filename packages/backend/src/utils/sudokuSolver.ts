import { Difficulty2D, Difficulty3D } from '@sudoworld/shared';

/**
 * Standard 9x9 Sudoku Solver and Generator
 */
export class Sudoku9x9Solver {
  private grid: number[][];
  private solution: number[][];

  constructor(grid?: number[][]) {
    this.grid = grid || Array(9).fill(null).map(() => Array(9).fill(0));
    this.solution = Array(9).fill(null).map(() => Array(9).fill(0));
  }

  /**
   * Solve the sudoku using backtracking
   */
  solve(grid: number[][] = this.grid): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if a number is valid at a position
   */
  private isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }

    return true;
  }

  /**
   * Generate a random valid sudoku puzzle
   */
  generate(): number[][] {
    // Fill diagonal 3x3 boxes
    for (let boxNum = 0; boxNum < 3; boxNum++) {
      const boxRow = boxNum * 3;
      const boxCol = boxNum * 3;
      const nums = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      let idx = 0;
      for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
          this.grid[i][j] = nums[idx++];
        }
      }
    }

    // Solve the rest
    this.solve(this.grid);
    return this.grid;
  }

  /**
   * Create puzzle by removing numbers based on difficulty
   */
  createPuzzle(difficulty: Difficulty2D): { puzzle: number[][], solution: number[][] } {
    const clueCount: Record<Difficulty2D, number> = {
      'baby': 60,
      'beginner': 50,
      'easy': 40,
      'getting_the_hang_of_this': 35,
      'medium': 30,
      'getting_good': 25,
      'tricky': 22,
      'hard': 20,
      'difficult': 17,
      'extreme': 15,
      'diabolical': 12,
      'downright_evil': 10,
      'please_tell_me_this_aint_impossible': 8
    };

    const cells = clueCount[difficulty];
    const puzzle = this.grid.map(row => [...row]);
    this.solution = this.grid.map(row => [...row]);

    const cellsToRemove = 81 - cells;
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return { puzzle, solution: this.solution };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  isComplete(grid: number[][]): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) return false;
      }
    }
    return true;
  }

  isSolved(grid: number[][]): boolean {
    if (!this.isComplete(grid)) return false;

    for (let i = 0; i < 9; i++) {
      const row = grid[i];
      const col = grid.map((g) => g[i]);

      if (new Set(row).size !== 9 || new Set(col).size !== 9) {
        return false;
      }
    }

    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const box: number[] = [];
        for (let i = boxRow; i < boxRow + 3; i++) {
          for (let j = boxCol; j < boxCol + 3; j++) {
            box.push(grid[i][j]);
          }
        }
        if (new Set(box).size !== 9) return false;
      }
    }

    return true;
  }
}

/**
 * 16x16 Hexadecimal Sudoku Solver
 */
export class Sudoku16x16Solver {
  private grid: number[][];

  constructor(grid?: number[][]) {
    this.grid = grid || Array(16).fill(null).map(() => Array(16).fill(0));
  }

  solve(grid: number[][] = this.grid): boolean {
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 16; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 16; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
    }

    const boxRow = Math.floor(row / 4) * 4;
    const boxCol = Math.floor(col / 4) * 4;
    for (let i = boxRow; i < boxRow + 4; i++) {
      for (let j = boxCol; j < boxCol + 4; j++) {
        if (grid[i][j] === num) return false;
      }
    }

    return true;
  }

  generate(): number[][] {
    for (let boxNum = 0; boxNum < 4; boxNum++) {
      const boxRow = boxNum * 4;
      const boxCol = (boxNum % 4) * 4;
      const nums = this.shuffleArray(Array.from({ length: 16 }, (_, i) => i + 1));
      let idx = 0;
      for (let i = boxRow; i < boxRow + 4; i++) {
        for (let j = boxCol; j < boxCol + 4; j++) {
          if (this.grid[i] && this.grid[i][j] === 0) {
            this.grid[i][j] = nums[idx++];
          }
        }
      }
    }
    this.solve(this.grid);
    return this.grid;
  }

  createPuzzle(difficulty: Difficulty2D): { puzzle: number[][], solution: number[][] } {
    const clueCount: Record<Difficulty2D, number> = {
      'baby': 160,
      'beginner': 140,
      'easy': 120,
      'getting_the_hang_of_this': 100,
      'medium': 80,
      'getting_good': 70,
      'tricky': 60,
      'hard': 50,
      'difficult': 40,
      'extreme': 30,
      'diabolical': 25,
      'downright_evil': 20,
      'please_tell_me_this_aint_impossible': 15
    };

    const cells = clueCount[difficulty];
    const puzzle = this.grid.map(row => [...row]);
    const solution = this.grid.map(row => [...row]);

    const cellsToRemove = 256 - cells;
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 16);
      const col = Math.floor(Math.random() * 16);

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return { puzzle, solution };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * 6x6 Irregular Sudoku with Random Block Configuration
 */
export class Sudoku6x6IrregularSolver {
  private grid: number[][];
  private blockConfig: number[][]; // Maps each cell to a block ID

  constructor(grid?: number[][], blockConfig?: number[][]) {
    this.grid = grid || Array(6).fill(null).map(() => Array(6).fill(0));
    this.blockConfig = blockConfig || this.generateBlockConfig();
  }

  /**
   * Generate random valid block configuration
   * One 1x6 or 6x1 strip + remaining 2x3 and 3x2 blocks
   */
  generateBlockConfig(): number[][] {
    const config: number[][] = Array(6).fill(null).map(() => Array(6).fill(0));
    let blockId = 1;

    // Randomly choose: horizontal (1x6) or vertical (6x1) strip
    const isHorizontal = Math.random() > 0.5;
    const stripPosition = Math.floor(Math.random() * 6);

    if (isHorizontal) {
      // Horizontal 1x6 strip
      for (let col = 0; col < 6; col++) {
        config[stripPosition][col] = blockId;
      }
    } else {
      // Vertical 6x1 strip
      for (let row = 0; row < 6; row++) {
        config[row][stripPosition] = blockId;
      }
    }
    blockId++;

    // Fill remaining with random 2x3 and 3x2 blocks
    const remaining = this.getUnfilledCells(config);

    while (remaining.length > 0) {
      const cell = remaining[0];
      const isVerticalBlock = Math.random() > 0.5; // 3x2 (vertical) or 2x3 (horizontal)

      if (isVerticalBlock) {
        // 3x2 block (3 rows, 2 cols)
        const canPlace = this.canPlace3x2Block(config, cell.row, cell.col);
        if (canPlace) {
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
              config[cell.row + i][cell.col + j] = blockId;
            }
          }
          blockId++;
        }
      } else {
        // 2x3 block (2 rows, 3 cols)
        const canPlace = this.canPlace2x3Block(config, cell.row, cell.col);
        if (canPlace) {
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
              config[cell.row + i][cell.col + j] = blockId;
            }
          }
          blockId++;
        }
      }

      remaining.pop();
    }

    return config;
  }

  private canPlace3x2Block(config: number[][], startRow: number, startCol: number): boolean {
    if (startRow + 3 > 6 || startCol + 2 > 6) return false;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 2; j++) {
        if (config[i][j] !== 0) return false;
      }
    }
    return true;
  }

  private canPlace2x3Block(config: number[][], startRow: number, startCol: number): boolean {
    if (startRow + 2 > 6 || startCol + 3 > 6) return false;
    for (let i = startRow; i < startRow + 2; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (config[i][j] !== 0) return false;
      }
    }
    return true;
  }

  private getUnfilledCells(config: number[][]): Array<{ row: number; col: number }> {
    const unfilled: Array<{ row: number; col: number }> = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (config[i][j] === 0) {
          unfilled.push({ row: i, col: j });
        }
      }
    }
    return unfilled;
  }

  solve(grid: number[][] = this.grid): boolean {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 6; num++) {
            if (this.isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isValid(grid: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < 6; i++) {
      if (grid[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 6; i++) {
      if (grid[i][col] === num) return false;
    }

    // Check irregular block
    const blockId = this.blockConfig[row][col];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (this.blockConfig[i][j] === blockId && grid[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  createPuzzle(difficulty: Difficulty2D): { puzzle: number[][], solution: number[][], blockConfig: number[][] } {
    const clueCount: Record<Difficulty2D, number> = {
      'baby': 28,
      'beginner': 24,
      'easy': 20,
      'getting_the_hang_of_this': 18,
      'medium': 16,
      'getting_good': 14,
      'tricky': 12,
      'hard': 10,
      'difficult': 8,
      'extreme': 6,
      'diabolical': 5,
      'downright_evil': 4,
      'please_tell_me_this_aint_impossible': 3
    };

    const cells = clueCount[difficulty];
    const puzzle = this.grid.map(row => [...row]);
    const solution = this.grid.map(row => [...row]);

    const cellsToRemove = 36 - cells;
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 6);
      const col = Math.floor(Math.random() * 6);

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    return { puzzle, solution, blockConfig: this.blockConfig };
  }
}

/**
 * 4x4x4 3D Sudoku Solver
 */
export class Sudoku4x4x4CubeSolver {
  private cube: number[][][];

  constructor(cube?: number[][][]) {
    this.cube = cube || Array(4).fill(null).map(() => Array(4).fill(null).map(() => Array(4).fill(0)));
  }

  solve(cube: number[][][] = this.cube): boolean {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          if (cube[x][y][z] === 0) {
            for (let num = 1; num <= 4; num++) {
              if (this.isValid(cube, x, y, z, num)) {
                cube[x][y][z] = num;
                if (this.solve(cube)) return true;
                cube[x][y][z] = 0;
              }
            }
            return false;
          }
        }
      }
    }
    return true;
  }

  private isValid(cube: number[][][], x: number, y: number, z: number, num: number): boolean {
    // Check X-axis (all points with same y and z)
    for (let i = 0; i < 4; i++) {
      if (cube[i][y][z] === num) return false;
    }

    // Check Y-axis (all points with same x and z)
    for (let i = 0; i < 4; i++) {
      if (cube[x][i][z] === num) return false;
    }

    // Check Z-axis (all points with same x and y)
    for (let i = 0; i < 4; i++) {
      if (cube[x][y][i] === num) return false;
    }

    // Check 2x2x2 subcube
    const subX = Math.floor(x / 2) * 2;
    const subY = Math.floor(y / 2) * 2;
    const subZ = Math.floor(z / 2) * 2;

    for (let i = subX; i < subX + 2; i++) {
      for (let j = subY; j < subY + 2; j++) {
        for (let k = subZ; k < subZ + 2; k++) {
          if (cube[i][j][k] === num) return false;
        }
      }
    }

    return true;
  }

  generate(): number[][][] {
    this.solve(this.cube);
    return this.cube;
  }

  createPuzzle(difficulty: Difficulty3D): { puzzle: number[][][], solution: number[][][] } {
    const clueCount: Record<Difficulty3D, number> = {
      'beginner': 60,
      'easy': 48,
      'medium': 40,
      'hard': 32,
      'extreme': 24
    };

    const cells = clueCount[difficulty];
    const puzzle = this.cube.map(plane => plane.map(row => [...row]));
    const solution = this.cube.map(plane => plane.map(row => [...row]));

    const cellsToRemove = 64 - cells;
    let removed = 0;

    while (removed < cellsToRemove) {
      const x = Math.floor(Math.random() * 4);
      const y = Math.floor(Math.random() * 4);
      const z = Math.floor(Math.random() * 4);

      if (puzzle[x][y][z] !== 0) {
        puzzle[x][y][z] = 0;
        removed++;
      }
    }

    return { puzzle, solution };
  }

  isSolved(cube: number[][][]): boolean {
    // Check all values are between 1 and 4
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          if (cube[x][y][z] < 1 || cube[x][y][z] > 4) return false;
        }
      }
    }

    // Check each axis has 1-4
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const zVals = cube[x][y].sort();
        if (zVals.join('') !== '1234') return false;
      }
    }

    return true;
  }
}
