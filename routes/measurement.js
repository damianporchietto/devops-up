const express = require('express')
const router = express.Router()
const Measurement = require('../models/measurement')
const { authenticateToken } = require('../middleware/auth')

/**
 * @swagger
 * components:
 *   schemas:
 *     Measurement:
 *       type: object
 *       required:
 *         - value
 *         - station_id
 *       properties:
 *         value:
 *           type: number
 *           description: Measurement value
 *         station_id:
 *           type: string
 *           description: ID of the station where measurement was taken
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of measurement creation
 */

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * @swagger
 * /measurements:
 *   get:
 *     summary: Get all measurements
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: station_id
 *         schema:
 *           type: string
 *         description: Filter by station ID
 *     responses:
 *       200:
 *         description: List of measurements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measurement'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.station_id) filter.station_id = req.query.station_id

    const measurements = await Measurement.find(filter)
      .populate('station_id')
    res.status(200).json(measurements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /measurements/{id}:
 *   get:
 *     summary: Get measurement by ID
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Measurement ID
 *     responses:
 *       200:
 *         description: Measurement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurement'
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id)
      .populate('station_id')
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }
    res.status(200).json(measurement)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /measurements:
 *   post:
 *     summary: Create a new measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measurement'
 *     responses:
 *       201:
 *         description: Measurement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurement'
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  try {
    const measurement = new Measurement(req.body)
    const saved = await measurement.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /measurements/{id}:
 *   put:
 *     summary: Update entire measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Measurement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measurement'
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurement'
 *       404:
 *         description: Measurement not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true }
    )
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }
    res.status(200).json(measurement)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /measurements/{id}:
 *   patch:
 *     summary: Update measurement partially
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Measurement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               station_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurement'
 *       404:
 *         description: Measurement not found
 *       400:
 *         description: Invalid input
 */
router.patch('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }
    res.status(200).json(measurement)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /measurements/{id}:
 *   delete:
 *     summary: Delete a measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Measurement ID
 *     responses:
 *       200:
 *         description: Measurement deleted successfully
 *       404:
 *         description: Measurement not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndDelete(req.params.id)
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }
    res.status(200).json({ message: 'Measurement deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 