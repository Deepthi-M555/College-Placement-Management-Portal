require("dotenv").config();
const connectDB = require("../config/db");

(async () => {
  try {
    await connectDB();
    console.log("DB test OK ✅");
    process.exit(0);
  } catch (e) {
    console.error("DB test failed ❌");
    process.exit(1);
  }
})();
