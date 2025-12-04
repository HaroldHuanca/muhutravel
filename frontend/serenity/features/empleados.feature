Feature: Empleados Management
  As an admin user
  I want to manage employees
  So that I can maintain staff information

  Background:
    Given the user is logged in as "admin"
    And the user is on the empleados page

  Scenario: View empleados list
    Then the empleados list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for an empleado
    When the user searches for "Carlos"
    Then the table should display filtered results
    And only empleados matching "Carlos" should be shown

  Scenario: Add a new empleado
    When the user clicks the add button
    Then the empleado form should be displayed
    And the form should have fields for nombres, apellidos, email, telefono, puesto

  Scenario: Edit an existing empleado
    When the user clicks edit on the first empleado
    Then the empleado edit form should be displayed
    And the form should be populated with existing data

  Scenario: Delete an empleado
    When the user clicks delete on an empleado
    Then a confirmation dialog should appear
    And after confirming, the empleado should be removed from the list
