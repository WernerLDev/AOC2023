import * as fs from "fs";

type Position = {
  x: number;
  y: number;
};

const parseInput = (input: string) => {
  return input.split("\n").map((line) => line.split(""));
};

const findPairs = (input: string[][]) => {
  const galaxies: Position[] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] == "#") {
        galaxies.push({ x, y });
      }
    }
  }

  return galaxies.flatMap((v, i) => galaxies.slice(i + 1).map((w) => [v, w]));
};

const expandGalaxy = (input: string[][]) => {
  let output: string[][] = [];

  for (let y = 0; y < input.length; y++) {
    output.push(input[y]);
    if (!input[y].find((x) => x == "#")) {
      output.push(input[y].map((x) => "E"));
    }
  }

  for (let y = 0; y < output.length; y++) {
    const out = [];
    for (let x = 0; x < input[0].length; x++) {
      out.push(output[y][x]);
      if (!input.find((line) => line[x] == "#")) {
        out.push("E");
      }
    }
    output[y] = out;
  }
  return output;
};

const distance = (p1: Position, p2: Position) => {
  const y = Math.abs(p2.y - p1.y);
  const x = Math.abs(p2.x - p1.x);
  return y + x;
};

const distanceWithExpansion = (
  p1: Position,
  p2: Position,
  grid: string[][]
) => {
  const expansionRate = 1000000 - 1;

  let expansions = 0;
  if (p1.x < p2.x) {
    for (let i = p1.x; i < p2.x; i++) {
      if (grid[p1.y][i] == "E") {
        expansions++;
      }
    }
  } else if (p1.x > p2.x) {
    for (let i = p2.x; i < p1.x; i++) {
      if (grid[p1.y][i] == "E") {
        expansions++;
      }
    }
  }

  if (p1.y < p2.y) {
    for (let i = p1.y; i < p2.y; i++) {
      if (grid[i][p2.x] == "E") {
        expansions++;
      }
    }
  } else if (p1.y > p2.y) {
    for (let i = p2.y; i < p1.y; i++) {
      if (grid[i][p2.x] == "E") {
        expansions++;
      }
    }
  }

  return distance(p1, p2) - expansions + expansions * expansionRate;
};

const solvePart1 = (input: string[][]) => {
  const expanded = expandGalaxy(input);

  const pairs = findPairs(expanded);
  const out = pairs
    .map((pair) => distance(pair[0], pair[1]))
    .reduce((a, b) => a + b);
  return out;
};

const solvePart2 = (input: string[][]) => {
  const expanded = expandGalaxy(input);
  const pairs = findPairs(expanded);

  return pairs
    .map((p) => distanceWithExpansion(p[0], p[1], expanded))
    .reduce((a, b) => a + b);
};

const input = fs.readFileSync("day11/input.txt", "utf8");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
