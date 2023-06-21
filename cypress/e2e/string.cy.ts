describe('Recursion test', () => {

  const defaultColor = '4px solid rgb(0, 50, 255)';
  const changingColor = '4px solid rgb(210, 82, 225)';
  const modifiedColor = '4px solid rgb(127, 224, 81)';

  beforeEach(function () {
    cy.visit('http://localhost:3000/recursion');
    cy.get('[data-testid="input"]').as('input');
    cy.get('[data-testid="button"]').as('button');
    cy.get('[data-testid="result"]').as('result');
  });

  it('Button should be disabled if input is empty', () => {
    cy.get('@input').should('have.value', '');
    cy.get('@button').should('be.disabled');
  });

  it('Recursion works', () => {
    cy.get('@input').type("abcd");
    cy.get('@button').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', 'b');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(2).should('have.css', 'border', defaultColor).should('contain', 'c');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(3).should('have.css', 'border', changingColor).should('contain', 'd');

    cy.wait(1000);

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', modifiedColor).should('contain', 'd');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(2).should('have.css', 'border', changingColor).should('contain', 'c');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(3).should('have.css', 'border', modifiedColor).should('contain', 'a');

    cy.wait(1000);

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', modifiedColor).should('contain', 'd');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', modifiedColor).should('contain', 'c');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(2).should('have.css', 'border', modifiedColor).should('contain', 'b');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(3).should('have.css', 'border', modifiedColor).should('contain', 'a');
  });
});
