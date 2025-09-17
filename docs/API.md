# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### 1. Health Check

**GET** `/api/healthz`

Simple health check endpoint to verify the API is running.

**Response:**

```json
{
  "ok": true
}
```

**Status Codes:**

- `200` - Service is healthy

---

### 2. Get All Customers

**GET** `/api/customers`

Retrieves a list of all customers in the system.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Acme Corporation",
    "segment": "enterprise",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "StartupXYZ",
    "segment": "startup",
    "created_at": "2024-01-16T14:20:00.000Z"
  }
]
```

**Status Codes:**

- `200` - Success
- `500` - Internal server error

---

### 3. Get Customer Health

**GET** `/api/customers/:id/health`

Retrieves detailed health information for a specific customer.

**Parameters:**

- `id` (path, required) - Customer ID

**Response:**

```json
{
  "customer": {
    "id": 1,
    "name": "Acme Corporation",
    "segment": "enterprise",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "health": {
    "score": 85,
    "factors": {
      "logins": 15,
      "features": 8,
      "apiCalls": 45,
      "tickets": 2,
      "lateInvoices": 0
    }
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Customer not found
- `500` - Internal server error

**Error Response:**

```json
{
  "error": "Customer not found"
}
```

---

### 4. Add Customer Event

**POST** `/api/customers/:id/events`

Adds a new event for a specific customer.

**Parameters:**

- `id` (path, required) - Customer ID

**Request Body:**

```json
{
  "event_type": "login",
  "event_value": 1,
  "event_date": "2024-01-20"
}
```

**Request Body Fields:**

- `event_type` (string, required) - Type of event. Valid values:
  - `login` - Customer login
  - `feature_usage` - Feature usage event
  - `api_call` - API call event
  - `support_ticket` - Support ticket created
  - `invoice_late` - Late invoice payment
- `event_value` (number, optional) - Event value (default: 1)
- `event_date` (string, optional) - Event date in YYYY-MM-DD format (default: current date)

**Response:**

```json
{
  "id": 123,
  "customer_id": 1,
  "event_type": "login",
  "event_value": 1,
  "event_date": "2024-01-20T00:00:00.000Z"
}
```

**Status Codes:**

- `201` - Event created successfully
- `400` - Bad request (missing required fields)
- `404` - Customer not found
- `500` - Internal server error

**Error Responses:**

Missing event_type:

```json
{
  "error": "event_type is required"
}
```

Customer not found:

```json
{
  "error": "Customer not found"
}
```

---

## Data Models

### Customer

```typescript
interface Customer {
  id: number;
  name: string;
  segment: "enterprise" | "SMB" | "startup";
  created_at: string;
}
```

### Event

```typescript
interface Event {
  id: number;
  customer_id: number;
  event_type:
    | "login"
    | "feature_usage"
    | "api_call"
    | "support_ticket"
    | "invoice_late";
  event_value: number;
  event_date: string;
}
```

### Health Score

```typescript
interface HealthScore {
  score: number; // 0-100
  factors: {
    logins: number;
    features: number;
    apiCalls: number;
    tickets: number;
    lateInvoices: number;
  };
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages. The API uses standard HTTP status codes:

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a descriptive error message in the response body:

```json
{
  "error": "Descriptive error message"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API is configured to accept requests from any origin. In production, configure CORS to restrict access to trusted domains.

## Examples

### Get all customers

```bash
curl -X GET http://localhost:3000/api/customers
```

### Get customer health

```bash
curl -X GET http://localhost:3000/api/customers/1/health
```

### Add a login event

```bash
curl -X POST http://localhost:3000/api/customers/1/events \
  -H "Content-Type: application/json" \
  -d '{"event_type": "login", "event_value": 1}'
```

### Add a feature usage event

```bash
curl -X POST http://localhost:3000/api/customers/1/events \
  -H "Content-Type: application/json" \
  -d '{"event_type": "feature_usage", "event_date": "2024-01-20"}'
```
