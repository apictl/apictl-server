const { PrismaClient } = require("@prisma/client");
const { createClient } = require("redis");

const prisma = new PrismaClient();
const dotenv = require("dotenv");

dotenv.config();

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const invalidateEndpoint = async (endpoint) => {
  const redisId = `endpoint:${endpoint}`;
  await redis.del(redisId);
};

const getEndpointRecord = async (endpoint) => {
  const redisId = `endpoint:${endpoint}`;
  var endpointRecord = JSON.parse(await redis.get(redisId));
  console.log(a);
  if (
    endpointRecord == undefined ||
    endpointRecord == null ||
    Object.keys(endpointRecord).length === 0
  ) {
    endpointRecord = await prisma.endpoint.findUnique({
      where: {
        public_token: endpoint,
      },
      include: {
        injections: true,
      },
    });
    await redis.set(redisId, JSON.stringify(endpointRecord));
    await redis.expire(redisId, 3600);
  }
  return endpointRecord;
};

module.exports = {
  getEndpointRecord,
  invalidateEndpoint,
};
