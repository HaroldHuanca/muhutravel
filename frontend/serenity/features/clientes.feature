Feature: Clientes Management
  As an admin user
  I want to manage clients in the system
  So that I can keep track of all customers

  Background:
    Given the user is logged in as "admin"
    And the user is on the clientes page

  Scenario: View clientes list
    Then the clientes list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for a cliente
    When the user searches for "Juan"
    Then the table should display filtered results
    And only clientes matching "Juan" should be shown

  Scenario: Add a new cliente
    When the user clicks the add button
    Then the cliente form should be displayed
    And the form should have fields for nombres, apellidos, email, pais, ciudad

  Scenario: Edit an existing cliente
    When the user clicks edit on the first cliente
    Then the cliente edit form should be displayed
    And the form should be populated with existing data

  Scenario: Delete a cliente
    When the user clicks delete on a cliente
    Then a confirmation dialog should appear
    And after confirming, the cliente should be removed from the list

  Scenario: Print clientes report
    When the user clicks the print button
    Then the PDF report should be generated
    And the report should contain all clientes data
