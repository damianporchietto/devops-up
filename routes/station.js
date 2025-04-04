const express = require('express')
const router = express.Router()
const Station = require('../models/station')
const { authenticateToken } = require('../middleware/auth')

/**
 * @swagger
 * components:
 *   schemas:
 *     Station:
 *       type: object
 *       required:
 *         - name
 *         - long
 *         - lat
 *         - type
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           description: Station name
 *         long:
 *           type: number
 *           description: Longitude coordinate
 *         lat:
 *           type: number
 *           description: Latitude coordinate
 *         type:
 *           type: string
 *           description: Type of station
 *         code:
 *           type: string
 *           description: Unique station code
 */

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by station name
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by station type
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.name) filter.name = req.query.name
    if (req.query.type) filter.type = req.query.type

    const stations = await Station.find(filter)
    res.status(200).json(stations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /stations/{id}:
 *   get:
 *     summary: Get station by ID
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     responses:
 *       200:
 *         description: Station found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findById(req.params.id)
    if (!station) {
      return res.status(404).json({ error: 'Station not found' })
    }
    res.status(200).json(station)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Create a new station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       201:
 *         description: Station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  try {
    const station = new Station(req.body)
    const saved = await station.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /stations/{id}:
 *   put:
 *     summary: Update entire station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true }
    )
    if (!station) {
      return res.status(404).json({ error: 'Station not found' })
    }
    res.status(200).json(station)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /stations/{id}:
 *   patch:
 *     summary: Update station partially
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               long:
 *                 type: number
 *               lat:
 *                 type: number
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *       400:
 *         description: Invalid input
 */
router.patch('/:id', async (req, res) => {
  try {
    const station = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!station) {
      return res.status(404).json({ error: 'Station not found' })
    }
    res.status(200).json(station)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /stations/{id}:
 *   delete:
 *     summary: Delete a station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
 *     responses:
 *       200:
 *         description: Station deleted successfully
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id)
    if (!station) {
      return res.status(404).json({ error: 'Station not found' })
    }
    res.status(200).json({ message: 'Station deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 