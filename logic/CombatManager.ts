import { sortCards } from "./cards";
import { DeckManager } from "./DeckManager";

export function CombatManager(numCharacters: number) {
  let deckManager = DeckManager();
  deckManager.generateDeck();
  deckManager.shuffleDeck();

  let turnOrder = Array.from({ length: numCharacters }).map((x) =>
    deckManager.dealCard()
  );
  console.log(turnOrder);
  let sortedTurnOrder = turnOrder.sort(sortCards);
  console.log(sortedTurnOrder);
  return turnOrder;
}
