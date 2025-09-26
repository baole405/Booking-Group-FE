describe("fe-react-web", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the home page hero stats", () => {
    cy.contains(/Venues onboarded/i).should("be.visible");
  });
});
