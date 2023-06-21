describe('Queue test', () => {

  const defaultColor = '4px solid rgb(0, 50, 255)';
  const changingColor = '4px solid rgb(210, 82, 225)';

  beforeEach(function () {
    cy.visit('http://localhost:3000/queue');
    cy.get('[data-testid="input"]').as('input');
    cy.get('[data-testid="enqueue"]').as('enqueue');
    cy.get('[data-testid="dequeue"]').as('dequeue');
    cy.get('[data-testid="clear"]').as('clear');
    cy.get('[data-testid="result"]').as('result');
  });

  it('Buttons should be disabled if input is empty', () => {
    cy.get('@input').should('have.value', '');
    cy.get('@enqueue').should('be.disabled');
    cy.get('@dequeue').should('be.disabled');
    cy.get('@clear').should('be.disabled');
  });

  it('Adding to the queue works', () => {
    cy.get('@input').type("a");
    cy.get('@enqueue').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');
  });

  it('Deleting from the queue works', () => {
    cy.get('@input').type("a");
    cy.get('@enqueue').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');

    cy.get('@input').type("b");
    cy.get('@enqueue').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', 'b');

    cy.get('@dequeue').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', '');
  });

  it('Clearing the queue works', () => {
    cy.get('@input').type("a");
    cy.get('@enqueue').should('be.enabled').click();
    cy.get('@input').should('have.value', '');

    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', changingColor).should('contain', 'a');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('have.css', 'border', defaultColor).should('contain', 'a');

    cy.get('@input').type("b");
    cy.get('@enqueue').should('be.enabled').click();

    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', changingColor).should('contain', 'b');
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('have.css', 'border', defaultColor).should('contain', 'b');

    cy.get('@clear').should('be.enabled').click();
    cy.wait(500);
    cy.get('@result').get('div[class^="circle_circle__"]').eq(0).should('contain', '');
    cy.get('@result').get('div[class^="circle_circle__"]').eq(1).should('contain', '');
  });
});
