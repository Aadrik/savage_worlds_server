import type { Card } from "../models/card";
import type { Suit, Value } from "./cards";

export function filterDeck(
  predicate: (card: Card) => boolean,
  deck: Card[]
): Card[] {
  return deck.filter(predicate);
}

// export function equalsSuitFilter(suit: Suit, card: Card): boolean {
//   return card.suit == suit;
// }

export function equalsSuitFilter(suit: Suit): (card: Card) => boolean {
  return (card: Card) => card.suit == suit;
}

export function gtValueFilter(value: Value, card: Card): boolean {
  return card.value > value;
}

export function ltValueFilter(value: Value, card: Card): boolean {
  return card.value < value;
}

export function equalsValueFilter(value: Value, card: Card): boolean {
  return card.value == value;
}
