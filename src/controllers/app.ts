import cors from "cors";
import express from "express";
import morgan from "morgan";

import cartsRouter from "./routes/carts";
import { healthCheck, logError, logRequest, notFound } from "./utils/basics";

const router = express();
const logFormat =
  ":date[iso] :remote-addr :remote-user :method :url " +
  "HTTP/:http-version :status :res[content-length] - :response-time ms";

router.use(cors());
router.disable("x-powered-by");
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/", healthCheck);
router.get("/health", healthCheck);
router.use("/carts", cartsRouter);
router.use(morgan(logFormat));
router.use(logRequest);

router.use(notFound);
router.use(logError);

export default router;
