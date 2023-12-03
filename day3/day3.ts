import * as fs from "fs";

const extractNumbersFromLine = (line: string) => {
  let numbers: Map<number, string> = new Map();
  let currentNumber = "";
  for (let i = 0; i < line.length; i++) {
    const isNumber = !isNaN(+line[i]);
    if (currentNumber.length > 0 && !isNumber) {
      numbers.set(i - currentNumber.length, currentNumber);
      currentNumber = "";
    } else if (isNumber) {
      currentNumber += line[i];
    }
  }

  if (currentNumber.length > 0) {
    numbers.set(line.length - currentNumber.length, currentNumber);
  }

  return numbers;
};

const isPartSymbol = (char: string) => {
  return isNaN(+char) && char !== ".";
};

const isGearSymbol = (char: string) => {
  return char === "*";
};

const isPart = (input: string[], x: number, y: number, value: string) => {
  let foundPartSymbol = false;

  for (let i = -1; i < value.length + 1; i++) {
    if (
      isPartSymbol(input[y - 1]?.[x + i] ?? ".") ||
      isPartSymbol(input[y][x + i] ?? ".") ||
      isPartSymbol(input[y + 1]?.[x + i] ?? ".")
    ) {
      foundPartSymbol = true;
    }
  }

  return foundPartSymbol;
};

const getGears = (input: string[], x: number, y: number, value: string) => {
  let gearLocation: [number, number] | undefined = undefined;

  for (let i = -1; i < value.length + 1; i++) {
    if (isGearSymbol(input[y - 1]?.[x + i] ?? ".")) {
      gearLocation = [x + i, y - 1];
    }

    if (isGearSymbol(input[y][x + i] ?? ".")) {
      gearLocation = [x + i, y];
    }

    if (isGearSymbol(input[y + 1]?.[x + i] ?? ".")) {
      gearLocation = [x + i, y + 1];
    }
  }

  return gearLocation;
};

const solvePart1 = (lines: string[]) => {
  let sumOfParts = 0;

  for (let lineNr = 0; lineNr < lines.length; lineNr++) {
    const line = lines[lineNr];
    const numbersMap = extractNumbersFromLine(line);

    numbersMap.forEach((number, position) => {
      const isPartNumber = isPart(lines, position, lineNr, number);
      if (isPartNumber) {
        sumOfParts += parseInt(number);
      }
    });
  }

  return sumOfParts;
};

const solvePart2 = (lines: string[]) => {
  const gears: Map<String, string[]> = new Map();

  for (let lineNr = 0; lineNr < lines.length; lineNr++) {
    const line = lines[lineNr];
    const numbersMap = extractNumbersFromLine(line);

    numbersMap.forEach((number, position) => {
      const gearLocation = getGears(lines, position, lineNr, number);
      if (gearLocation !== undefined) {
        const key = gearLocation.toString();
        gears.set(key, [...(gears.get(key) ?? []), number]);
      }
    });
  }

  let sumOfGears = 0;
  gears.forEach((numbers, _) => {
    if (numbers.length == 2) {
      const n1 = parseInt(numbers[0]);
      const n2 = parseInt(numbers[1]);
      sumOfGears += n1 * n2;
    }
  });

  return sumOfGears;
};

const input = fs.readFileSync("day3/input.txt", "utf8").split("\n");
console.log(solvePart1(input));
console.log(solvePart2(input));
