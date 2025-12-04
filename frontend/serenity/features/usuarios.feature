Feature: Usuarios Management
  As an admin user
  I want to manage system users
  So that I can control access to the application

  Background:
    Given the user is logged in as "admin"
    And the user is on the usuarios page

  Scenario: View usuarios list
    Then the usuarios list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for a usuario
    When the user searches for "admin"
    Then the table should display filtered results
    And only usuarios matching "admin" should be shown

  Scenario: Add a new usuario
    When the user clicks the add button
    Then the usuario form should be displayed
    And the form should have fields for username, email, rol, estado

  Scenario: Edit an existing usuario
    When the user clicks edit on the first usuario
    Then the usuario edit form should be displayed
    And the form should be populated with existing data

  Scenario: Delete a usuario
    When the user clicks delete on a usuario
    Then a confirmation dialog should appear
    And after confirming, the usuario should be removed from the list

  Scenario: Change usuario role
    When the user edits a usuario
    And the user changes the rol to "agente"
    And the user saves the changes
    Then the usuario role should be updated
    And the changes should be reflected in the list
