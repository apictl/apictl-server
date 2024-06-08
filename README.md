# Aegis Gateway Server

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

1. Run the Postgres and Redis Container

```bash
git clone https://github.com/Aegis-Gateway/Aegis-Database
cd Aegis-Database
docker compose up
```

2. Run the Clickhouse and Grafana Container

```bash
git clone https://github.com/Aegis-Gateway/Aegis-Analytics
cd Aegis-Analytics
docker compose up
```

3. Run the Aegis Gateway Server Container

```bash
git clone https://github.com/Aegis-Gateway/Aegis-Gateway-Server
cd Aegis-Gateway-Server
docker compose up
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
