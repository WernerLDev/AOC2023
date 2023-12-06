import * as fs from "fs";

type Race = {
  time: number;
  distance: number;
};

const parseInput = (input: string[]) => {
  const times = input[0].split(":")[1].trim().split(/\s+/);
  const distances = input[1].split(":")[1].trim().split(/\s+/);

  return times.map<Race>((time, index) => {
    return {
      time: parseInt(time),
      distance: parseInt(distances[index]),
    };
  });
};

const calculateDistance = (race: Race, speed: number) => {
  const timeLeft = race.time - speed;
  if (timeLeft < 0) {
    return 0;
  }
  return speed * timeLeft;
};

const calculateNumberOfWays = (race: Race) => {
  let nrWins = 0;
  for (let i = 0; i < race.time; i++) {
    const distance = calculateDistance(race, i);
    if (distance > race.distance) {
      nrWins++;
    }
  }
  return nrWins;
};

const solvePart1 = (races: Race[]) => {
  return races
    .map((race) => {
      return calculateNumberOfWays(race);
    })
    .reduce((a, b) => a * b);
};

const solvePart2 = (input: string[]) => {
  const time = parseInt(input[0].split(":")[1].trim().replaceAll(" ", ""));
  const distance = parseInt(input[1].split(":")[1].trim().replaceAll(" ", ""));

  const race: Race = { time, distance };
  return calculateNumberOfWays(race);
};

const input = fs.readFileSync("day6/input.txt", "utf8").split("\n");
const parsedInput = parseInput(input);

console.log(solvePart1(parsedInput));
console.log(solvePart2(input));
