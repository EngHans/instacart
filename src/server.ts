import "dotenv/config";

import app from "./controllers/app";

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log("INSTACART LISTENING ON PORT", port);
});
