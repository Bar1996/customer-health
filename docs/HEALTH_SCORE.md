# Health Score Methodology

## Overview

The Customer Health Score is a comprehensive metric that quantifies the health of customer relationships based on their engagement patterns, usage behavior, and support interactions. The score ranges from 0 to 100, with higher scores indicating healthier customer relationships.

## Scoring Framework

The health score is calculated using five key factors, each with specific weights and time windows:

| Factor          | Weight    | Time Window | Impact   |
| --------------- | --------- | ----------- | -------- |
| Login Activity  | 25 points | 30 days     | Positive |
| Feature Usage   | 25 points | 30 days     | Positive |
| API Engagement  | 20 points | 30 days     | Positive |
| Support Tickets | 20 points | 30 days     | Negative |
| Payment Health  | 10 points | 90 days     | Negative |

**Total: 100 points**

## Factor Details

### 1. Login Activity (25 points)

**Purpose**: Measures customer engagement and platform adoption.

**Calculation**:

- Counts login events in the last 30 days
- Normalized to a maximum of 12 logins (2+ logins per week)
- Formula: `Math.min(logins / 12, 1) * 25`

**Scoring Scale**:

- 0 logins = 0 points
- 6 logins = 12.5 points
- 12+ logins = 25 points

**Rationale**: Regular logins indicate active platform usage and customer engagement. The 12-login ceiling prevents score inflation from excessive login events while rewarding consistent usage patterns.

### 2. Feature Usage (25 points)

**Purpose**: Measures product adoption and feature exploration.

**Calculation**:

- Counts feature usage events in the last 30 days
- Normalized to a maximum of 8 feature usages
- Formula: `Math.min(features / 8, 1) * 25`

**Scoring Scale**:

- 0 features = 0 points
- 4 features = 12.5 points
- 8+ features = 25 points

**Rationale**: Feature usage indicates product value realization and customer investment in the platform. The 8-feature ceiling encourages diverse feature adoption without penalizing power users.

### 3. API Engagement (20 points)

**Purpose**: Measures technical integration and automation usage.

**Calculation**:

- Sums API call values in the last 30 days
- Normalized to a maximum of 100 API calls
- Formula: `Math.min(apiCalls / 100, 1) * 20`

**Scoring Scale**:

- 0 API calls = 0 points
- 50 API calls = 10 points
- 100+ API calls = 20 points

**Rationale**: API usage indicates technical integration depth and automation adoption. The 100-call ceiling prevents score inflation from high-volume integrations while rewarding meaningful API engagement.

### 4. Support Tickets (20 points)

**Purpose**: Measures support burden and potential satisfaction issues.

**Calculation**:

- Counts support ticket events in the last 30 days
- Inverted scoring (more tickets = lower score)
- Formula: `(1 - Math.min(tickets / 6, 1)) * 20`

**Scoring Scale**:

- 0 tickets = 20 points
- 3 tickets = 10 points
- 6+ tickets = 0 points

**Rationale**: Support tickets often indicate product issues, confusion, or dissatisfaction. The inverted scoring penalizes excessive support usage while allowing for reasonable support needs.

### 5. Payment Health (10 points)

**Purpose**: Measures financial health and payment reliability.

**Calculation**:

- Counts late invoice events in the last 90 days
- Inverted scoring (more late payments = lower score)
- Formula: `(1 - Math.min(lateInvoices / 2, 1)) * 10`

**Scoring Scale**:

- 0 late invoices = 10 points
- 1 late invoice = 5 points
- 2+ late invoices = 0 points

**Rationale**: Payment issues can indicate financial stress or dissatisfaction. The 90-day window provides a longer view of payment patterns, while the 2-invoice ceiling allows for occasional payment delays.

## Time Windows

### 30-Day Window

Used for engagement metrics (logins, features, API calls, support tickets) to capture recent activity patterns and ensure the score reflects current customer behavior.

### 90-Day Window

Used for payment health to provide a longer view of financial patterns and account for seasonal variations in payment cycles.

## Score Calculation Process

1. **Event Retrieval**: Fetch all events for the customer
2. **Time Filtering**: Apply appropriate time windows to events
3. **Factor Calculation**: Calculate each factor independently
4. **Normalization**: Apply ceiling functions to prevent score inflation
5. **Weighted Sum**: Combine factors with their respective weights
6. **Score Bounding**: Ensure final score is between 0-100

## Example Calculations

### High-Health Customer

```
Events (last 30 days):
- 15 logins
- 10 feature usages
- 120 API calls
- 1 support ticket
- 0 late invoices (last 90 days)

Calculation:
- Login Score: min(15/12, 1) * 25 = 25 points
- Feature Score: min(10/8, 1) * 25 = 25 points
- API Score: min(120/100, 1) * 20 = 20 points
- Ticket Score: (1 - min(1/6, 1)) * 20 = 16.67 points
- Invoice Score: (1 - min(0/2, 1)) * 10 = 10 points

Total: 25 + 25 + 20 + 16.67 + 10 = 96.67 → 97 points
```

### Low-Health Customer

```
Events (last 30 days):
- 2 logins
- 1 feature usage
- 5 API calls
- 8 support tickets
- 3 late invoices (last 90 days)

Calculation:
- Login Score: min(2/12, 1) * 25 = 4.17 points
- Feature Score: min(1/8, 1) * 25 = 3.13 points
- API Score: min(5/100, 1) * 20 = 1 point
- Ticket Score: (1 - min(8/6, 1)) * 20 = 0 points
- Invoice Score: (1 - min(3/2, 1)) * 10 = 0 points

Total: 4.17 + 3.13 + 1 + 0 + 0 = 8.3 → 8 points
```

## Score Interpretation

### Score Ranges

- **90-100**: Excellent health - Highly engaged, low support burden
- **70-89**: Good health - Regular usage, manageable issues
- **50-69**: Moderate health - Some engagement, potential concerns
- **30-49**: Poor health - Limited engagement, multiple issues
- **0-29**: Critical health - Minimal engagement, significant problems

### Actionable Insights

**High Scores (70+)**: Continue current engagement strategies, identify success patterns for replication.

**Medium Scores (30-69)**: Investigate specific factors, implement targeted engagement programs.

**Low Scores (0-29)**: Immediate intervention required, consider account management or support escalation.

## Algorithm Rationale

### Why These Factors?

1. **Engagement Metrics**: Login and feature usage directly measure customer value realization
2. **Technical Integration**: API usage indicates deeper platform adoption
3. **Support Burden**: Support tickets often correlate with satisfaction issues
4. **Financial Health**: Payment patterns indicate overall relationship health

### Why These Weights?

- **Engagement (50%)**: Primary indicators of customer health
- **Technical Integration (20%)**: Important but not as critical as engagement
- **Support Burden (20%)**: Significant indicator of potential churn
- **Financial Health (10%)**: Important but often influenced by external factors

### Why These Ceilings?

- **Prevents Score Inflation**: Prevents customers from gaming the system
- **Encourages Balanced Usage**: Rewards diverse engagement patterns
- **Realistic Expectations**: Based on typical customer behavior patterns

## Limitations and Considerations

### Current Limitations

1. **No Industry Context**: All customers scored equally regardless of industry
2. **No Customer Segment Weighting**: Enterprise vs. startup customers treated identically
3. **No Seasonal Adjustments**: No accounting for business cycles or seasonality
4. **Binary Event Types**: No granularity in event severity or impact

### Future Enhancements

1. **Segmented Scoring**: Different weights for different customer segments
2. **Industry Adjustments**: Industry-specific scoring criteria
3. **Trend Analysis**: Incorporate score trends over time
4. **Event Severity**: Weight events by severity or impact
5. **Predictive Modeling**: Machine learning-based health predictions

## Implementation Notes

The health score calculation is implemented in `server/src/services/healthService.js` with the following key functions:

- `calculateHealthScore(customerId)`: Main calculation function
- `addEvent(customerId, eventType, eventValue, eventDate)`: Event addition function

The algorithm is designed to be:

- **Deterministic**: Same inputs always produce same outputs
- **Efficient**: Single database query with in-memory calculations
- **Extensible**: Easy to add new factors or modify weights
- **Testable**: Clear separation of concerns for unit testing
