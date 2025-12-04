Feature: Login Functionality
  As a user
  I want to be able to login to the MuhuTravel system
  So that I can access the dashboard and manage travel packages

  Background:
    Given the user is on the login page

  Scenario: Successful login with valid credentials
    When the user enters username "admin"
    And the user enters password "hash123"
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the dashboard should be displayed

  Scenario: Failed login with invalid credentials
    When the user enters username "invalid_user"
    And the user enters password "wrong_password"
    And the user clicks the login button
    Then an error message should be displayed
    And the error message should contain "Error"

  Scenario: Login with empty fields
    When the user clicks the login button without entering credentials
    Then the form should show validation errors
    And the user should remain on the login page

  Scenario: Login with agent credentials
    When the user enters username "agente1"
    And the user enters password "hash123"
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the dashboard should display the agent's name
