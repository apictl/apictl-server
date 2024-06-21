const { createClient } = require("@clickhouse/client");
const dotenv = require("dotenv");

dotenv.config();

const clickHouse = createClient({
  url: new URL(process.env.CLICKHOUSE_URL),
});

const pushToClickHouse = async (data) => {
  await clickHouse.insert({
    table: "proxy_analytics",
    values: [data],
    format: "JSONEachRow",
  });
};

module.exports = {
  pushToClickHouse,
};
