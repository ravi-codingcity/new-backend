// redisClient.js
const Redis = require("redis");

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true, // Enables callback support
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
})();

module.exports = redisClient;
