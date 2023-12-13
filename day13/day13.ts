import * as fs from "fs";

type Pattern = {
  m: string[];
};

const parseInput = (input: string[]) => {
  return input.map<Pattern>((line) => {
    return {
      m: line.split("\n"),
    };
  });
};

const findMirror = (pattern: Pattern) => {
  const validResults = [];

  for (let y = 1; y < pattern.m.length; y++) {
    const previous = pattern.m[y - 1];
    if (previous == pattern.m[y]) {
      const size = Math.min(y - 1, pattern.m.length - 1 - y);
      const top = pattern.m.slice(y - 1 - size, y - 1).join("\n");
      const bottom = pattern.m
        .slice(y + 1, y + 1 + size)
        .reverse()
        .join("\n");
      if (top == bottom) {
        validResults.push(y * 100);
      }
    }
  }

  for (let x = 1; x < pattern.m[0].length; x++) {
    const previous = pattern.m.map((line) => line[x - 1]).join("");
    const current = pattern.m.map((line) => line[x]).join("");
    if (current == previous) {
      const size = Math.min(x - 1, pattern.m[0].length - 1 - x);
      const before = pattern.m
        .map((line) => line.slice(x - 1 - size, x - 1))
        .join("\n");
      const after = pattern.m
        .map((line) =>
          line
            .slice(x + 1, x + 1 + size)
            .split("")
            .reverse()
            .join("")
        )
        .join("\n");
      if (before == after) {
        validResults.push(x);
      }
    }
  }

  return validResults;
};

const fixSmudge = (pattern: Pattern) => {
  const previousMirror = findMirror(pattern);
  for (let y = 0; y < pattern.m.length; y++) {
    for (let x = 0; x < pattern.m[0].length; x++) {
      let updatedPattern = [...pattern.m.map((x) => x.split(""))];
      updatedPattern[y][x] = pattern.m[y][x] == "." ? "#" : ".";
      const result = findMirror({
        m: updatedPattern.map((line) => line.join("")),
      });
      if (result.length > 0) {
        const newResult = result.filter((x) => x != previousMirror[0]);
        if (newResult.length > 0) {
          return newResult[0];
        }
      }
    }
  }
  return previousMirror[0];
};

const solvePart1 = (input: Pattern[]) => {
  return input
    .map((map) => {
      return findMirror(map)[0];
    })
    .reduce((a, b) => a + b);
};

const solvePart2 = (input: Pattern[]) => {
  return input.map((m) => fixSmudge(m)).reduce((a, b) => a + b);
};

const input = fs.readFileSync("day13/input.txt", "utf8").split("\n\n");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
