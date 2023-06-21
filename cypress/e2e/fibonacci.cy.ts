describe('Fibonacci test', () => {

  const defaultColor = '4px solid rgb(0, 50, 255)';

  beforeEach(function () {
    cy.visit('http://localhost:3000/fibonacci');
    cy.get('[data-testid="input"]').as('input');
    cy.get('[data-testid="button"]').as('button');
    cy.get('[data-testid="result"]').as('result');
  });

  it('Button should be disabled if input is empty', () => {
    cy.get('@input').should('have.value', '');
    cy.get('@button').should('be.disabled');
  });

  it('Fibonacci works', () => {
    cy.get('@input').type("3");
    cy.get('@button').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', '1');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', '1');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(2).should('have.css', 'border', defaultColor).should('contain', '2');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(3).should('have.css', 'border', defaultColor).should('contain', '3');
  });
});