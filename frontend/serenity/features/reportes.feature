Feature: Reportes Module
  As an admin user
  I want to view various reports
  So that I can analyze business metrics and performance

  Background:
    Given the user is logged in as "admin"
    And the user is on the reportes page

  Scenario: View reportes page
    Then the reportes container should be displayed
    And the tabs container should be visible
    And all report tabs should be available

  Scenario: View ventas report
    When the user clicks on the ventas tab
    Then the ventas report should be displayed
    And the report table should contain sales data
    And the report should show columns for fecha, cliente, paquete, monto

  Scenario: View pendientes report
    When the user clicks on the pendientes tab
    Then the pendientes report should be displayed
    And the report should show pending payment reservations
    And the total pending amount should be calculated

  Scenario: View clientes report
    When the user clicks on the clientes tab
    Then the clientes report should be displayed
    And the report should show client information
    And the report should display total spent per client

  Scenario: Filter reports by date range
    When the user selects start date "2024-01-01"
    And the user selects end date "2024-12-31"
    And the user clicks the filter button
    Then the report should be filtered by the selected dates
    And only data within the date range should be displayed

  Scenario: Export report to PDF
    When the user is viewing a report
    And the user clicks the export button
    Then a PDF file should be generated
    And the PDF should contain all report data
