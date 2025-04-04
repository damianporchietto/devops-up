# Meteorological Stations API

A secure API for managing meteorological stations and their measurements.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the following variables:
  - `MONGO_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A secure secret key for JWT tokens
  - `ADMIN_USERNAME`: Initial admin username
  - `ADMIN_PASSWORD`: Initial admin password

3. Create the initial admin user:
```bash
node createAdmin.js
```

## User Management

This API uses a secure authentication system where:
- User registration is not available via API
- New users can only be created by system administrators
- User management should be done through secure channels (e.g., direct database access or admin tools)

### Creating Additional Users

To create additional users, you have two options:

1. Direct MongoDB access (secure environment only):
```javascript
db.users.insertOne({
  username: "newuser",
  password: "<hashed_password>", // Must be hashed with bcrypt
  role: "user" // or "admin"
})
```

2. Create an admin tool (recommended for production):
- Create a separate admin CLI tool
- Ensure it's only accessible by authorized personnel
- Use proper authentication and authorization

## API Usage

1. Login with your credentials:
```bash
POST /auth/login
{
  "username": "your_username",
  "password": "your_password"
}
```

2. Use the returned JWT token in the Authorization header for all other requests:
```bash
Authorization: Bearer <your_token>
```

## Security Notes

- Change the admin password immediately after first login
- Keep the JWT_SECRET secure and unique per environment
- Regularly rotate the JWT_SECRET in production
- Monitor and audit user access regularly
- Consider implementing rate limiting for production use