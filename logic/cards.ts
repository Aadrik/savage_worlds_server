import type { Card, CardColor } from "../models/card";

export const suits = [
  "Clubs",
  "Diamonds",
  "Hearts",
  "Spades",
  "Joker",
] as const;

export const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace",
  "Joker",
] as const;

const suitValues = {
  Clubs: 1,
  Diamonds: 2,
  Hearts: 3,
  Spades: 4,
  Joker: 5,
};

const cardValues = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  Jack: 11,
  Queen: 12,
  King: 13,
  Ace: 14,
  Joker: 15,
};

export type Suit = (typeof suits)[number];
export type Value = (typeof values)[number];

export function generateDeck(includeJokers = true): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    // Make a card for each suit except Jokers
    if (suit !== "Joker") {
      const color: CardColor =
        suit == "Hearts" || suit == "Diamonds" ? "Red" : "Black";
      for (const value of values) {
        // Make a card for each value except Jokers
        if (value !== "Joker") {
          deck.push({ suit, value, color });
        }
      }
    }
  }
  // Add the jokers to the deck
  if (includeJokers) {
    const redJoker: Card = { suit: "Joker", value: "Joker", color: "Red" };
    const blackJoker: Card = { suit: "Joker", value: "Joker", color: "Black" };
    deck.push(redJoker);
    deck.push(blackJoker);
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [
      shuffledDeck[j] as Card,
      shuffledDeck[i] as Card,
    ];
  }
  return shuffledDeck;
}

export function dealCard(deck: Card[]): Card {
  const card = deck.pop();
  if (!card) {
    throw new Error("Deck is empty");
  }
  return card;
}

export function createCard(suit: Suit, value: Value): Card {
  let color: CardColor =
    suit == "Hearts" || suit == "Diamonds" ? "Red" : "Black";
  return { suit, value, color };
}

// Return true if first argument is greater than second argument
export function suitGreaterThan(a: Card, b: Card): boolean {
  let aSuitValue = suitValues[a.suit];
  let bSuitValue = suitValues[b.suit];
  return aSuitValue > bSuitValue;
}

export function valueGreaterThan(a: Card, b: Card): boolean {
  let aValue = cardValues[a.value];
  let bValue = cardValues[b.value];
  return aValue > bValue;
}

// Return true if first argument is greater than second argument
export function cardGreaterThan(a: Card, b: Card): boolean {
  return cardValues[a.value] == cardValues[b.value]
    ? suitGreaterThan(a, b)
    : valueGreaterThan(a, b);
}
