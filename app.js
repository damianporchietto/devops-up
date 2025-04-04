const path = require('path')
const dotenv = (process.env.DOTENV_PATH || path.resolve(__dirname, './.env'))
require('dotenv').config({ path: dotenv })
const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const connectDB = require('./config/database')

// Import routes
const authRoutes = require('./routes/auth')
const stationRoutes = require('./routes/station')
const measurementRoutes = require('./routes/measurement')

// Import Swagger docs
const swaggerSpec = require('./swagger/swagger')

const app = express()

// Middleware
app.use(bodyParser.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/auth', authRoutes)
app.use('/stations', stationRoutes)
app.use('/measurements', measurementRoutes)

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 