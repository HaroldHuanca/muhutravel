Feature: Proveedores Management
  As an admin user
  I want to manage service providers
  So that I can coordinate with suppliers for travel packages

  Background:
    Given the user is logged in as "admin"
    And the user is on the proveedores page

  Scenario: View proveedores list
    Then the proveedores list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for a proveedor
    When the user searches for "Hotel"
    Then the table should display filtered results
    And only proveedores matching "Hotel" should be shown

  Scenario: Add a new proveedor
    When the user clicks the add button
    Then the proveedor form should be displayed
    And the form should have fields for nombre, tipo, email, telefono, ciudad

  Scenario: Edit an existing proveedor
    When the user clicks edit on the first proveedor
    Then the proveedor edit form should be displayed
    And the form should be populated with existing data

  Scenario: Delete a proveedor
    When the user clicks delete on a proveedor
    Then a confirmation dialog should appear
    And after confirming, the proveedor should be removed from the list

  Scenario: View proveedor details
    When the user clicks on a proveedor
    Then the proveedor details page should be displayed
    And all provider information should be visible
