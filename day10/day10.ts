import * as fs from "fs";

type GridTile = "S" | "|" | "-" | "L" | "J" | "7" | "F" | ".";
type Grid = Array<Array<GridTile>>;
type Position = { x: number; y: number };

const parseInput = (input: string): Grid => {
  return input
    .split("\n")
    .map<Array<GridTile>>((line) => line.split("").map((x) => x as GridTile));
};

const getValidNeighbors = (currPos: Position, grid: Grid): Array<Position> => {
  const current = grid[currPos.y][currPos.x];

  const north = { x: currPos.x, y: currPos.y - 1 };
  const south = { x: currPos.x, y: currPos.y + 1 };
  const west = { x: currPos.x - 1, y: currPos.y };
  const east = { x: currPos.x + 1, y: currPos.y };

  switch (current) {
    case "-":
      return [west, east];
    case "|":
      return [north, south];
    case "7":
      return [west, south];
    case "F":
      return [south, east];
    case "J":
      return [north, west];
    case "L":
      return [north, east];
    case "S":
      return [north, east, south, west];
    default:
      return [];
  }
};

const getLoop = (start: Position, grid: Grid) => {
  let currPos = start;
  let reachedStart = false;
  let pastSteps: Array<Position> = [];

  while (!reachedStart) {
    const neighbors = getValidNeighbors(currPos, grid);
    const validNeighbors = neighbors.filter((pos) => {
      const value = grid[pos.y][pos.x];
      const isVisited = pastSteps.find(
        (past) => past.x == pos.x && past.y == pos.y
      );
      return value !== "." && isVisited === undefined;
    });
    const nextStep = validNeighbors[0];
    if (nextStep === undefined) {
      pastSteps.push(currPos);
      reachedStart = true;
    } else {
      pastSteps.push(currPos);
      currPos = nextStep;
    }
  }
  return pastSteps;
};

const findStart = (grid: Grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == "S") {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
};

const solvePart1 = (grid: Grid) => {
  const startPosition = findStart(grid);
  const loop = getLoop(startPosition, grid);
  return Math.ceil(loop.length / 2);
};

const fillGrid = (grid: Grid, loop: Array<Position>) => {
  let newGrid: number[][] = [];
  for (let y = 0; y < grid.length; y++) {
    newGrid.push([]);
    for (let x = 0; x < grid[y].length; x++) {
      const isLoop = loop.find((p) => p.x == x && p.y == y);
      newGrid[y].push(isLoop ? 1 : 0);
    }
  }
  return newGrid;
};

const resizeGrid = (
  grid: Grid,
  converted: number[][],
  loop: Array<Position>
) => {
  let resized: number[][] = [];
  for (let y = 0; y < converted.length * 3; y++) {
    resized.push([]);
    for (let x = 0; x < converted[0].length * 3; x++) {
      resized[y].push(0);
    }
  }

  loop.forEach((p) => {
    const char = grid[p.y][p.x];
    if (char == "-") {
      resized[p.y * 3 + 1][p.x * 3] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 2] = 1;
    } else if (char == "|") {
      resized[p.y * 3][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 2][p.x * 3 + 1] = 1;
    } else if (char == "7") {
      resized[p.y * 3 + 1][p.x * 3] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 2][p.x * 3 + 1] = 1;
    } else if (char == "F") {
      resized[p.y * 3 + 1][p.x * 3 + 2] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 2][p.x * 3 + 1] = 1;
    } else if (char == "J" || char == "S") {
      // Hardcoded, changes depending on input
      resized[p.y * 3][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3] = 1;
    } else if (char == "L") {
      resized[p.y * 3][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 1] = 1;
      resized[p.y * 3 + 1][p.x * 3 + 2] = 1;
    }
  });

  return resized;
};

const floodFill = (x: number, y: number, grid: Number[][]) => {
  const stack: Array<Position> = [{ x, y }];

  while (stack.length) {
    let p = stack.pop();
    if (!p) return;
    if (p.x < 0 || p.y < 0 || p.y >= grid.length || p.x >= grid[0].length) {
      continue;
    } else if (grid[p.y][p.x] != 0 || grid[p.y][p.x] == 2) {
      continue;
    } else if (grid[p.y][p.x] == 0) {
      grid[p.y][p.x] = 2;
    }

    stack.push({ x: p.x - 1, y: p.y });
    stack.push({ y: p.y - 1, x: p.x });
    stack.push({ x: p.x + 1, y: p.y });
    stack.push({ y: p.y + 1, x: p.x });
  }
};

const countZeroes = (grid: number[][], resizedGrid: number[][]) => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const checkResized = resizedGrid[y * 3 + 1][x * 3 + 1];
      if (checkResized == 0) {
        count++;
      }
    }
  }
  return count;
};

const solvePart2 = (grid: Grid) => {
  const startPosition = findStart(grid);
  const loop = getLoop(startPosition, grid);

  const convertedGrid = fillGrid(grid, loop);
  const resizedGrid = resizeGrid(grid, convertedGrid, loop);

  floodFill(0, 0, resizedGrid);
  // resizedGrid.forEach((x) => {
  //   console.log(x.join(""));
  // });

  return countZeroes(convertedGrid, resizedGrid);
};

const input = fs.readFileSync("day10/input.txt", "utf8");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
