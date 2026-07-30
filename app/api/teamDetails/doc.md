## Team Details API

- **Method**: GET
- **URL**: `/api/teamDetails`
- **Headers**: `Authorization: Bearer <JWT>`

### Success Response (200)
```json
{
  "status": true,
  "message": "Team details fetched successfully",
  "team": {
    "_id": "<team_id>",
    "team_name": "...",
    "team_size": 1,
    "idea_title": "...",
    "participants": [
      {
        "name": "...",
        "email": "...",
        "age": 20,
        "phone": "...",
        "student_or_professional": "student|professional",
        "college_or_company_name": "...",
        "linkedin_profile": "...",
        "github_profile": "...",
        "devfolio_profile": "...",
        "_id": "..."
      }
    ],
    "status": "registered|approved|rejected",
    "createdAt": "...",
    "updatedAt": "...",
    "__v": 0
  }
}
```

Note: `idea_document_url` and `selected` are intentionally excluded.

### Error Responses
- 401: Missing/invalid token
```json
{ "status": false, "message": "Invalid or expired token" }
```
- 404: Team not found
```json
{ "status": false, "message": "Team not found" }
```
- 500: Server error
```json
{ "status": false, "message": "Error fetching team details" }
```

