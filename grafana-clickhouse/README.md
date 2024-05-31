# Grafana Clickhouse

## Clickhouse

This is the Clickhouse database that will be used to store the data from the proxy server.
SQL to create the table is as follows:

```sql
CREATE TABLE IF NOT EXISTS proxy_analytics (
  id UUID NOT NULL DEFAULT generateUUIDv4(),
  response_time Float32 NOT NULL,
  origin String NOT NULL,
  project String NOT NULL,
  endpoint String NOT NULL,
  time DateTime64 NOT NULL,
  path String NOT NULL,
  user_agent String NOT NULL,
  status_code UInt16 NOT NULL,
  ip String NOT NULL
) ORDER BY time;
```
