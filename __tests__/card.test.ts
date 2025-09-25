import {
  generateDeck,
  shuffleDeck,
  createCard,
  suitGreaterThan,
  cardGreaterThan,
  dealCard,
} from "../logic/cards";
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

describe("dealCard", () => {
  it("should deal 1 card", () => {
    const deck = generateDeck();
    const card = dealCard(deck);
    expect(suits).toContain(card.suit);
    expect(values).toContain(card.value);
  });
});

describe("dealCard", () => {
  it("should throw an error if the deck is empty", () => {
    const deck = generateDeck();
    Array.from({ length: 54 }, () => dealCard(deck));
    expect(() => dealCard(deck)).toThrow("Deck is empty");
  });
});

describe("suitGreaterThan", () => {
  it("should return true comparing Spades to Hearts", () => {
    let card1 = createCard("Spades", "5");
    let card2 = createCard("Hearts", "2");
    expect(suitGreaterThan(card1, card2)).toBe(true);
  });
});

describe("suitGreaterThan", () => {
  it("should return true comparing Hearts to Diamonds", () => {
    let card1 = createCard("Hearts", "5");
    let card2 = createCard("Diamonds", "2");
    expect(suitGreaterThan(card1, card2)).toBe(true);
  });
});

describe("suitGreaterThan", () => {
  it("should return true comparing Diamonds to Clubs", () => {
    let card1 = createCard("Diamonds", "5");
    let card2 = createCard("Clubs", "2");
    expect(suitGreaterThan(card1, card2)).toBe(true);
  });
});

describe("suitGreaterThan", () => {
  it("should return false comparing Clubs to any other suit", () => {
    let card1 = createCard("Clubs", "5");
    let card2 = createCard("Diamonds", "2");
    expect(suitGreaterThan(card1, card2)).toBe(false);
  });
});

describe("cardGreaterThan", () => {
  it("should return true if comparing 9 to 3 disregarding suit", () => {
    let card1 = createCard("Clubs", "9");
    let card2 = createCard("Hearts", "3");
    expect(cardGreaterThan(card1, card2)).toBe(true);
  });
});

describe("cardGreaterThan", () => {
  it("should return true when values match but suit is greater", () => {
    let card1 = createCard("Spades", "9");
    let card2 = createCard("Hearts", "9");
    expect(cardGreaterThan(card1, card2)).toBe(true);
  });
});

describe("cardGreaterThan", () => {
  it("should return false if comparing 2 to Ace", () => {
    let card1 = createCard("Clubs", "2");
    let card2 = createCard("Hearts", "Ace");
    expect(cardGreaterThan(card1, card2)).toBe(false);
  });
});

describe("cardGreaterThan", () => {
  it("should return true if comparing King to Queen", () => {
    let card1 = createCard("Clubs", "King");
    let card2 = createCard("Clubs", "Queen");
    expect(cardGreaterThan(card1, card2)).toBe(true);
  });
});
