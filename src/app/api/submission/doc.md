## Submission API

- **Method**: POST
- **URL**: `/api/submission`
- **Headers**:
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`

### Request Body (object array format)
```json
{
  "submission": [
    { "youtube": "https://youtube.com/..." },
    { "linkedin": "https://linkedin.com/..." }
  ]
}
```

Rules:
- `submission` must be a non-empty array
- Each item must be an object with exactly one key
- The value must be a valid `http` or `https` URL (will be trimmed)

Behavior:
- Upserts by `team_id` from the JWT: creates on first call, updates on subsequent calls
- Entire array is replaced on update

### Success Response (201)
```json
{ "message": "Submission saved successfully" }
```

### Error Responses
- 401: Missing/invalid token
```json
{ "error": "Unauthorized" }
```
- 400: Invalid body
```json
{ "error": "submission must be a non-empty array of objects" }
```
```json
{ "error": "Each submission item must be an object with exactly one http/https URL" }
```
- 500: Server error
```json
{ "error": "Failed to submit submission" }
```

