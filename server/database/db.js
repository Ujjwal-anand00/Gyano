const Database = require("better-sqlite3")

const db = new Database("learning.db")

// prevent locking
db.pragma("journal_mode = WAL")

// improve concurrency
db.pragma("synchronous = NORMAL")

module.exports = db