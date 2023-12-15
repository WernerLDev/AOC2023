import * as fs from "fs";

type Lens = {
  label: string;
  focal: number;
};

const calculateLabel = (seq: string) => {
  const chars = seq.split("");
  return chars.reduce((result, char) => {
    return ((result + char.charCodeAt(0)) * 17) % 256;
  }, 0);
};

const solvePart1 = (input: string) => {
  return input
    .split(",")
    .map((seq) => calculateLabel(seq))
    .reduce((a, b) => a + b);
};

const solvePart2 = (input: string) => {
  const boxes = new Map<number, Lens[]>();

  input.split(",").forEach((seq) => {
    if (seq.indexOf("-") > -1) {
      const [label, _] = seq.split("-");
      const boxNr = calculateLabel(label);
      const content = boxes.get(boxNr) ?? [];
      boxes.set(
        boxNr,
        content.filter((x) => x.label !== label)
      );
    } else {
      const [label, lens] = seq.split("=");
      const boxNr = calculateLabel(label);
      const content = boxes.get(boxNr) ?? [];
      const existing = content.findIndex((x) => x.label == label);
      if (existing > -1) {
        content[existing] = { label, focal: parseInt(lens) };
      } else {
        content.push({ label, focal: parseInt(lens) });
      }
      boxes.set(boxNr, content);
    }
  });

  return [...boxes.entries()]
    .flatMap(([index, lenses]) => {
      return lenses.map((lens, slot) => {
        return (index + 1) * (slot + 1) * lens.focal;
      });
    })
    .reduce((a, b) => a + b);
};

const input = fs.readFileSync("day15/input.txt", "utf8");
// const parsedInput = parseInput(input);
// parsedInput.forEach((line) => console.log(line.join("")));

const start = performance.now();

console.log(solvePart1(input));
console.log(solvePart2(input));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
