import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8085',
  realm: 'journal',
  clientId: 'journal-client',
};

export const keycloak = new Keycloak(keycloakConfig);
