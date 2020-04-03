// Longest weapon (greater reach) wielded in any hand
const longestWeapon = equipment => {
  const { hand1, hand2 } = equipment.equipped;
  const weapons = [hand1, hand2].filter(e => e.type === "weapon");
  if (weapons.length === 0) {
    return null;
  }
  return weapons.reduce(longestWeaponReducer);
};

const longestWeaponReducer = (prev, curr) =>
  prev.reach >= curr.reach ? prev : curr;

const armor = equipment => {
  const { body } = equipment.equipped;
  if (body && body.type === "armor") {
    return body;
  }
  return null;
};

// Largest (greatest coverage) shield wielded in any hand
const shield = equipment => {
  const { hand1, hand2 } = equipment.equipped;
  const shields = [hand1, hand2].filter(e => e.type === "shield");
  if (shields.length === 0) {
    return null;
  }
  return shields.reduce(largestShieldReducer);
};

const largestShieldReducer = (prev, curr) =>
  prev.coverage >= curr.coverage ? prev : curr;

module.exports = {
  longestWeapon,
  armor,
  shield
};
