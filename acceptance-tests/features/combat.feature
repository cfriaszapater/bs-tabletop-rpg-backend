@contract
Feature: Combat

  Scenario: create combat
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    And I POST to /characters
    And I store the value of body path $.id as C1 in scenario scope
    And I pipe contents of file ./features/json/character-c2_post.json to body
    And I POST to /characters
    And I store the value of body path $.id as C2 in scenario scope
    And I set body to {"participants":["`C1`", "`C2`"]}
    When I POST to /combats
    Then response code should be 201
    And response body should be valid json
    And response body path $.id should be (.+)
    And response body path $.turn.attacker.id should be `C2`
    And response body path $.charactersToAct should be of type array with length 1
    And response body path $.charactersToAct[0] should be `C1`
    And response body path $.turn.step should be SelectOpponent
    And response body path $.turn.number should be 1
    And response body path $.events should be of type array with length 2
    And response body path $.events[0].event should be CombatStarted
    And response body path $.events[1].event should be TurnStarted
    And response body path $.events[1].data should be `C2`

  Scenario: attacker C2 selects opponent C1
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    And I POST to /characters
    And I store the value of body path $.id as C1 in scenario scope
    And I pipe contents of file ./features/json/character-c2_post.json to body
    And I POST to /characters
    And I store the value of body path $.id as C2 in scenario scope
    And I set body to {"participants":["`C1`", "`C2`"]}
    And I POST to /combats
    And I store the value of body path $.id as combat1 in scenario scope
    And I store the value of body path $.turn.number as turn1 in scenario scope
    And I store the value of body path $.events.length as eventIndex in scenario scope
    And I set body to {"defender": "`C1`"}
    When I PATCH /combats/`combat1`/turns/`turn1`
    Then response code should be 200
    And response body path $.turn.defender.id should be `C1`
    And response body path $.turn.step should be DecideStaminaLowerIni
    And response body path $.turn.currentDecision should be defender
    And response body path $.events[`eventIndex`].event should be OpponentSelected
    And response body path $.events[`eventIndex`].data should be `C1`

  Scenario: lower Ini defender C1 declares defense, attack not resolved
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    And I POST to /characters
    And I store the value of body path $.id as C1 in scenario scope
    And I pipe contents of file ./features/json/character-c2_post.json to body
    And I POST to /characters
    And I store the value of body path $.id as C2 in scenario scope
    And I set body to {"participants":["`C1`", "`C2`"]}
    And I POST to /combats
    And I store the value of body path $.id as combat1 in scenario scope
    And I store the value of body path $.turn.number as turn1 in scenario scope
    And I set body to {"defender": "`C1`"}
    And I PATCH /combats/`combat1`/turns/`turn1`
    And I store the value of body path $.events.length as eventIndex in scenario scope
    And I set body to {"defenderStamina": {"dodge": 1, "block": 1}}
    When I PATCH /combats/`combat1`/turns/`turn1`
    Then response code should be 200
    And response body path $.turn.defenderStamina.dodge should be 1
    And response body path $.turn.defenderStamina.block should be 1
    And response body path $.turn.defender.characteristics.stamina.current should be 7
    And response body path $.turn.step should be DecideStaminaHigherIni
    And response body path $.turn.currentDecision should be attacker
    And response body path $.events[`eventIndex`].event should be DefenseDeclared
    And response body path $.events[`eventIndex`].data should be `C1`

  Scenario: higher Ini attacker C2 declares attack, attack resolved
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    And I POST to /characters
    And I store the value of body path $.id as C1 in scenario scope
    And I pipe contents of file ./features/json/character-c2_post.json to body
    And I POST to /characters
    And I store the value of body path $.id as C2 in scenario scope
    And I set body to {"participants":["`C1`", "`C2`"]}
    And I POST to /combats
    And I store the value of body path $.id as combat1 in scenario scope
    And I store the value of body path $.id.turn.id as turn1 in scenario scope
    And I set body to {"defender": "`C1`"}
    And I PATCH /combats/`combat1`/turns/`turn1`
    And I set body to {"defenderStamina": {"Dodge": 1, "Block": 1}}
    And I PATCH /combats/`combat1`/turns/`turn1`
    And I store the value of body path $.events.length as eventIndex in scenario scope
    And I store the value of body path $.turn.defender.characteristics.health.current as previousDefenderHealth in scenario scope
    And I set body to {"attackerStamina": {"Impact": 1, "Damage": 1}}
    When I PATCH /combats/`combat1`/turns/`turn1`
    Then response body path $.turn.attackerStamina should be {"Impact": 1, "Damage": 1}
    And response body path $.turn.attacker.characteristics.stamina.current should be 7
    And response body path $.turn.attackResult should be {"hit": .+, "damage": \d+, "coverageDamage": \d+, "stunned": \d+(.*)}
    And I store the value of body path $.turn.attackResult as attackResult1 in scenario scope
    And response body path $.event[`eventIndex`] should be {(.*)"event": "AttackResolved", "attacker": "`C2`", "defender": "`C1`", "result": `attackResult1`(.*)}
    And response body path $.turn.step should be AttackResolved
    And response body path $.turn should not be .*currentDecision.*
    And I store the value of body path $.turn.defender.characteristics.health.current as defenderHealth in scenario scope
    And I store the value of body path $.turn.attackResult.damage as damage1 in scenario scope
    # XXX possible alternative: And value of scenario variable defenderHealth should be `previousDefenderHealth` - `damage1`
    And `defenderHealth` is `previousDefenderHealth` minus `damage1`
