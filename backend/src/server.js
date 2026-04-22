require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PrepFlow API listening on http://localhost:${PORT}`);
  connectDB().catch((err) => {
    console.error("MongoDB connection failed — auth and DB routes will return 503 until this is fixed.");
    console.error(err.message);
    if (process.env.EXIT_ON_DB_FAILURE === "1") {
      console.error("EXIT_ON_DB_FAILURE=1 set — exiting.");
      process.exit(1);
    }
  });
});
