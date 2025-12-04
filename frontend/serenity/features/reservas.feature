Feature: Reservas Management
  As an admin user
  I want to manage reservations
  So that I can track all customer bookings

  Background:
    Given the user is logged in as "admin"
    And the user is on the reservas page

  Scenario: View reservas list
    Then the reservas list should be displayed
    And the search bar should be visible
    And the add button should be visible

  Scenario: Search for a reserva
    When the user searches for "RES"
    Then the table should display filtered results
    And only reservas matching "RES" should be shown

  Scenario: Add a new reserva
    When the user clicks the add button
    Then the reserva form should be displayed
    And the form should have fields for cliente, paquete, fecha_reserva, precio_total

  Scenario: Edit an existing reserva
    When the user clicks edit on the first reserva
    Then the reserva edit form should be displayed
    And the form should be populated with existing data

  Scenario: Filter reservas by status
    When the user filters by status "confirmada"
    Then the table should display only confirmed reservations
    And the status filter should be applied

  Scenario: View reserva details
    When the user clicks on a reserva
    Then the reserva details page should be displayed
    And all reservation information should be visible
