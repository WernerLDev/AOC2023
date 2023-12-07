import * as fs from "fs";

type HandType =
  | {
      name: "FiveOfAKind";
      strength: 7;
    }
  | {
      name: "FourOfAKind";
      strength: 6;
    }
  | {
      name: "FullHouse";
      strength: 5;
    }
  | {
      name: "ThreeOfAKind";
      strength: 4;
    }
  | {
      name: "TwoPair";
      strength: 3;
    }
  | {
      name: "OnePair";
      strength: 2;
    }
  | {
      name: "HighCard";
      strength: 1;
    };

type Hand = {
  cards: string;
  bid: number;
};

type HandWithType = Hand & {
  type: HandType;
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

const evaluateHand = (hand: Hand): HandType => {
  const cards = [...new Set(hand.cards)];
  const count = cards
    .map((card) => hand.cards.split("").filter((x) => x === card).length)
    .sort();

  if (cards.length === 1) {
    return { name: "FiveOfAKind", strength: 7 };
  } else if (cards.length === 2 && count[0] === 1) {
    return { name: "FourOfAKind", strength: 6 };
  } else if (cards.length === 2 && count[0] === 2) {
    return { name: "FullHouse", strength: 5 };
  } else if (cards.length === 3 && count[0] === 1 && count[1] === 1) {
    return { name: "ThreeOfAKind", strength: 4 };
  } else if (cards.length === 3 && count[0] === 1 && count[2] === 2) {
    return { name: "TwoPair", strength: 3 };
  } else if (cards.length === 4 && count[3] === 2) {
    return { name: "OnePair", strength: 2 };
  } else if (cards.length === 5) {
    return { name: "HighCard", strength: 1 };
  }
  return { name: "HighCard", strength: 1 };
};

const sortHands = (
  hands: Array<HandWithType>,
  strengthMap: Map<string, number>
) => {
  return hands.sort((a, b) => {
    if (a.type.strength < b.type.strength) {
      return -1;
    } else if (a.type.strength === b.type.strength) {
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
  if (hand.type.name === "HighCard" && jokers.length === 1) {
    return {
      ...hand,
      type: {
        name: "OnePair",
        strength: 2,
      },
    };
  } else if (hand.type.name === "OnePair" && jokers.length >= 1) {
    return {
      ...hand,
      type: {
        name: "ThreeOfAKind",
        strength: 4,
      },
    };
  } else if (hand.type.name === "TwoPair") {
    if (jokers.length === 1) {
      return {
        ...hand,
        type: {
          name: "FullHouse",
          strength: 5,
        },
      };
    } else if (jokers.length === 2) {
      return {
        ...hand,
        type: {
          name: "FourOfAKind",
          strength: 6,
        },
      };
    }
  } else if (hand.type.name === "ThreeOfAKind" && jokers.length >= 1) {
    return {
      ...hand,
      type: {
        name: "FourOfAKind",
        strength: 6,
      },
    };
  } else if (hand.type.name === "FullHouse" && jokers.length >= 1) {
    return {
      ...hand,
      type: {
        name: "FiveOfAKind",
        strength: 7,
      },
    };
  } else if (hand.type.name === "FourOfAKind" && jokers.length >= 1) {
    return {
      ...hand,
      type: {
        name: "FiveOfAKind",
        strength: 7,
      },
    };
  }

  return hand;
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

console.log(parsedInput);
console.log(solvePart1(parsedInput));
console.log(solvePart2(parsedInput));
