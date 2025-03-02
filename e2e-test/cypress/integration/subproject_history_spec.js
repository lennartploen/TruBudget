describe("Subproject's history", function() {
  let projectId;
  let subprojectId;

  before(() => {
    cy.login();

    cy.createProject("subproject history test project", "subproject history test", [])
      .then(({ id }) => {
        projectId = id;
        return cy.createSubproject(projectId, "subproject history test");
      })
      .then(({ id }) => {
        subprojectId = id;
        return cy.createWorkflowitem(projectId, subprojectId, "subproject history test", { amountType: "N/A" });
      });
  });

  beforeEach(function() {
    cy.login();
    cy.visit(`/projects/${projectId}/${subprojectId}`);
  });

  it("The history contains only the subproject creation event.", function() {
    cy.get("#subproject-history-button").click();

    // Count history items => should be one
    cy.get("#history-list li.history-item")
      .first()
      .should("be.visible");
    cy.get("#history-list")
      .find("li.history-item")
      .should("have.length", 1);

    // Make sure it's a creation event
    cy.get("#history-list")
      .find("li.history-item")
      .first()
      .should("contain", "created subproject");
  });

  it("The history is sorted from new to old", function() {
    // Change assignee to create new history event
    cy.get("[data-test=assignee-selection] [role=button]")
      .first()
      .click();
    cy.get("[role=listbox]")
      .find("[value=jdoe]")
      .click()
      .type("{esc}");

    cy.get("#subproject-history-button").click();

    // Count history items => should be two
    cy.get("#history-list li.history-item")
      .first()
      .should("be.visible");
    cy.get("#history-list")
      .find("li.history-item")
      .should("have.length", 2);

    // Make sure the oldest entry is the create event
    cy.get("#history-list")
      .find("li.history-item")
      .last()
      .should("contain", "created subproject");

    // Make sure the newest entry is the assign event
    cy.get("#history-list")
      .find("li.history-item")
      .first()
      .should("contain", "assigned subproject");
  });
});
