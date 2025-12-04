Feature: Dashboard Functionality
  As a logged-in user
  I want to view the dashboard with KPI cards and charts
  So that I can monitor the business metrics

  Background:
    Given the user is logged in as "admin"
    And the user is on the dashboard page

  Scenario: Dashboard loads successfully
    Then the dashboard container should be visible
    And the KPI grid should be displayed
    And the charts grid should be displayed

  Scenario: KPI cards display correctly
    Then the revenue KPI card should be visible
    And the active clients KPI card should be visible
    And the pending reservations KPI card should be visible
    And the total reservations KPI card should be visible

  Scenario: Dashboard charts render
    Then the revenue trend chart should be visible
    And the reservation status pie chart should be visible
    And the popular packages list should be visible
    And the recent activity list should be visible

  Scenario: Refresh button updates data
    When the user clicks the refresh button
    Then the loading indicator should appear
    And the data should be reloaded
    And the loading indicator should disappear
