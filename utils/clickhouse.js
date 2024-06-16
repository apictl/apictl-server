const { createClient } = require("@clickhouse/client");
const dotenv = require("dotenv");

dotenv.config();

const client = createClient({
  url: new URL(process.env.CLICKHOUSE_URL),
});

const pushToClickHouse = async (data) => {
  await client.insert({
    table: "proxy_analytics",
    values: [data],
    format: "JSONEachRow",
  });
};

module.exports = {
  pushToClickHouse,
};
