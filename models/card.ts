import type { Suit, Value } from "../logic/cards";

export type CardColor = "Red" | "Black";

export interface Card {
  suit: Suit;
  value: Value;
  color: CardColor;
}

export type DeckState = { deck: Card[] };
