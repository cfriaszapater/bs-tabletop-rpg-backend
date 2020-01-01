const random = require("../util/random");

function throwRunes(runesNum) {
  return Array(runesNum)
    .map(() => random.getRandomInt(2))
    .reduce((sum, runeResult) => {
      sum += runeResult;
    }, 0);
}

module.exports = {
  throwRunes
};
