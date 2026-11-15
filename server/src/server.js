import dns from "node:dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB();
    } else {
      console.warn("MONGO_URI is not configured; account features will be unavailable.");
    }

    app.listen(PORT, () => {
      console.log(`DSA Path server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
