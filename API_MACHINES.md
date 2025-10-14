# Machines API Documentation

## Overview

The Machines API allows authenticated users to upload and manage cybersecurity training machines on the TaSave platform.

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### POST /api/machines

Upload a new machine to the platform.

#### Request Body

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "difficulty": "very_easy|easy|medium|hard (required)",
  "downloadLink": "string (required, valid URL)",
  "image": "string (optional, valid URL)",
  "creationDate": "string (optional, YYYY-MM-DD format)"
}
```

#### Example Request

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "name": "Web Exploitation Lab",
    "description": "A comprehensive web application security challenge featuring OWASP Top 10 vulnerabilities",
    "difficulty": "medium",
    "downloadLink": "https://example.com/web-lab.zip",
    "image": "https://example.com/web-lab-screenshot.jpg",
    "creationDate": "2024-01-15"
  }' \
  http://localhost:3000/api/machines
```

#### Success Response (201)

```json
{
  "success": true,
  "message": "Machine uploaded successfully",
  "machine": {
    "id": 123,
    "name": "Web Exploitation Lab",
    "description": "A comprehensive web application security challenge featuring OWASP Top 10 vulnerabilities",
    "difficulty": "medium",
    "downloadLink": "https://example.com/web-lab.zip",
    "image": "https://example.com/web-lab-screenshot.jpg",
    "creationDate": "2024-01-15",
    "author": "username",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "You must be logged in to upload machines"
}
```

**400 Bad Request**
```json
{
  "error": "Name, difficulty, and download link are required"
}
```

**400 Bad Request - Invalid Difficulty**
```json
{
  "error": "Invalid difficulty. Must be: very_easy, easy, medium, or hard"
}
```

**400 Bad Request - Invalid URL**
```json
{
  "error": "Invalid download link URL"
}
```

### GET /api/machines

Retrieve all machines from the platform.

#### Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer your_jwt_token" \
  http://localhost:3000/api/machines
```

#### Success Response (200)

```json
{
  "success": true,
  "machines": [
    {
      "id": 1,
      "name": "Basic Web Challenge",
      "description": "Learn basic web exploitation techniques",
      "difficulty": "easy",
      "downloadLink": "https://example.com/basic-web.zip",
      "image": "https://example.com/basic-web.jpg",
      "creationDate": "2024-01-10",
      "author": "admin",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

## Field Validation

### Required Fields
- `name`: Machine name (1-100 characters)
- `difficulty`: Must be one of: `very_easy`, `easy`, `medium`, `hard`
- `downloadLink`: Must be a valid URL

### Optional Fields
- `description`: Text description of the machine
- `image`: Valid URL to machine screenshot/logo
- `creationDate`: Date in YYYY-MM-DD format (defaults to current date)

### Automatic Fields
- `author`: Set to the authenticated user's username
- `createdAt`: Set to current timestamp
- `updatedAt`: Set to current timestamp

## Upload Guidelines

When uploading machines, please follow these guidelines:

1. **Security**: Ensure your machine is properly tested and doesn't contain malicious code
2. **Documentation**: Provide clear descriptions and learning objectives
3. **Accessibility**: Make sure download links are permanent and accessible
4. **Quality**: Test your machine thoroughly before uploading
5. **Difficulty**: Choose appropriate difficulty levels based on required skills
6. **Images**: Use high-quality screenshots or logos (optional but recommended)

## Rate Limits

- Maximum 10 machine uploads per user per day
- File size limits apply to linked downloads (recommended: < 2GB)

## Error Handling

All errors return appropriate HTTP status codes with JSON error messages. Common error scenarios:

- **Authentication failures**: 401 status
- **Validation errors**: 400 status  
- **Server errors**: 500 status

## Integration Examples

### JavaScript/TypeScript

```typescript
async function uploadMachine(machineData: {
  name: string;
  description?: string;
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard';
  downloadLink: string;
  image?: string;
  creationDate?: string;
}) {
  const response = await fetch('/api/machines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(machineData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}
```

### Python

```python
import requests

def upload_machine(token, machine_data):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(
        'http://localhost:3000/api/machines',
        json=machine_data,
        headers=headers
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"Upload failed: {response.json()['error']}")
```

## Support

For API support or questions, please:
- Check the documentation first
- Review error messages carefully
- Contact support at hello@tasave.dev
- Report bugs on GitHub Issues