import * as fs from "fs";

const parseInput = (input: string) => {
  return input
    .split("\n")
    .map((line) => line.split(/\s+/).map((x) => parseInt(x)));
};

const getDiffArray = (numbers: number[]) => {
  const diffArr = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    diffArr.push(numbers[i + 1] - numbers[i]);
  }
  return diffArr;
};

const isAllZero = (numbers: number[]) => {
  const numberSet = new Set(numbers);
  return numberSet.size == 1 && numberSet.has(0);
};

const findNextValue = (numbers: number[]): number => {
  if (isAllZero(numbers)) return 0;
  const lastNumber = numbers[numbers.length - 1];
  return lastNumber + findNextValue(getDiffArray(numbers));
};

const findPreviousValue = (numbers: number[]): number => {
  if (isAllZero(numbers)) return 0;
  return numbers[0] - findPreviousValue(getDiffArray(numbers));
};

const solvePart1 = (input: number[][]) => {
  return input.map((line) => findNextValue(line)).reduce((a, b) => a + b);
};

const solvePart2 = (input: number[][]) => {
  return input.map((line) => findPreviousValue(line)).reduce((a, b) => a + b);
};

const input = fs.readFileSync("day9/input.txt", "utf8");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
