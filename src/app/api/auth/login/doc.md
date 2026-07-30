## Auth Login API

- **Method**: POST
- **URL**: `/api/auth/login`
- **Headers**: `Content-Type: application/json`

### Request Body
```json
{
  "username": "team_vishleshana_5026480",
  "password": "<plain-text-password>"
}
```

### Success Response (200)
```json
{
  "status": true,
  "message": "Login successful",
  "token": "<JWT>"
}
```

### Error Responses
- 400: Missing or invalid body
```json
{ "status": false, "message": "Invalid request body" }
```
```json
{ "status": false, "message": "Email and password are required" }
```
- 404: User not found
```json
{ "status": false, "message": "User not found" }
```
- 401: Invalid password
```json
{ "status": false, "message": "Invalid password" }
```
- 500: Server error
```json
{ "status": false, "message": "An error occurred during login" }
```

