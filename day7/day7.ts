import * as fs from "fs";

enum HandEnum {
  "FiveOfAKind" = 7,
  "FourOfAKind" = 6,
  "FullHouse" = 5,
  "ThreeOfAKind" = 4,
  "TwoPair" = 3,
  "OnePair" = 2,
  "HighCard" = 1,
}

type Hand = {
  cards: string;
  bid: number;
};

type HandWithType = Hand & {
  type: HandEnum;
};

const StrengthMap = new Map<string, number>([
  ["A", 13],
  ["K", 12],
  ["Q", 11],
  ["J", 10],
  ["T", 9],
  ["9", 8],
  ["8", 7],
  ["7", 6],
  ["6", 5],
  ["5", 4],
  ["4", 3],
  ["3", 2],
  ["2", 1],
]);

const StrengthMapPart2 = new Map<string, number>([
  ["A", 13],
  ["K", 12],
  ["Q", 11],
  ["J", 0],
  ["T", 9],
  ["9", 8],
  ["8", 7],
  ["7", 6],
  ["6", 5],
  ["5", 4],
  ["4", 3],
  ["3", 2],
  ["2", 1],
]);

const parseInput = (input: string[]) => {
  return input.map<Hand>((line) => {
    const values = line.split(/\s+/);
    const cards = values[0];
    const bid = parseInt(values[1]);
    return { cards, bid };
  });
};

const evaluateHand = (hand: Hand): HandEnum => {
  const cards = [...new Set(hand.cards)];
  const count = cards
    .map((card) => hand.cards.split("").filter((x) => x === card).length)
    .sort();

  if (cards.length === 1) {
    return HandEnum.FiveOfAKind;
  } else if (cards.length === 2 && count[0] === 1) {
    return HandEnum.FourOfAKind;
  } else if (cards.length === 2 && count[0] === 2) {
    return HandEnum.FullHouse;
  } else if (cards.length === 3 && count[0] === 1 && count[1] === 1) {
    return HandEnum.ThreeOfAKind;
  } else if (cards.length === 3 && count[0] === 1 && count[2] === 2) {
    return HandEnum.TwoPair;
  } else if (cards.length === 4 && count[3] === 2) {
    return HandEnum.OnePair;
  } else if (cards.length === 5) {
    return HandEnum.HighCard;
  }
  return HandEnum.HighCard;
};

const sortHands = (
  hands: Array<HandWithType>,
  strengthMap: Map<string, number>
) => {
  return hands.sort((a, b) => {
    if (a.type < b.type) {
      return -1;
    } else if (a.type === b.type) {
      let strongest = 0;
      for (let i = 0; i < a.cards.length; i++) {
        const card1 = strengthMap.get(a.cards[i]) ?? 0;
        const card2 = strengthMap.get(b.cards[i]) ?? 0;
        if (card1 < card2) {
          strongest = -1;
          break;
        } else if (card1 > card2) {
          strongest = 1;
          break;
        }
      }
      return strongest;
    } else {
      return 1;
    }
  });
};

const upgradeWithJoker = (hand: HandWithType): HandWithType => {
  const jokers = hand.cards.split("").filter((x) => x === "J");
  let newType = hand.type;

  if (hand.type === HandEnum.HighCard && jokers.length === 1) {
    newType = HandEnum.OnePair;
  } else if (hand.type == HandEnum.OnePair && jokers.length > 0) {
    newType = HandEnum.ThreeOfAKind;
  } else if (hand.type == HandEnum.TwoPair && jokers.length === 1) {
    newType = HandEnum.FullHouse;
  } else if (hand.type == HandEnum.TwoPair && jokers.length === 2) {
    newType = HandEnum.FourOfAKind;
  } else if (hand.type == HandEnum.ThreeOfAKind && jokers.length > 0) {
    newType = HandEnum.FourOfAKind;
  } else if (hand.type == HandEnum.FullHouse && jokers.length > 0) {
    newType = HandEnum.FiveOfAKind;
  } else if (hand.type == HandEnum.FourOfAKind && jokers.length > 0) {
    newType = HandEnum.FiveOfAKind;
  }

  return {
    ...hand,
    type: newType,
  };
};

const solvePart1 = (hands: Hand[]) => {
  const handsWithType = hands.map<HandWithType>((hand) => {
    return {
      ...hand,
      type: evaluateHand(hand),
    };
  });
  return sortHands(handsWithType, StrengthMap)
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b);
};

const solvePart2 = (hands: Hand[]) => {
  const handsWithType = hands.map<HandWithType>((hand) => {
    return upgradeWithJoker({
      ...hand,
      type: evaluateHand(hand),
    });
  });
  return sortHands(handsWithType, StrengthMapPart2)
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b);
};

const input = fs.readFileSync("day7/input.txt", "utf8").split("\n");
const parsedInput = parseInput(input);

console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
