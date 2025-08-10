import type {
  Attributes,
  Character,
  DieType,
  EdgeDefinition,
  HindranceDefinition,
  Skill,
  SkillDefinition,
} from "../models/character";

const dieOrder: DieType[] = ["d4", "d6", "d8", "d10", "d12"];

function getNextDie(current: DieType): DieType | null {
  const index = dieOrder.indexOf(current);
  const nextDie = dieOrder[index + 1];
  return nextDie !== undefined ? nextDie : null;
}

function getPreviousDie(current: DieType): DieType | null {
  const index = dieOrder.indexOf(current);
  const prevDie = dieOrder[index - 1];
  return prevDie !== undefined ? prevDie : null;
}

function dieRanking(die: string): number {
  const rankMap: { [key: string]: number } = {
    d4: 1,
    d6: 2,
    d8: 3,
    d10: 4,
    d12: 5,
  };
  return rankMap[die] ?? 0;
}

// -------------------- Attribute -------------------- //

function updateAttributePoints(character: Character, step: number): Character {
  return {
    ...character,
    points: {
      ...character.points,
      attributePoints: character.points.attributePoints + step,
    },
  };
}

export function updateAttributeSVC(
  character: Character,
  attr: keyof Attributes,
  newDie: DieType
): Character {
  const currentLevel = character.attributes[attr];
  const diff = dieRanking(newDie) - dieRanking(currentLevel);
  // If diff is positive the die has gone up a level
  if (canAffordAttribute(character, diff)) {
    const updatedCharacter = updateAttributePoints(character, -diff);
    return {
      ...updatedCharacter,
      attributes: {
        ...updatedCharacter.attributes,
        [attr]: newDie,
      },
    };
  }
  return character;
}

function canAffordAttribute(
  character: Character,
  requiredPoints: number
): boolean {
  return character.points.attributePoints - requiredPoints >= 0;
}

// -------------------- Skill -------------------- //

export function addSkillSVC(
  character: Character,
  skill: SkillDefinition
): Character {
  const newSkill: Skill = { ...skill, die: "d4" };
  if (canAffordSkill(character, newSkill)) {
    // Multiply by -1 to spend the point.
    updateSkillPoints(character, calculateSkillCost(character, newSkill) * -1);
    return {
      ...character,
      skills: [...character.skills, newSkill],
    };
  } else {
    return character;
  }
}

// TODO: It is possible to add a skill that will only cost 1 point
// then drop the linked attribute to be at or below the skill level
// then return the skill to gain 2 skill points.
// Need to add some level of control to prevent this.
export function removeSkillSVC(
  character: Character,
  skill: SkillDefinition
): Character {
  const skillToRemove: Skill = { ...skill, die: "d4" };
  updateSkillPoints(character, calculateSkillCost(character, skillToRemove));
  return {
    ...character,
    skills: character.skills.filter((s) => s.name !== skill.name),
  };
}

function canAffordSkill(character: Character, skill: Skill): boolean {
  return (
    character.points.skillPoints - calculateSkillCost(character, skill) >= 0
  );
}

// Calculate skill cost. If the skill's die level is less than the
// characters attribute linked to that skill the skill will cost 1 point else 2.
function calculateSkillCost(character: Character, skill: Skill): number {
  const characterAttributeLevel: DieType =
    character.attributes[skill.linkedAttribute];
  return dieRanking(characterAttributeLevel) > dieRanking(skill.die) ? 1 : 2;
}

// Updates charaters skill points returns the new amount
function updateSkillPoints(character: Character, points: number): number {
  return (character.points.skillPoints += points);
}

// -------------------- Hindrance -------------------- //

export function addHindranceSVC(
  character: Character,
  hindrance: HindranceDefinition
): Character {
  // Add a hindrance point
  const cost = hindrance.category === "Major" ? 2 : 1;
  character.points.hindrancePoints += cost;
  return {
    ...character,
    hindrances: [...character.hindrances, hindrance],
  };
}

export function removeHindranceSVC(
  character: Character,
  hindrance: HindranceDefinition
): Character {
  // Remove a hindrance point
  const cost = hindrance.category === "Major" ? 2 : 1;
  character.points.hindrancePoints -= cost;
  return {
    ...character,
    hindrances: character.hindrances.filter(
      // Remove the hindrance that matches both name and category. Filter in
      // every other hindrance
      (h) => h.name !== hindrance.name || h.category !== hindrance.category
    ),
  };
}

export function isValidHindranceSVC(
  character: Character,
  hindrance: HindranceDefinition
): boolean {
  const newPoints =
    hindrancePointsAwardedSVC(character) +
    (hindrance.category === "Major" ? 2 : 1);
  return newPoints <= 4 ? true : false;
}

export function hindrancePointsSVC(character: Character): number {
  return character.points.hindrancePoints;
}

export function hindrancePointsAwardedSVC(character: Character): number {
  return character.hindrances.reduce((total, hindrance) => {
    const points = hindrance.category === "Major" ? 2 : 1;
    return total + points;
  }, 0);
}

// -------------------- Edge -------------------- //
export function validateEdgeSVC(
  character: Character,
  edge: EdgeDefinition
): {
  isValid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Check hindrance points to spend
  if (character.points.hindrancePoints - 2 < 0) {
    reasons.push(`Requires 2 hindrance point.`);
  }

  // Check attribute prerequisites
  if (edge.prerequisites?.attributes) {
    for (const [key, requiredDie] of Object.entries(
      edge.prerequisites.attributes
    )) {
      const currentDie = character.attributes[key as keyof Attributes];
      if (!currentDie || dieRanking(currentDie) < dieRanking(requiredDie)) {
        reasons.push(
          `Requires ${key} to be at least ${requiredDie}, but is ${currentDie}.`
        );
      }
    }
  }

  // Check skill prerequisites
  if (edge.prerequisites?.skills) {
    for (const skill of edge.prerequisites.skills) {
      const characterSkill = character.skills.find(
        (s) => s.name === skill.name
      );
      if (
        !characterSkill ||
        dieRanking(characterSkill.die) < dieRanking(skill.die)
      ) {
        reasons.push(
          `Requires ${skill.name} to be at least ${skill.die}, but is ${
            characterSkill?.die ?? "not present"
          }.`
        );
      }
    }
  }

  // TODO: Add other prerequisites checks (e.g., Hinderances, Rank)

  const isValid = reasons.length === 0;
  return { isValid, reasons };
}

export function addEdgeSVC(
  character: Character,
  edge: EdgeDefinition
): Character {
  character.points.hindrancePoints -= 2;
  return {
    ...character,
    edges: [...character.edges, edge],
  };
}

export function removeEdgeSVC(
  character: Character,
  edge: EdgeDefinition
): Character {
  character.points.hindrancePoints += 2;
  return {
    ...character,
    edges: character.edges.filter((e) => e.name !== edge.name),
  };
}
