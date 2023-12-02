import * as fs from "fs";

const solvePart1 = (lines: string[]) => {
  return lines
    .map((line) => {
      const numbers = line.split("").filter((char) => !isNaN(+char));
      const first = numbers[0];
      const last = numbers[numbers.length - 1];
      return first + last;
    })
    .reduce<number>((previous, current) => {
      return previous + parseInt(current);
    }, 0);
};

const solvePart2 = (lines: string[]) => {
  return lines.map((line) => {
    const newLine = line.split("").map((char, index) => {
      if (!isNaN(+char)) {
        return char;
      } else if (line.indexOf("one", index) === index) {
        return "1";
      } else if (line.indexOf("two", index) === index) {
        return "2";
      } else if (line.indexOf("three", index) === index) {
        return "3";
      } else if (line.indexOf("four", index) === index) {
        return "4";
      } else if (line.indexOf("five", index) === index) {
        return "5";
      } else if (line.indexOf("six", index) === index) {
        return "6";
      } else if (line.indexOf("seven", index) === index) {
        return "7";
      } else if (line.indexOf("eight", index) === index) {
        return "8";
      } else if (line.indexOf("nine", index) === index) {
        return "9";
      } else {
        return char;
      }
    });

    return newLine.join("");
  });
};

const input = fs.readFileSync("day1/input.txt", "utf8").split("\n");
console.log(solvePart1(input));
console.log(solvePart1(solvePart2(input)));
