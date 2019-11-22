@contract
Feature: Combat

  Scenario: Create combat
    Given I pipe contents of file ./json/character-c1_post.json to body
    And I post to /characters
    And I store the value of body path $.id as C1 in scenario scope
    And I pipe contents of file ./json/character-c2_post.json to body
    And I post to /characters
    And I store the value of body path $.id as C2 in scenario scope
    And I set body to {"participants":["`C1`", "`C2`"]}
    When I post to /combats
    Then response body should be valid json
    And response body path $.id should be (.+)
# TODO And response body path $.turn.attacker.id should be `C1`

