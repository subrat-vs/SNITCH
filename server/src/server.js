import app from "./app/app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";

let PORT = env.PORT;

await connectDB();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
