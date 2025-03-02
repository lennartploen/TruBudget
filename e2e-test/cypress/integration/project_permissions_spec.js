describe("Project Permissions", function() {
  beforeEach(function() {
    cy.login();
    cy.visit(`/projects`);
  });

  it("Show project page", function() {
    cy.location("pathname").should("eq", `/projects`);
  });

  it("Show and project permissions correctly", function() {
    cy.get("[data-test=pp-button-0]").click();
    cy.get("[data-test=permission-container]").should("be.visible");
    cy.get("[data-test=permission-close]").click();
    cy.get("[data-test=permission-container]").should("not.be.visible");
  });

  it("Grant and revoke permissions", function() {
    cy.fixture("testdata.json").as("data");
    cy.get("[data-test=pp-button-0]").click();
    cy.get("[data-test=permission-container]").should("be.visible");
    cy.get("[data-test='permission-select-project.intent.listPermissions']").click();
    cy.get("[data-test='permission-list']")
      .should("be.visible")
      .then($list => {
        const checkedItems = $list.find("input:checked");
        expect(checkedItems).to.have.lengthOf(this.data.permissions["project.intent.listPermissions"].length);
      })
      .then($list => {
        const firstUnchecked = $list.find("input:not(:checked)").first();
        // Use timeout to wait for animation to finish
        const options = { force: true, timeout: 60000 };
        cy.wrap(firstUnchecked, options)
          .click(options)
          .should("be.checked");
        cy.wrap(firstUnchecked, options)
          .click(options)
          .should("not.be.checked");
      });
  });
});
