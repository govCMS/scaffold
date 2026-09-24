Feature: Home Page

  Ensure the home page is rendering correctly

  @javascript @smoke @d10
  Scenario: Anonymous user visits the homepage
    Given I am on the homepage
    And save screenshot
