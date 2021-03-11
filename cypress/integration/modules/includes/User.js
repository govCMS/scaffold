/**
 * @file
 * Provides a utiltiy class to perform common user based functions in Drupal.
 */
class User {

  constructor() {}

  /**
   * Logs into site using Drupal's user login form.
   *
   * @param {string} username
   *   Name of user.
   * @param {string} password
   *   User's password.
   */
  login(username, password) {
    cy
      .visit("/user/login")
      .get("input[name='name']")
      .type(username)
      .get("input[name='pass']")
      .type(password)
      .get("#edit-submit")
      .click();
  }
}

module.exports = { User };
