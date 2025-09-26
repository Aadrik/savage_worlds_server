import { CombatManager } from "../logic/CombatManager";

describe("CombatManager", () => {
  it("should return an array of cards", () => {
    let manager = CombatManager(10);
    expect(manager.length).toBe(10);
  });
});
