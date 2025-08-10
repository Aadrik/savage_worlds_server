import type { Suit, Value } from "../logic/cards";

type CardColor = "Red" | "Black";

export interface Card {
  suit: Suit;
  value: Value;
  color: CardColor;
}
