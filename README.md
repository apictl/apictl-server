# Facade

An API Gateway, which aims to keep your API Keys away from your frontend.

## Stack
- Node.js
- Express.js
- Redis
- Postgres
- Clickhouse
- Grafana
- Docker
- Geolite2

## How to use

1. Clone this repository

```bash
git clone https://github.com/MananGandhi1810/api-gateway
cd api-gateway
```

2. Run the Postgres and Redis containers

```bash
cd db-master
docker compose up
```

3. Run the API Gateway

```bash
cd gateway-server
npm install
npm run start
```

4. Run the Clickhouse and Grafana containers

```bash
cd clickhouse-grafana
docker compose up
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
