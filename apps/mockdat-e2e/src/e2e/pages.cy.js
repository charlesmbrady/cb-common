// cypress/e2e/pages.cy.js

describe('Mockdat Additional Pages', () => {
  it('Visits the Dashboard page', () => {
    cy.visit('/dashboard');
    cy.get('[data-cy="dashboardPage"]').should('exist');
    cy.get('[data-cy="dashboardHeader"]').contains('Dashboard');
    // Check scenarios section
    cy.get('[data-cy="scenariosSection"]').should('exist');
    cy.get('[data-cy="createScenarioBtn"]').click();
    // ... etc.
  });

  it('Visits the Settings page', () => {
    cy.visit('/settings');
    cy.get('[data-cy="settingsPage"]').should('exist');
    // Toggle dark mode
    cy.get('[data-cy="darkModeToggle"]').click();
    // Enter an API token
    cy.get('[data-cy="apiTokenInput"]').type('my-secret-token');
    // Save
    cy.get('[data-cy="saveSettingsBtn"]').click();
    // ... check for success messages, etc.
  });

  it('Visits the Help page', () => {
    cy.visit('/help');
    cy.get('[data-cy="helpPage"]').should('exist');
    cy.get('[data-cy="helpSearchInput"]').type('scenario');
    cy.get('[data-cy="helpSearchBtn"]').click();
    // Check the help topics, etc.
  });

  it('Visits the About page', () => {
    cy.visit('/about');
    cy.get('[data-cy="aboutPage"]').should('exist');
    cy.get('[data-cy="appVersion"]').should('contain', '1.0.0');
  });
});
