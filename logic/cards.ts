import type { Card } from "../models/card";

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

export type Suit = (typeof suits)[number];
export type Value = (typeof values)[number];

export function generateDeck(includeJokers = true): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    // Make a card for each suit except Jokers
    if (suit !== "Joker") {
      const color = suit == "Hearts" || suit == "Diamonds" ? "Red" : "Black";
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
