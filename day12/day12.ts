import * as fs from "fs";

type SpringConditions = {
  conditions: string;
  groupSizes: number[];
};

const parseInput = (input: string[]) => {
  return input.map<SpringConditions>((line) => {
    const [conditions, groups] = line.split(/\s+/);
    return {
      conditions,
      groupSizes: groups.split(",").map((x) => parseInt(x)),
    };
  });
};

let combinations = new Map<string, string[]>();

const calculateCombinations = (line: SpringConditions) => {
  let memoized = combinations.get(line.conditions + line.groupSizes.join(","));
  if (memoized) {
    return memoized;
  }

  let totalBroken = line.groupSizes.reduce((a, b) => a + b);
  let stack: string[] = [line.conditions];
  let variation: string[] = [];

  while (stack.length) {
    const item = stack.pop();
    if (!item) return [];

    const chars = item.split("");
    const questions = chars.filter((x) => x == "?").length;
    const numBroken = chars.filter((x) => x === "#").length;

    if (questions > 0 && numBroken < totalBroken) {
      stack.push(item.replace("?", "."));
      stack.push(item.replace("?", "#"));
    } else if (numBroken == totalBroken) {
      variation.push(item);
    }
  }
  const output = variation.filter((v) => {
    const groups = v
      .replaceAll("?", ".")
      .replaceAll(".", " ")
      .trim()
      .split(/\s+/);

    const groupSizes = groups.map((x) => x.length).join(",");
    return groupSizes == line.groupSizes.join(",");
  });

  combinations.set(line.conditions + line.groupSizes.join(","), output);
  return output;
};

const solvePart1 = (input: SpringConditions[]) => {
  return input
    .map((line) => {
      const result = calculateCombinations(line);
      return result.length;
    })
    .reduce((a, b) => a + b);
};

const solvePart2 = (input: SpringConditions[]) => {
  return input
    .map((line) => {
      const resized = [line, line, line, line, line].reduce((a, b) => {
        return {
          conditions: a.conditions + b.conditions,
          groupSizes: [...a.groupSizes, ...b.groupSizes],
        };
      });

      const result = calculateCombinations(resized);
      return result.length;
    })
    .reduce((a, b) => a + b);
};

const input = fs.readFileSync("day12/input.txt", "utf8").split("\n");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
// console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
