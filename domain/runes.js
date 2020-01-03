const random = require("../util/random");

function throwRunes(num) {
  return Array(num)
    .fill(null)
    .map(() => random.getRandomInt(2))
    .reduce((sum, runeResult) => sum + runeResult);
}

module.exports = {
  throwRunes
};
