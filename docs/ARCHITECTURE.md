# Architecture Overview

## System Design

The Customer Health Dashboard is built as a modern, containerized web application following microservices principles with a clear separation between frontend and backend concerns.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │   PostgreSQL    │
│                 │    │                 │    │                 │
│  - Dashboard    │◄──►│  - REST API     │◄──►│  - Customers    │
│  - Components   │    │  - Controllers  │    │  - Events       │
│  - Hooks        │    │  - Services     │    │  - Health Data  │
│  - Services     │    │  - Routes       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Docker        │    │   Docker        │
│   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend (React Client)

**Technology Stack:**

- React 19 with functional components and hooks
- Vite for build tooling and development server
- TailwindCSS for styling
- Recharts for data visualization
- Axios for HTTP client

**Key Components:**

- `Dashboard` - Main application container
- `CustomerTable` - Displays customer list with actions
- `HealthPanel` - Shows detailed health information
- `AddEventModal` - Modal for adding new events
- `Modal` - Reusable modal component

**State Management:**

- Custom hooks (`useCustomers`, `useCustomerHealth`) for data fetching
- Local state for UI interactions
- API service layer for HTTP communication

**Data Flow:**

1. Components mount and trigger data fetching via hooks
2. Hooks call API service methods
3. API service makes HTTP requests to backend
4. Responses are processed and state is updated
5. Components re-render with new data

### Backend (Express Server)

**Technology Stack:**

- Node.js with Express framework
- PostgreSQL with pg driver
- CORS for cross-origin requests
- Morgan for request logging

**Key Components:**

- `app.js` - Express application setup and middleware
- `server.js` - Application bootstrap and startup
- `routes/customers.js` - API route definitions
- `controllers/customersController.js` - Request handling logic
- `services/healthService.js` - Business logic for health calculations
- `db/schema.js` - Database schema initialization

**Request Flow:**

1. HTTP request received by Express
2. Route handler processes the request
3. Controller validates input and calls service layer
4. Service layer performs business logic and database operations
5. Response is formatted and returned

### Database (PostgreSQL)

**Schema:**

- `customers` table - Customer master data
- `events` table - Customer interaction events
- Foreign key relationship between tables

**Data Model:**

```sql
customers:
  - id (SERIAL PRIMARY KEY)
  - name (VARCHAR(100))
  - segment (VARCHAR(50))
  - created_at (TIMESTAMP)

events:
  - id (SERIAL PRIMARY KEY)
  - customer_id (INT REFERENCES customers(id))
  - event_type (VARCHAR(50))
  - event_value (INT)
  - event_date (DATE)
```

## Key Design Decisions

### 1. Monorepo Structure

- Single repository containing both frontend and backend
- Shared configuration and deployment scripts
- Simplified development and deployment workflow

### 2. Containerization Strategy

- Multi-stage Docker builds for optimized image sizes
- Separate containers for database and application
- Docker Compose for local development and production

### 3. API Design

- RESTful API with clear resource-based URLs
- Consistent error handling and response formats
- Stateless design for scalability

### 4. Health Score Algorithm

- Multi-factor scoring system with weighted components
- Time-based windows for different event types
- Normalized scoring to prevent score inflation

### 5. Frontend Architecture

- Component-based design with clear separation of concerns
- Custom hooks for data fetching and state management
- Service layer abstraction for API communication

## Data Flow

### Customer Health Calculation Flow

1. **Event Collection**: Customer events are stored in the database
2. **Time Window Filtering**: Events are filtered by time windows (30/90 days)
3. **Factor Calculation**: Each factor is calculated independently
4. **Score Normalization**: Raw counts are normalized to prevent inflation
5. **Weighted Aggregation**: Factors are combined with appropriate weights
6. **Score Bounding**: Final score is bounded between 0-100

### User Interaction Flow

1. **Dashboard Load**: User opens dashboard, customers are fetched
2. **Customer Selection**: User clicks on a customer to view health details
3. **Health Calculation**: Backend calculates real-time health score
4. **Data Display**: Health information is displayed in modal
5. **Event Addition**: User can add new events via modal form
6. **Real-time Update**: Health score updates immediately after event addition

## Dependencies

### External Dependencies

- **PostgreSQL**: Primary database
- **Node.js**: Runtime environment
- **React**: Frontend framework
- **Docker**: Containerization platform

### Internal Dependencies

- **Express**: Web framework
- **pg**: PostgreSQL client
- **Axios**: HTTP client
- **TailwindCSS**: CSS framework
- **Recharts**: Charting library

## Scalability Considerations

### Current Limitations

- Single database instance
- No caching layer
- No load balancing
- No authentication/authorization

### Future Improvements

- Database clustering and read replicas
- Redis caching layer
- Load balancer for multiple server instances
- JWT-based authentication
- API rate limiting
- Database connection pooling

## Security Considerations

### Current Security Measures

- CORS configuration
- Input validation in controllers
- SQL parameterization to prevent injection
- Error handling without sensitive data exposure

### Security Improvements Needed

- Authentication and authorization
- Input sanitization
- Rate limiting
- HTTPS enforcement
- Security headers
- Audit logging

## Monitoring and Observability

### Current Monitoring

- Basic request logging with Morgan
- Console logging for errors
- Health check endpoint

### Recommended Additions

- Application performance monitoring (APM)
- Database query monitoring
- Error tracking and alerting
- Metrics collection and dashboards
- Log aggregation and analysis

## Deployment Architecture

### Development Environment

- Docker Compose with local PostgreSQL
- Hot reloading for both frontend and backend
- Direct database access for debugging

### Production Environment

- Containerized deployment with Docker
- Environment-specific configuration
- Database persistence with volumes
- Health checks and restart policies

## Testing Strategy

### Backend Testing

- Unit tests for business logic (health service)
- Integration tests for API endpoints
- Database tests with test data isolation

### Frontend Testing

- Component testing (recommended for future)
- API integration testing
- End-to-end testing (recommended for future)

### Test Coverage

- Health score calculation logic
- API endpoint functionality
- Database operations
- Error handling scenarios
