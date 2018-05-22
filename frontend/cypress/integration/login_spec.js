const URL = Cypress.env("FRONTEND_URL") || "localhost:3000";

describe("Login", function() {
  beforeEach(function() {
    cy.visit(`http://${URL}/`);
  });

  it("Log in and out", function() {
    cy.get("#loginpage").should("be.visible");
    cy
      .get("#username")
      .type("mstein")
      .should("have.value", "mstein");
    cy
      .get("#password")
      .type("test")
      .should("have.value", "test");
    cy.get("#loginbutton").click();
    cy.get("#overviewpage").should("be.visible");
    cy.get("#logoutbutton").click();
    cy.get("#loginpage").should("be.visible");
  });

  it("Reject wrong inputs", function() {
    cy.get("#loginpage").should("be.visible");
    cy
      .get("#username")
      .type("foo")
      .should("have.value", "foo");
    cy
      .get("#password")
      .type("bar")
      .should("have.value", "bar");
    cy.get("#loginbutton").click();
    cy.get("#username-helper-text").should("be.visible");
    cy.get("#password-helper-text").should("be.visible");
  });
});
