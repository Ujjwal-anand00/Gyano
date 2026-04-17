const NodeCache = require("node-cache");

// TTL = 60 seconds (you can increase later)
const cache = new NodeCache({ stdTTL: 60 });

module.exports = cache;