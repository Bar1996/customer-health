# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Customer Health Dashboard using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git
- 4GB RAM minimum
- 10GB disk space

## Quick Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/Bar1996/customer-health
cd customer-health
```

### 2. Create Environment File

```bash
cp .env.example .env.production
```

Edit `.env.production` with your production settings:

```env
NODE_ENV=production
DATABASE_URL=postgres://postgres:postgres@db:5432/healthdb
```

### 3. Deploy the Application

```bash
docker-compose --env-file .env.production up --build
```

### 4. Verify Deployment

- **Dashboard**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/healthz
- **API Documentation**: http://localhost:3000/api/customers

## Detailed Deployment Steps

### Step 1: Environment Setup

1. **Create production environment file:**

   ```bash
   cat > .env.production << EOF
   NODE_ENV=production
   DATABASE_URL=postgres://postgres:your_secure_password@db:5432/healthdb
   PORT=3000
   ```

2. **Set secure passwords:**
   - Use a strong password for PostgreSQL
   - Consider using environment-specific secrets management

### Step 2: Database Initialization

The application automatically:

1. Creates the database schema
2. Seeds initial data if no customers exist
3. Sets up proper indexes and constraints

**Manual database setup (if needed):**

```bash
# Connect to database
docker exec -it customer-health-db-1 psql -U postgres -d healthdb

# Run schema initialization
\i /docker-entrypoint-initdb.d/schema.sql
```

### Step 3: Application Deployment

1. **Build and start services:**

   ```bash
   docker-compose --env-file .env.production up --build -d
   ```

2. **Check service status:**

   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Step 4: Health Verification

1. **Check API health:**

   ```bash
   curl http://localhost:3000/api/healthz
   ```

2. **Verify database connection:**

   ```bash
   curl http://localhost:3000/api/customers
   ```

3. **Test health score calculation:**
   ```bash
   curl http://localhost:3000/api/customers/1/health
   ```

## Production Considerations

### Security

1. **Change default passwords:**

   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Use secrets management:**

   ```bash
   # Create secrets file
   echo "your_secure_password" > .secrets
   chmod 600 .secrets
   ```

3. **Configure CORS for production:**
   ```javascript
   // In server/src/app.js
   app.use(
     cors({
       origin: ["https://yourdomain.com"],
       credentials: true,
     })
   );
   ```

### Performance

1. **Database optimization:**

   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_events_customer_id ON events(customer_id);
   CREATE INDEX idx_events_date ON events(event_date);
   CREATE INDEX idx_events_type ON events(event_type);
   ```

2. **Resource limits:**
   ```yaml
   # In docker-compose.yml
   services:
     server:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: "0.5"
   ```

### Monitoring

1. **Health check endpoint:**

   ```bash
   # Add to monitoring system
   curl -f http://localhost:3000/api/healthz || exit 1
   ```

2. **Log aggregation:**
   ```bash
   # Configure log drivers
   docker-compose logs --tail=100 -f server
   ```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using port 3000
   lsof -i :3000

   # Kill process or change port
   docker-compose down
   # Edit docker-compose.yml to use different port
   ```

2. **Database connection failed:**

   ```bash
   # Check database logs
   docker-compose logs db

   # Restart database
   docker-compose restart db
   ```

3. **Application won't start:**

   ```bash
   # Check application logs
   docker-compose logs server

   # Rebuild containers
   docker-compose down
   docker-compose up --build
   ```

### Debug Mode

1. **Enable debug logging:**

   ```bash
   # Set debug environment variable
   echo "DEBUG=true" >> .env.production
   docker-compose up --build
   ```

2. **Access container shell:**

   ```bash
   # Server container
   docker exec -it customer-health-server-1 sh

   # Database container
   docker exec -it customer-health-db-1 psql -U postgres
   ```

## Scaling

### Horizontal Scaling

1. **Load balancer setup:**

   ```yaml
   # docker-compose.yml
   services:
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
       depends_on:
         - server

     server:
       deploy:
         replicas: 3
   ```

2. **Database clustering:**
   ```yaml
   # Use external PostgreSQL cluster
   services:
     server:
       environment:
         DATABASE_URL: postgres://user:pass@cluster-endpoint:5432/healthdb
   ```

### Vertical Scaling

1. **Increase resources:**
   ```yaml
   # docker-compose.yml
   services:
     server:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: "1.0"
   ```

## Backup and Recovery

### Database Backup

1. **Create backup:**

   ```bash
   docker exec customer-health-db-1 pg_dump -U postgres healthdb > backup.sql
   ```

2. **Restore backup:**
   ```bash
   docker exec -i customer-health-db-1 psql -U postgres healthdb < backup.sql
   ```

### Application Backup

1. **Backup volumes:**

   ```bash
   docker run --rm -v customer-health_db_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz -C /data .
   ```

2. **Restore volumes:**
   ```bash
   docker run --rm -v customer-health_db_data:/data -v $(pwd):/backup alpine tar xzf /backup/db_backup.tar.gz -C /data
   ```

## Maintenance

### Regular Tasks

1. **Update dependencies:**

   ```bash
   # Update package.json files
   docker-compose down
   docker-compose up --build
   ```

2. **Database maintenance:**

   ```bash
   # Vacuum database
   docker exec customer-health-db-1 psql -U postgres -d healthdb -c "VACUUM ANALYZE;"
   ```

3. **Log rotation:**
   ```bash
   # Configure log rotation
   docker-compose logs --tail=1000 > logs/app-$(date +%Y%m%d).log
   ```

### Updates

1. **Application updates:**

   ```bash
   git pull origin main
   docker-compose down
   docker-compose up --build
   ```

2. **Database migrations:**
   ```bash
   # Run migration scripts
   docker exec customer-health-server-1 npm run migrate
   ```

## Screenshots

The following screenshots demonstrate the deployed application:

![Docker Compose](../screenshots/dockerCompose.png)

### Application UI

![Dashboard Overview](../screenshots/dashboard.png)
![Customer Health Score](../screenshots/customerHealthScore.png)
![Add Event Interface](../screenshots/addEventDashboard.png)

### API Responses

![GET Customers](../screenshots/getCustomers.png)
![GET Customer Health](../screenshots/getCustomerHealth.png)
![POST Add Event](../screenshots/postAddEvent.png)

### Tests

![Tests](../screenshots/tests.png)

## Support

For deployment issues or questions:

1. Check the logs: `docker-compose logs`
2. Verify environment variables: `docker-compose config`
3. Test individual services: `docker-compose exec server npm test`
4. Review the troubleshooting section above
