import { generateDeck, shuffleDeck } from "../logic/cards";
import { suits, values } from "../logic/cards";

describe("generateDeck", () => {
  it("should generate all combinations of suits and values", () => {
    const deck = generateDeck();

    // Basic sanity check
    expect(deck.length).toBeGreaterThanOrEqual(52);

    // Check every card has a valid suit and value
    for (const card of deck) {
      expect(suits).toContain(card.suit);
      expect(values).toContain(card.value);
    }

    // Check for duplicates
    const uniqueCards = new Set(
      deck.map((c) => `${c.suit}-${c.value}-${c.color}`)
    );
    expect(uniqueCards.size).toBe(deck.length);
  });
});

describe("generateDeck", () => {
  it("should be 52 cards without Jokers", () => {
    const deck = generateDeck(false);
    expect(deck.length).toBe(52);
  });
});

describe("generateDeck", () => {
  it("should be 54 cards with Jokers", () => {
    const deck = generateDeck(true);
    expect(deck.length).toBe(54);
  });
});

describe("shuffleDeck", () => {
  it("should have the same amount of cards as a new deck", () => {
    const deck = generateDeck();
    const shuffledDeck = shuffleDeck(generateDeck());
    expect(deck.length).toBe(shuffledDeck.length);
  });
});
