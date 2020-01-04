const random = require("../util/random");

/**
 * Returns:
 * &lt; 0 if c1 acts first,
 * &gt; 0 if c2 acts first
 */
function actingOrder(c1, c2) {
  // Compare (in order of precedence): Ini, reach, Agi, Int
  const iniDif =
    c2.characteristics.initiative.current -
    c1.characteristics.initiative.current;
  const reachDif = c2.characteristics.reach - c1.characteristics.reach;
  const agiDif = c2.attributes.agility - c1.attributes.agility;
  const intDif = c2.attributes.intelligence - c1.attributes.intelligence;
  if (iniDif !== 0) {
    return iniDif;
  } else if (reachDif !== 0) {
    return reachDif;
  } else if (agiDif !== 0) {
    return agiDif;
  } else if (intDif !== 0) {
    return intDif;
  } else {
    // Note: not implemented the last comparison criterion (max weapon skill level of wielded weapons)
    return random.getRandomInt(2) === 1 ? 1 : -1;
  }
}
exports.actingOrder = actingOrder;
