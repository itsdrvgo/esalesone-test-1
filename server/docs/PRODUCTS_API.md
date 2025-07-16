# Products API - Updated Schema

## Overview

The products model has been updated to focus on financial metrics for front-end display. The new schema tracks essential business metrics for product performance analysis.

## New Schema Fields

| Field                  | Type   | Description                                        | Frontend Display |
| ---------------------- | ------ | -------------------------------------------------- | ---------------- |
| `productId`            | String | Unique product identifier                          | Product ID       |
| `name`                 | String | Product name                                       | Product Name     |
| `orderNo`              | Number | Number of orders                                   | Order No.        |
| `grossRevenue`         | Number | Total revenue before expenses                      | Gross Revenue    |
| `expense`              | Number | Total expenses (12% txn + 15% other)               | Txn 12%, 15%     |
| `refunds`              | Number | Total refund amount                                | Refunds          |
| `profitAndLoss`        | Number | Net profit/loss (grossRevenue - expense - refunds) | -/+ P&L          |
| `profitAndLossPerUnit` | Number | Profit/loss per order                              | P&L per Unit     |

## API Endpoints

### GET `/api/products`

Returns all target products with their financial metrics.

**Response:**

```json
{
  "data": {
    "products": [...],
    "total": 5
  }
}
```

### GET `/api/products/analytics`

Returns aggregated analytics and individual product metrics.

**Response:**

```json
{
  "data": {
    "summary": {
      "totalProducts": 5,
      "totalGrossRevenue": 15000.50,
      "totalExpense": 4050.14,
      "totalRefunds": 500.00,
      "totalProfitAndLoss": 10450.36,
      "totalOrderNo": 125,
      "avgProfitPerOrder": "83.60"
    },
    "products": [...]
  }
}
```

### GET `/api/products/sync`

Syncs product data from external API and updates financial metrics.

**Response:**

```json
{
  "data": {
    "summary": {
      "total": 5,
      "created": 2,
      "updated": 3,
      "skipped": 10
    },
    "products": [...]
  }
}
```

## Migration

If you have existing data with the old schema, run the migration script:

```bash
bun run scripts/migrate-products.js
```

This will:

1. Map old fields to new fields
2. Calculate expenses (27% of gross revenue)
3. Set default values for new fields
4. Remove deprecated fields

## Removed Fields

The following fields have been removed as they're no longer needed:

- `sku`
- `category_id`
- `cost`
- `price`
- `totalRevenue` (renamed to `grossRevenue`)
- `totalOrders` (renamed to `orderNo`)
- `totalQuantitySold`
- `profitMargin`
- `averageOrderValue`
- `lastUpdated`
- `isActive`

## Business Logic

### Expense Calculation

- Transaction fees: 12% of gross revenue
- Other expenses: 15% of gross revenue
- Total expense: 27% of gross revenue

### Profit & Loss Calculation

```
profitAndLoss = grossRevenue - expense - refunds
profitAndLossPerUnit = profitAndLoss / orderNo
```

## Frontend Display

The data structure is optimized for frontend table display:

| Product ID | Product Name | Order No. | Gross Revenue | Txn 12%, 15% | Refunds | -/+ P&L   | P&L per Unit |
| ---------- | ------------ | --------- | ------------- | ------------ | ------- | --------- | ------------ |
| 2142       | Product A    | 25        | $5,000.00     | $1,350.00    | $100.00 | $3,550.00 | $142.00      |

## Data Flow

1. **Sync Process** (`/sync`):
    - Fetches product info from external API
    - Retrieves order data for last 30 days
    - Calculates financial metrics
    - Updates database

2. **Analytics** (`/analytics`):
    - Aggregates all product metrics
    - Provides summary statistics
    - Returns formatted data for charts/reports

3. **List Products** (`/`):
    - Returns current product data
    - Sorted by gross revenue (descending)
    - Ready for table display
