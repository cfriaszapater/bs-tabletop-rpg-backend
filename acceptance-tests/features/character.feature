@contract
Feature: Combat

  Scenario: Create character
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    When I POST to /characters
    Then response body path $.id should be (.+)
    And response body path $.name should be C1

  Scenario: Get character
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I POST to /characters
    And I store the value of body path $.id as characterId in scenario scope
    When I GET /characters/`characterId`
    Then response body should be valid json
    And response body path $.id should be `characterId`
    And response body path $.name should be C1
