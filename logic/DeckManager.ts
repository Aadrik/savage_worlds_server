import type { DeckState } from "../models/card.ts";
import { generateDeck, dealCard, shuffleDeck } from "./cards";

function ensureCardAvailable(state: DeckState) {
  if (state.deck.length > 0) {
    return;
  } else {
    state.deck = generateDeck();
  }
}

export function DeckManager() {
  let state: DeckState = {
    deck: [],
  };

  return {
    dealCard: (autoReset = false) => {
      if (autoReset) ensureCardAvailable(state);
      return dealCard(state.deck);
    },
    ensureCardAvailable: () => ensureCardAvailable(state),
    generateDeck: () => (state.deck = generateDeck()),
    shuffleDeck: () => (state.deck = shuffleDeck(state.deck)),
    getDeck: () => state.deck,
  };
}
