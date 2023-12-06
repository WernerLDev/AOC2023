import * as fs from "fs";

type SingleMapping = {
  sourceStart: number;
  destinationStart: number;
  length: number;
};

type AlmanacMap = {
  name: string;
  mappings: Array<SingleMapping>;
};

type Almanac = {
  seeds: Array<number>;
  maps: Array<AlmanacMap>;
};

const parseInput = (input: string[]): Almanac => {
  const seeds = input[0]
    .split(": ")[1]
    .split(/\s+/)
    .map((x) => parseInt(x));
  const maps = input.slice(1).map<AlmanacMap>((mappings) => {
    const mappingLines = mappings.split("\n");
    const name = mappingLines[0];
    const mapValues = mappingLines
      .slice(1)
      .map((x) => x.split(/\s+/).map((x) => parseInt(x)));
    const parsedMappings = mapValues.map<SingleMapping>((mapping) => {
      return {
        destinationStart: mapping[0],
        sourceStart: mapping[1],
        length: mapping[2],
      };
    });

    return {
      name,
      mappings: parsedMappings,
    };
  });

  return {
    seeds,
    maps: maps,
  };
};

const getLocation = (seed: number, input: Almanac) => {
  const location = input.maps.reduce<number>((output, mapping) => {
    const map = mapping.mappings.find(
      (x) => output >= x.sourceStart && output < x.sourceStart + x.length
    );
    if (map) {
      return map.destinationStart + (output - map.sourceStart);
    } else {
      return output;
    }
  }, seed);
  return location;
};

const solvePart1 = (input: Almanac) => {
  const locations = input.seeds.map((seed) => {
    return getLocation(seed, input);
  });

  return Math.min(...locations);
};

const solvePart2 = (input: Almanac) => {
  console.log(input.seeds.length);
  let lowest: number | undefined = undefined;

  for (let i = 0; i < input.seeds.length; i += 2) {
    const seedLength = input.seeds[i + 1] + input.seeds[i];

    for (let seed = input.seeds[i]; seed < seedLength; seed++) {
      const location = getLocation(seed, input);
      if (lowest == undefined || location < lowest) {
        lowest = location;
      }
    }
  }
  return lowest;
};

const input = fs.readFileSync("day5/input.txt", "utf8").split("\n\n");
const parsedInput = parseInput(input);

const start = performance.now();
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
