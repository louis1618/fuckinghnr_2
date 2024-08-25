const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the project',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

const swaggerSetup = swaggerUi.serve;
const swaggerDocs = swaggerUi.setup(specs);

module.exports = { swaggerSetup, swaggerDocs };
