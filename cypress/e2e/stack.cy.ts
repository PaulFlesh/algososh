describe('Stack test', () => {

  const defaultColor = '4px solid rgb(0, 50, 255)';
  const changingColor = '4px solid rgb(210, 82, 225)';

  beforeEach(function () {
    cy.visit('http://localhost:3000/stack');
    cy.get('[data-testid="input"]').as('input');
    cy.get('[data-testid="push"]').as('push');
    cy.get('[data-testid="pop"]').as('pop');
    cy.get('[data-testid="clear"]').as('clear');
    cy.get('[data-testid="result"]').as('result');
  });

  it('Buttons should be disabled if input is empty', () => {
    cy.get('@input').should('have.value', '');
    cy.get('@push').should('be.disabled');
    cy.get('@pop').should('be.disabled');
    cy.get('@clear').should('be.disabled');
  });

  it('Adding to the stack works', () => {
    cy.get('@input').type("a");
    cy.get('@push').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');
  });

  it('Deleting from the stack works', () => {
    cy.get('@input').type("a");
    cy.get('@push').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');

    cy.get('@input').type("b");
    cy.get('@push').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', 'b');

    cy.get('@pop').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').last().should('have.css', 'border', defaultColor).should('contain', 'a');
  });

  it('Clearing the stack works', () => {
    cy.get('@input').type("a");
    cy.get('@push').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');

    cy.get('@input').type("b");
    cy.get('@push').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', 'b');

    cy.get('@clear').should('be.enabled').click();
    cy.wait(500);
    cy.get('@result').should('be.empty');
  });
});
