const path = require('path')
const dotenv = (process.env.DOTENV_PATH || path.resolve(__dirname, './.env'))
require('dotenv').config({ path: dotenv })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err)
  process.exit(1)
})

// User Schema (copy from app.js)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true, versionKey: false })

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

const User = mongoose.model('User', userSchema)

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    // Create new admin user
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    })

    await adminUser.save()
    console.log('Admin user created successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser() 