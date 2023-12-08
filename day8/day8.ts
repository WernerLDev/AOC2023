import * as fs from "fs";

type PuzzleMap = {
  instructions: string;
  nodes: Map<string, Directions>;
};

type Directions = {
  left: string;
  right: string;
};

const parseInput = (input: string): PuzzleMap => {
  const [instructions, nodes] = input.split("\n\n");
  const parsedNodes = nodes.split("\n").map((node) => {
    const values = /^([A-Z0-9]+)\s+\=\s+\(([A-Z0-9]+)\,\s+([A-Z0-9]+)\)/.exec(
      node
    );
    const left = values?.[2] ?? "";
    const right = values?.[3] ?? "";
    const out: [string, Directions] = [values?.[1] ?? "", { left, right }];
    return out;
  });

  return {
    instructions,
    nodes: new Map(parsedNodes),
  };
};

const solvePart1 = (
  map: PuzzleMap,
  start: string,
  isEnd: (_: string) => boolean
) => {
  let currentIndex = 0;
  let stepsTaken = 0;
  let currentNode = start;

  let times = 0;

  while (times < 1) {
    const node = map.nodes.get(currentNode);
    let nextInstruction = map.instructions[currentIndex];
    currentIndex =
      currentIndex >= map.instructions.length - 1 ? 0 : currentIndex + 1;

    if (nextInstruction === "L") {
      currentNode = node?.left ?? "";
    } else {
      currentNode = node?.right ?? "";
    }

    stepsTaken++;

    if (isEnd(currentNode)) {
      times++;
    }
  }

  return stepsTaken;
};

const gcd = (a: number, b: number): number => {
  if (a == 0) return b;
  return gcd(b % a, a);
};

const lcm = (a: number, b: number) => {
  return (a * b) / gcd(a, b);
};

const solvePart2 = (map: PuzzleMap) => {
  let currentNodes = [...map.nodes.keys()].filter((x) => x.endsWith("A"));

  const nodeLoops = currentNodes
    .map((node) => {
      return solvePart1(map, node, (x) => x.endsWith("Z"));
    })
    .sort();

  return nodeLoops.reduce((a, b) => lcm(a, b));
};

const input = fs.readFileSync("day8/input.txt", "utf8");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput, "AAA", (x) => x === "ZZZ"));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
