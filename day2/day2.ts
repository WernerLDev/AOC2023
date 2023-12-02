import * as fs from "fs";

type RevealedCubes = {
  red: number;
  blue: number;
  green: number;
};

type Game = {
  gameId: number;
  revealedCubes: RevealedCubes[];
  valid?: boolean;
  power?: number;
};

const parseHand = (hand: string): RevealedCubes => {
  return {
    red: parseInt(/(\d+) red/.exec(hand)?.[1] ?? "0"),
    blue: parseInt(/(\d+) blue/.exec(hand)?.[1] ?? "0"),
    green: parseInt(/(\d+) green/.exec(hand)?.[1] ?? "0"),
  };
};

const parseLineToGame = (line: string): Game => {
  const input = line.split(": ");

  const gameIdRegex = /^Game (\d+)/g;
  const gameId = parseInt(gameIdRegex.exec(input[0])?.[1] ?? "0");

  return {
    gameId: gameId,
    revealedCubes: input[1].split("; ").map(parseHand),
  };
};

const isValid = (hand: RevealedCubes) => {
  const maxRed = 12;
  const maxBlue = 14;
  const maxGreen = 13;

  return hand.red <= maxRed && hand.blue <= maxBlue && hand.green <= maxGreen;
};

const solvePart1 = (games: Game[]) => {
  const parsedGames = games.map((game) => {
    const invalidHands = game.revealedCubes.filter((hand) => !isValid(hand));

    return {
      ...game,
      valid: invalidHands.length === 0,
    };
  });

  return parsedGames
    .filter((game) => game.valid)
    .reduce((a, b) => a + b.gameId, 0);
};

const solvePart2 = (games: Game[]) => {
  return games
    .map((game) => {
      const maxRed = Math.max(...game.revealedCubes.map((x) => x.red));
      const maxBlue = Math.max(...game.revealedCubes.map((x) => x.blue));
      const maxGreen = Math.max(...game.revealedCubes.map((x) => x.green));
      const powerOfSet = maxRed * maxBlue * maxGreen;

      return { ...game, power: powerOfSet };
    })
    .reduce((a, b) => a + b.power, 0);
};

const input = fs.readFileSync("day2/input.txt", "utf8").split("\n");
const games = input.map(parseLineToGame);

console.log(solvePart1(games));
console.log(solvePart2(games));
