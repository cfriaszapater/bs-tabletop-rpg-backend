const { Then } = require("cucumber");
const assert = require("assert");
// const apickli = require('apickli');

Then(
  "`defenderHealth` is `previousDefenderHealth` minus `damage{int}`",
  function(healthVar, previousHealthVar, damageVar, callback) {
    const health = this.apickli.replaceVariables(healthVar);
    const previousHealth = this.apickli.replaceVariables(previousHealthVar);
    const damage = this.apickli.replaceVariables(damageVar);

    const assertion = assert.equal(
      Number(health),
      Number(previousHealth) - Number(damage)
    );
    this.apickli.callbackWithAssertion(callback, assertion);
  }
);
