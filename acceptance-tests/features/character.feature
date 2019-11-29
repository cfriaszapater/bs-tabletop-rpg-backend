@contract
Feature: Combat

  Scenario: Create character
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    When I POST to /characters
    Then response code should be 201
    And response body path $.id should be (.+)
    And response body path $.name should be C1

  Scenario: Get character
    Given I pipe contents of file ./features/json/character-c1_post.json to body
    And I set Content-Type header to application/json
    And I POST to /characters
    And I store the value of body path $.id as characterId in scenario scope
    When I GET /characters/`characterId`
    Then response code should be 200
    And response body should be valid json
    And response body path $.id should be `characterId`
    And response body path $.name should be C1
