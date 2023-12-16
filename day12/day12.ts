import * as fs from "fs";
import memoize from "fast-memoize";

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

const checkPattern = memoize(
  (pattern: string, amountsLeft: number[], isEnd: boolean): number => {
    if (pattern.length == 0) {
      return amountsLeft.length > 0 ? 0 : 1;
    }

    if (amountsLeft.length == 0) {
      return pattern.split("").some((x) => x == "#") ? 0 : 1;
    }

    if (pattern[0] == ".") {
      checkPattern(pattern.slice(1), amountsLeft, false);
    }

    if (isEnd) {
      return pattern[0] != "#"
        ? checkPattern(pattern.slice(1), amountsLeft, false)
        : 0;
    }

    let numberOfResult = 0;
    const currentAmount = amountsLeft[0];

    if (
      pattern
        .slice(0, currentAmount)
        .split("")
        .every((x) => x != ".") &&
      pattern.length >= currentAmount
    ) {
      numberOfResult += checkPattern(
        pattern.slice(currentAmount),
        amountsLeft.slice(1),
        true
      );
    }

    if (pattern[0] != "#") {
      numberOfResult += checkPattern(pattern.slice(1), amountsLeft, false);
    }
    return numberOfResult;
  }
);

const solvePart1 = (input: SpringConditions[]) => {
  return input
    .map((line) => {
      const result = checkPattern(line.conditions, line.groupSizes, false);
      return result;
    })
    .reduce((a, b) => a + b);
};

const solvePart2 = (input: SpringConditions[]) => {
  return input
    .map((line) => {
      const resized = [line, line, line, line, line].reduce((a, b) => {
        return {
          conditions: a.conditions + "?" + b.conditions,
          groupSizes: [...a.groupSizes, ...b.groupSizes],
        };
      });

      const result = checkPattern(
        resized.conditions,
        resized.groupSizes,
        false
      );
      return result;
    })
    .reduce((a, b) => a + b);
};

const input = fs.readFileSync("day12/input.txt", "utf8").split("\n");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
