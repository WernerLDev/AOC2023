import * as fs from "fs";

const parseInput = (input: string) => {
  return input.split("\n").map((map) => map.split(""));
};

const findPosition = (x: number, distance: string[]) => {
  if (distance.length == 0) {
    return x;
  }

  for (let i = distance.length - 1; i >= 0; i--) {
    if (distance[i] != ".") {
      return i + 1;
    }
  }
  return 0;
};

const rollNorth = (m: string[][]) => {
  const newMap = [...m];

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[0].length; x++) {
      if (m[y][x] == "O") {
        const cellsNorth = newMap.slice(0, y).map((l) => l[x]);
        const newPosition = findPosition(y, cellsNorth);
        if (newPosition != y) {
          newMap[newPosition][x] = "O";
          newMap[y][x] = ".";
        }
      }
    }
  }
  return newMap;
};

const rollSouth = (m: string[][]) => {
  return rollNorth(m.reverse()).reverse();
};

const rollWest = (m: string[][]) => {
  const newMap = [...m];

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[0].length; x++) {
      if (m[y][x] == "O") {
        const cellsWest = newMap[y].slice(0, x);
        const newPosition = findPosition(x, cellsWest);
        if (newPosition != x) {
          newMap[y][newPosition] = "O";
          newMap[y][x] = ".";
        }
      }
    }
  }
  return newMap;
};

const rollEast = (m: string[][]) => {
  return rollWest(m.map((x) => x.reverse())).map((x) => x.reverse());
};

const calculateLoad = (input: string[][]) => {
  return input
    .map(
      (line, index) =>
        line.filter((x) => x == "O").length * (input.length - index)
    )
    .reduce((a, b) => a + b);
};

const solvePart1 = (input: string[][]) => {
  const rolled = rollNorth(input);
  return calculateLoad(rolled);
};

const solvePart2 = (input: string[][]) => {
  let newInput = [...input];
  let seenCycle = new Map<string, number>();

  for (let cycle = 0; cycle < 1000000000; cycle++) {
    newInput = rollNorth(newInput);
    newInput = rollWest(newInput);
    newInput = rollSouth(newInput);
    newInput = rollEast(newInput);

    const key = newInput.map((x) => x.join("")).join("\n");
    const previous = seenCycle.get(key);
    if (previous && previous < cycle) {
      const cycleLength = cycle - previous;
      const endCycle = ((1000000000 - 1 - previous) % cycleLength) + previous;
      const entries = [...seenCycle.entries()].filter(([_, cycleIndex]) => {
        return endCycle == cycleIndex;
      });
      if (entries.length > 0) {
        return calculateLoad(entries[0][0].split("\n").map((x) => x.split("")));
      }
    }
    seenCycle.set(key, cycle);
  }

  return calculateLoad(newInput);
};

const input = fs.readFileSync("day14/input.txt", "utf8");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
