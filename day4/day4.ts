import * as fs from "fs";

type Card = {
  cardId: string;
  winningNumbers: Set<number>;
  scratchedNumbers: Array<number>;
};

const parseLine = (line: string): Card => {
  const values = /^Card\s+(\d+)\: (.+)\ \|\ (.+)/g.exec(line);

  const winningNumbers = (values?.[2] ?? "")
    .trim()
    .split(/\s+/)
    .map((x) => parseInt(x));
  const scratchedNumbers = (values?.[3] ?? "")
    .trim()
    .split(/\s+/)
    .map((x) => parseInt(x));

  return {
    cardId: values?.[1] ?? "-1",
    winningNumbers: new Set(winningNumbers),
    scratchedNumbers: scratchedNumbers,
  };
};

const getWinningNumbers = (card: Card) => {
  return card.scratchedNumbers.filter((x) => card.winningNumbers.has(x));
};

const getPointsForCard = (card: Card) => {
  const winningNumbers = getWinningNumbers(card);
  if (winningNumbers.length == 0) {
    return 0;
  }
  return Math.pow(2, winningNumbers.length - 1);
};

const solvePart1 = (input: string[]) => {
  return input
    .map((line) => {
      const card = parseLine(line);
      return getPointsForCard(card);
    })
    .reduce((a, b) => a + b);
};

const getWinningCards = (card: Card, cardsMap: Map<number, Card>): number => {
  const winningCards = getWinningNumbers(card);
  return (
    Array.from(Array(winningCards.length))
      .map((_, index) => {
        const wonCard = cardsMap.get(index + 1 + parseInt(card.cardId));
        if (wonCard) {
          return getWinningCards(wonCard, cardsMap);
        }
        return 0;
      })
      .reduce((a, b) => a + b, 0) + winningCards.length
  );
};

const solvePart2 = (input: string[]) => {
  const cards = input.map(parseLine);
  const cardsMap = new Map(cards.map((x) => [parseInt(x.cardId), x]));

  return (
    cards
      .map((card) => getWinningCards(card, cardsMap))
      .reduce((a, b) => a + b) + cards.length
  );
};

const start = performance.now();
const input = fs.readFileSync("day4/input.txt", "utf8").split("\n");
console.log(solvePart1(input));
console.log(solvePart2(input));
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
