describe('app works correctly with routes', function() {
  beforeEach(function() {
    cy.visit('/');
  });

  it('should open main page by default', function() {
    cy.contains('МБОУ АЛГОСОШ');
  });

  function checkRoute(value) {
    it(`should open ${value} page`, () => {
      cy.get(`a[href*="/${value}"]`).click()
      cy.url().should('include', `/${value}`)
    })
  };

  checkRoute("recursion");
  checkRoute("fibonacci");
  checkRoute("sorting");
  checkRoute("stack");
  checkRoute("queue");
  checkRoute("list");
});