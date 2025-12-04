Feature: Paquetes Management
  As an admin user
  I want to manage travel packages
  So that I can offer different tour options to clients

  Background:
    Given the user is logged in as "admin"
    And the user is on the paquetes page

  Scenario: View paquetes list
    Then the paquetes list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for a paquete
    When the user searches for "Machu"
    Then the table should display filtered results
    And only paquetes matching "Machu" should be shown

  Scenario: Add a new paquete
    When the user clicks the add button
    Then the paquete form should be displayed
    And the form should have fields for nombre, descripcion, precio, fecha_inicio, fecha_fin

  Scenario: Edit an existing paquete
    When the user clicks edit on the first paquete
    Then the paquete edit form should be displayed
    And the form should be populated with existing data
    And the dates should be properly formatted

  Scenario: View inactive paquetes
    When the user navigates to the inactive paquetes section
    Then the inactive paquetes list should be displayed
    And only inactive paquetes should be shown

  Scenario: Activate an inactive paquete
    When the user clicks activate on an inactive paquete
    Then the paquete should be moved to active list
    And the paquete status should be updated
