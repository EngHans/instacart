import "dotenv/config";

import app from "./controllers/app";
import { setupSwagger } from "./controllers/routes/docs/swagger";

const port = process.env.APP_PORT || 3000;

setupSwagger(app);

app.listen(port, () => {
  console.log("INSTACART LISTENING ON PORT", port);
});
