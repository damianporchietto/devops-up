const swaggerJsdoc = require('swagger-jsdoc')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meteorological Stations API',
      version: '1.0.0',
      description: 'API documentation for meteorological stations and measurements.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // Points to the route files for documentation
}

module.exports = swaggerJsdoc(swaggerOptions) 